import React, { useState, useRef, useEffect } from 'react';
import iconMic from '../../icons/Plus.svg';

export default function AudioRecorder({ onSend }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingIntervalRef = useRef(null);
  const recordingStartRef = useRef(null);
  const [pendingAudio, setPendingAudio] = useState(null); // { blob, url, duration, secs, time }
  const [pendingPlaying, setPendingPlaying] = useState(false);

  const formatTime = (secs) => {
    if (secs === undefined || secs === null) return '0:00';
    const s = Math.max(0, Math.floor(secs));
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${mm}:${String(ss).padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mr = new MediaRecorder(stream);
      const chunks = [];
      mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const tmp = document.createElement('audio');
        tmp.src = url;
        tmp.addEventListener('loadedmetadata', () => {
          const dur = tmp.duration || 0;
          const secs = Math.max(0, Math.round(dur));
          const mm = Math.floor(secs / 60);
          const ss = secs % 60;
          const formatted = `${mm}:${String(ss).padStart(2, '0')}`;
          setPendingAudio({ blob, url, duration: formatted, secs, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
        });
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(t => t.stop());
          mediaStreamRef.current = null;
        }
      };
      mediaRecorderRef.current = mr;
      mr.start();
      recordingStartRef.current = Date.now();
      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds(Math.floor((Date.now() - recordingStartRef.current) / 1000));
      }, 500);
      setIsRecording(true);
    } catch (err) {
      console.error('Erro ao iniciar microfone', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
      if (pendingAudio && pendingAudio.url) URL.revokeObjectURL(pendingAudio.url);
    };
  }, []);

  const toggleRecord = () => {
    if (!isRecording) return startRecording();
    stopRecording();
  };

  const togglePlay = () => {
    if (!pendingAudio) return;
    const el = document.getElementById('audio-recorder-preview');
    if (!el) return;
    if (pendingPlaying) { el.pause(); setPendingPlaying(false); return; }
    el.onended = () => setPendingPlaying(false);
    el.play();
    setPendingPlaying(true);
  };

  const discard = () => {
    if (pendingAudio && pendingAudio.url) URL.revokeObjectURL(pendingAudio.url);
    setPendingAudio(null);
    setPendingPlaying(false);
  };

  const doSend = () => {
    if (!pendingAudio) return;
    if (onSend) onSend(pendingAudio);
    // clear local preview
    setPendingAudio(null);
    setPendingPlaying(false);
  };

  return (
    <div className="audio-recorder">
      {pendingAudio ? (
        <div className="composer-preview">
          <button className="play-btn" onClick={togglePlay} aria-label="Play/Pause">{pendingPlaying ? '⏸' : '▶'}</button>
          <div className="audio-meta">
            <span className="audio-label">Pré-visualização</span>
            <span className="audio-duration">{pendingAudio.duration}</span>
          </div>
          <audio id="audio-recorder-preview" src={pendingAudio.url} />
          <div className="composer-actions">
            <button className="btn-delete-audio" onClick={discard} aria-label="Excluir áudio">❌</button>
            <button className="btn-send" onClick={doSend} aria-label="Enviar áudio">Enviar</button>
          </div>
        </div>
      ) : (
        <button className={`btn-audio ${isRecording ? 'recording' : ''}`} onClick={toggleRecord} aria-label="Gravar áudio">
          <img src={iconMic} alt="microfone" />
        </button>
      )}
    </div>
  );
}

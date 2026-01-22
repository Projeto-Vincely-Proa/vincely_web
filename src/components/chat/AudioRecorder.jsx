import React, { useState, useRef, useEffect } from 'react';
import iconMic from '../../icons/Plus.svg';

// Componente para gravar e enviar áudio
export default function AudioRecorder({ onSend }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  
  const recordingIntervalRef = useRef(null);
  const recordingStartRef = useRef(null);
  const [pendingAudio, setPendingAudio] = useState(null); 
  const [pendingPlaying, setPendingPlaying] = useState(false);



  // Inicia a gravação de áudio
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
      // Intervalo removido pois setRecordingSeconds não existe mais
      setIsRecording(true);
    } catch (err) {
      console.error('Erro ao iniciar microfone', err);
    }
  };

  // Para a gravação de áudio
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

  // Limpeza de recursos ao desmontar
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
  }, [pendingAudio]);

  // Alterna entre iniciar e parar gravação
  const toggleRecord = () => {
    if (!isRecording) return startRecording();
    stopRecording();
  };

  // Alterna entre play/pause do áudio gravado
  const togglePlay = () => {
    if (!pendingAudio) return;
    const el = document.getElementById('audio-recorder-preview');
    if (!el) return;
    if (pendingPlaying) { el.pause(); setPendingPlaying(false); return; }
    el.onended = () => setPendingPlaying(false);
    el.play();
    setPendingPlaying(true);
  };

  // Descarta o áudio gravado
  const discard = () => {
    if (pendingAudio && pendingAudio.url) URL.revokeObjectURL(pendingAudio.url);
    setPendingAudio(null);
    setPendingPlaying(false);
  };

  // Envia o áudio gravado
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

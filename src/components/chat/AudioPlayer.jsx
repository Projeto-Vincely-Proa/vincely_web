import React from 'react';

export default function AudioPlayer({ m, playingId, audioProgress, togglePlay, seekAudio, formatTime }) {
  return (
    <div className="message-audio">
      <button className="play-btn" onClick={() => togglePlay(m)} aria-label="Play/Pause">{playingId === m.id ? '⏸' : '▶'}</button>
      <div className="audio-meta">
        <span className="audio-label">Áudio</span>
        <span className="audio-duration">{formatTime((audioProgress[m.id] && audioProgress[m.id].current) ? audioProgress[m.id].current : 0)} / {m.duration || '0:00'}</span>
        <div className="audio-progress" onClick={(e) => seekAudio(m, e)} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={(audioProgress[m.id] && audioProgress[m.id].percent) ? Math.round(audioProgress[m.id].percent) : 0}>
          <div className="audio-progress-fill" style={{ width: `${(audioProgress[m.id] && audioProgress[m.id].percent) ? audioProgress[m.id].percent + '%' : '0%'}` }} />
        </div>
      </div>
      <audio id={`audio-${m.id}`} src={m.audioUrl} />
    </div>
  );
}

import React from 'react';
import AudioPlayer from './AudioPlayer';

function MessageBubble({ m, playingId, audioProgress, togglePlay, seekAudio, openLightbox, formatTime }) {
  return (
    <div className={`message ${m.sender === 'me' ? 'message--mine' : 'message--their'}`}>
      {m.mediaUrl ? (
        m.mediaType === 'image' ? (
          <img className="message-media" src={m.mediaUrl} alt={m.mediaName || 'mídia'} onClick={() => openLightbox(m.id)} style={{ cursor: 'pointer' }} />
        ) : (
          <video className="message-media" src={m.mediaUrl} controls onClick={() => openLightbox(m.id)} style={{ cursor: 'pointer' }} />
        )
      ) : m.audioUrl ? (
        <AudioPlayer m={m} playingId={playingId} audioProgress={audioProgress} togglePlay={togglePlay} seekAudio={seekAudio} formatTime={formatTime} />
      ) : (
        m.text ? <div className="message-text">{m.text}</div> : null
      )}
      <div className="message-time">{m.time}</div>
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  const p = prevProps, n = nextProps;
  if (p.playingId !== n.playingId) return false;
  const prevAudio = (p.audioProgress && p.audioProgress[p.m.id]) || {};
  const nextAudio = (n.audioProgress && n.audioProgress[n.m.id]) || {};
  if ((prevAudio.current || 0) !== (nextAudio.current || 0) || (prevAudio.percent || 0) !== (nextAudio.percent || 0)) return false;
  const m1 = p.m || {};
  const m2 = n.m || {};
  if (m1.id !== m2.id) return false;
  if (m1.text !== m2.text) return false;
  if (m1.mediaUrl !== m2.mediaUrl) return false;
  if (m1.audioUrl !== m2.audioUrl) return false;
  if (m1.time !== m2.time) return false;
  return true;
}

export default React.memo(MessageBubble, areEqual);

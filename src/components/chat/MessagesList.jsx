import React from 'react';
import MessageBubble from './MessageBubble';

export default function MessagesList({ messages = [], playingId, audioProgress, togglePlay, seekAudio, openLightbox, formatTime }) {
  return (
    <div className="messages-area">
      {messages.map(m => (
        <MessageBubble
          key={m.id}
          m={m}
          playingId={playingId}
          audioProgress={audioProgress}
          togglePlay={togglePlay}
          seekAudio={seekAudio}
          openLightbox={openLightbox}
          formatTime={formatTime}
        />
      ))}
    </div>
  );
}

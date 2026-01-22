import React from 'react';

export default function ChatHeader({ selectedUser, children, onBack }) {
  if (!selectedUser) return null;
  return (
    <header className="chat-header">
      <button className="chat-back-btn" onClick={onBack} aria-label="Voltar">←</button>
      <img src={selectedUser.avatar} alt={selectedUser.name} />
      <div className="chat-header-info">
        <div className="chat-header-top">
          <h3>{selectedUser.name}</h3>
          <span className={`status-dot ${selectedUser.online ? 'online' : 'offline'}`}></span>
          <span className="status-text">{selectedUser.online ? 'online' : 'offline'}</span>
        </div>
        <div className="chat-header-bottom">
          <span className="chat-time">{selectedUser.time}</span>
        </div>
      </div>
      {children}
    </header>
  );
}

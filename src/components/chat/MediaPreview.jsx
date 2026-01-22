import React from 'react';
import IconTrash from '../../icons/trash.svg';

export default function MediaPreview({ pendingMedia, onDiscard, onSend, inline = false }) {
  if (!pendingMedia) return null;
  if (inline) {
    return (
      <div className="composer-preview composer-inline-inline">
        {pendingMedia.type === 'image' ? (
          <img className="media-thumb" src={pendingMedia.url} alt={pendingMedia.name} />
        ) : (
          <video className="media-thumb" src={pendingMedia.url} />
        )}
        <button className="btn-delete-inline" onClick={onDiscard} aria-label="Excluir mídia">
          <img src={IconTrash} alt="Excluir" />
        </button>
      </div>
    );
  }
  const className = 'composer-preview composer-preview-top';
  return (
    <div className={className}>
      <div className="media-left">
        {pendingMedia.type === 'image' ? (
          <img className="media-thumb" src={pendingMedia.url} alt={pendingMedia.name} />
        ) : (
          <video className="media-thumb" src={pendingMedia.url} />
        )}
      </div>
      <div className="media-right">
        <div className="audio-meta media-meta">
          <span className="audio-label">{pendingMedia.name}</span>
          <span className="audio-duration">{pendingMedia.time}</span>
        </div>
        <div className="composer-actions">
          <button className="btn-delete-audio" onClick={onDiscard} aria-label="Excluir mídia">
            <img src={IconTrash} alt="Excluir" />
          </button>
          <button className="btn-send" onClick={onSend} aria-label="Enviar mídia">Enviar</button>
        </div>
      </div>
    </div>
  );
}

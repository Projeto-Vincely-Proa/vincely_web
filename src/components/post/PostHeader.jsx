import React from 'react';

export default function PostHeader({ title, settingsIcon, onSettings }) {
  return (
    <div className="post-header">
      <h2>{title}</h2>
      <button type="button" onClick={onSettings}>
        Post Settings
        <img src={settingsIcon} alt="Icone de configuração de Post" />
      </button>
    </div>
  );
}

import React from 'react';

export default function PostActions({ buttons = [], onSubmit, submitLabel = 'Post' }) {
  return (
    <div className="post-actions">
      <div className="post-icons">
        {buttons.map((btn, index) => (
          <button key={index} type="button" onClick={btn.onClick} aria-label={btn.label}>
            <img src={btn.icon} alt={btn.label} />
          </button>
        ))}
      </div>

      <button type="submit" className="post-submit" onClick={onSubmit}>{submitLabel}</button>
    </div>
  );
}

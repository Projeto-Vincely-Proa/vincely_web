import React, { useEffect } from 'react';
import './lightbox.css';

export default function Lightbox({ open, items = [], index = 0, onClose, annotationsMap = {}, onImageClick, startDrag, editAnnotation }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open || !items || items.length === 0) return null;
  const item = items[index] || items[0];

  return (
    <div className="lightbox-overlay" onClick={(e) => { if (e.target.classList && e.target.classList.contains('lightbox-overlay')) onClose && onClose(); }}>
      <div className="lightbox-content" role="dialog" aria-modal="true" onClick={(e) => onImageClick && onImageClick(e, item)}>
        <button className="lightbox-close" onClick={(e)=>{e.stopPropagation(); onClose && onClose();}} aria-label="Fechar">×</button>
        <div className="lightbox-media-wrap">
          {item.mediaType === 'image' ? (
            <div className="lightbox-media-container">
              <img className="lightbox-media" src={item.mediaUrl} alt={item.mediaName || 'mídia'} />
              {/* render annotations for this item */}
              {((annotationsMap && annotationsMap[item.mediaUrl]) || []).map(ann => (
                <div
                  key={ann.id}
                  className="lightbox-annotation"
                  style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
                  onMouseDown={(e) => startDrag && startDrag(e, ann, item)}
                  onDoubleClick={(e) => { e.stopPropagation(); editAnnotation && editAnnotation(item.mediaUrl, ann); }}
                >
                  <span>{ann.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <video className="lightbox-media" src={item.mediaUrl} controls />
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';

export default function useAnnotations() {
  const [textMode, setTextMode] = useState(false);
  const [annotationsMap, setAnnotationsMap] = useState({});
  const dragRef = useRef(null);

  const toggleTextMode = () => setTextMode(v => !v);

  const onLightboxImageClick = (e, item) => {
    if (!textMode) return;
    const img = e.currentTarget.querySelector && e.currentTarget.querySelector('.lightbox-media') ? e.currentTarget.querySelector('.lightbox-media') : document.querySelector('.lightbox-media');
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (!item) return;
    const url = item.mediaUrl;
    const ann = { id: Date.now(), text: 'Texto', x, y, size: 28, color: '#ffffff' };
    setAnnotationsMap(prev => ({ ...(prev || {}), [url]: [...((prev[url]||[])), ann] }));
    setTextMode(false);
  };

  const startDrag = (e, ann, item) => {
    e.stopPropagation();
    dragRef.current = { annId: ann.id, startX: e.clientX, startY: e.clientY, itemUrl: item && item.mediaUrl };
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
  };

  const onDragMove = (e) => {
    if (!dragRef.current) return;
    const { annId, startX, startY, itemUrl } = dragRef.current;
    if (!itemUrl) return;
    const imgEl = document.querySelector('.lightbox-media');
    if (!imgEl) return;
    const rect = imgEl.getBoundingClientRect();
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const prevAnns = annotationsMap[itemUrl] || [];
    const idx = prevAnns.findIndex(a => a.id === annId);
    if (idx === -1) return;
    const ann = prevAnns[idx];
    const curXpx = (ann.x/100)*rect.width + dx;
    const curYpx = (ann.y/100)*rect.height + dy;
    const nx = Math.max(0, Math.min(100, (curXpx/rect.width)*100));
    const ny = Math.max(0, Math.min(100, (curYpx/rect.height)*100));
    const copy = [...prevAnns]; copy[idx] = { ...ann, x: nx, y: ny };
    setAnnotationsMap(prev => ({ ...prev, [itemUrl]: copy }));
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
  };

  const onDragEnd = () => {
    dragRef.current = null;
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', onDragEnd);
  };

  const editAnnotation = (itemUrl, ann) => {
    const next = prompt('Editar texto', ann.text);
    if (next === null) return;
    setAnnotationsMap(prev => ({ ...prev, [itemUrl]: (prev[itemUrl]||[]).map(a => a.id === ann.id ? { ...a, text: next } : a) }));
  };

  const exportAnnotatedImage = async (item) => {
    if (!item || item.mediaType !== 'image') return;
    const url = item.mediaUrl;
    const img = document.querySelector('.lightbox-media');
    if (!img) return;
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width = naturalW;
    canvas.height = naturalH;
    const ctx = canvas.getContext('2d');
    const image = await new Promise((res, rej) => { const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => res(im); im.onerror = rej; im.src = url; });
    ctx.drawImage(image, 0, 0, naturalW, naturalH);
    const anns = annotationsMap[url] || [];
    anns.forEach(a => {
      ctx.font = `${Math.max(12, a.size)}px sans-serif`;
      ctx.fillStyle = a.color || '#fff';
      ctx.textBaseline = 'top';
      const x = (a.x/100) * naturalW;
      const y = (a.y/100) * naturalH;
      ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = Math.max(2, Math.floor(a.size/12)); ctx.strokeText(a.text, x, y);
      ctx.fillText(a.text, x, y);
    });
    const data = canvas.toDataURL('image/png');
    const a = document.createElement('a'); a.href = data; a.download = 'image-annotated.png'; a.click();
  };

  // cleanup listeners on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('mouseup', onDragEnd);
    };
  }, []);

  return {
    textMode,
    toggleTextMode,
    annotationsMap,
    onLightboxImageClick,
    startDrag,
    editAnnotation,
    exportAnnotatedImage,
  };
}

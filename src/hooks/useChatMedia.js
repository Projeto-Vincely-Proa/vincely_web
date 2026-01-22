import { useState, useRef } from 'react';

// Hook para gerenciar seleção/preview/envio de mídia no chat
export default function useChatMedia(onSendPending) {
  const fileInputRef = useRef(null);
  const [pendingMedia, setPendingMedia] = useState(null); // { file, url, type, name, size, time }

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const type = f.type && f.type.indexOf('video') === 0 ? 'video' : (f.type && f.type.indexOf('image') === 0 ? 'image' : 'file');
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    setPendingMedia({ file: f, url, type, name: f.name, size: f.size, time });
    e.target.value = '';
  };

  const discardPendingMedia = () => {
    if (pendingMedia && pendingMedia.url) URL.revokeObjectURL(pendingMedia.url);
    setPendingMedia(null);
  };

  const sendPendingMedia = () => {
    if (!pendingMedia) return;
    if (onSendPending) onSendPending(pendingMedia);
    setPendingMedia(null);
  };

  return {
    fileInputRef,
    pendingMedia,
    openFilePicker,
    handleFileChange,
    discardPendingMedia,
    sendPendingMedia
  };
}

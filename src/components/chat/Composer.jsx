import React from 'react';
import IconMidia from '../../icons/iconMidia.svg';
import AudioRecorder from './AudioRecorder';
import MediaPreview from './MediaPreview';

export default function Composer({
  fileInputRef,
  openFilePicker,
  pendingMedia,
  composerText,
  setComposerText,
  handleFileChange,
  discardPendingMedia,
  sendPendingMedia,
  onAudioSend,
  sendMessage
}) {
  return (
  <div>
      {/* preview acima do composer quando existir mídia pendente */}
      <div className="composer">
        <input ref={fileInputRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFileChange} />
        <button className="btn-icon media" onClick={openFilePicker} aria-label="Enviar mídia">
          <img src={IconMidia} alt="midia" />
        </button>

        <div className="composer-input-wrapper">
          {/* Pré-visualização compacta dentro do composer quando existir mídia pendente (dentro do input) */}
          {pendingMedia && (
            <MediaPreview inline={true} pendingMedia={pendingMedia} onDiscard={discardPendingMedia} onSend={sendPendingMedia} />
          )}

          {/* Sempre mostrar campo de texto */}
          <input
          className="composer-input"
          placeholder="Escreva uma mensagem..."
          value={composerText}
          onChange={e => setComposerText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          />
        </div>

        {/* Microfone ou botão enviar: quando houver texto ou mídia pendente, mostrar enviar no lugar do microfone */}
        { (composerText && composerText.trim() !== "") || pendingMedia ? (
          <button
            className="btn-send"
            onClick={() => { if (pendingMedia) sendPendingMedia(); else sendMessage(); }}
            aria-label="Enviar mensagem"
          >
            Enviar
          </button>
        ) : (
          <AudioRecorder onSend={onAudioSend} />
        )}
      </div>
      
    </div>
  );
}

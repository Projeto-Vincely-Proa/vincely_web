import React, { useContext, useEffect, useState, useCallback, lazy, Suspense } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "./chat.css";
import { PageTitleContext } from "../../contexts/PageTitleContext";
import { NotificationContext } from "../../contexts/NotificationContext";
import CardMsg from "../../components/cardMsg/cardmsg";
import MessageBubble from "../../components/chat/MessageBubble";
import Composer from "../../components/chat/Composer";
import ChatHeader from "../../components/chat/ChatHeader";
import ConfirmModal from "../../components/confirmModal/ConfirmModal";
import Toast from "../../components/toast/toast";
import { users } from "../../data/userdadosmsg";
import IconFix from "../../icons/Fixicon.svg";
import useChatMedia from '../../hooks/useChatMedia';
import useAnnotations from '../../hooks/useAnnotations';
import { formatTime, computeClickRatio } from '../../utils/chatUtils';
import MessagesList from '../../components/chat/MessagesList';

const Lightbox = lazy(() => import("../../components/Lightbox/Lightbox"));

const MAX_FIXADOS = 5;

function Mensagens() {
  const { setPageTitle } = useContext(PageTitleContext);

  const [chatUsers, setChatUsers] = useState(users);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [confirmUser, setConfirmUser] = useState(null);
  const [toast, setToast] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messagesMap, setMessagesMap] = useState({});
  const [composerText, setComposerText] = useState("");
  const [playingId, setPlayingId] = useState(null);
  const [audioProgress, setAudioProgress] = useState({});
  // media handlers moved to hook
  const handleSendPendingMedia = useCallback((pending) => {
    if (!pending || !selectedUser) return;
    setMessagesMap(prev => {
      const userMsgs = prev[selectedUser.id] || [];
      const next = { id: Date.now(), sender: 'me', mediaUrl: pending.url, mediaType: pending.type, mediaName: pending.name, time: pending.time };
      return { ...prev, [selectedUser.id]: [...userMsgs, next] };
    });
  }, [selectedUser]);

  const { fileInputRef, pendingMedia, openFilePicker, handleFileChange, discardPendingMedia, sendPendingMedia } = useChatMedia(handleSendPendingMedia);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxItems, setLightboxItems] = useState([]);
  const touchStartXRef = React.useRef(null);
  
  // formatTime moved to utils/chatUtils
  const { setUnreadCount } = useContext(NotificationContext);
  const { notifications, setNotifications, pendingOpenUserId, setPendingOpenUserId, pushNotification } = useContext(NotificationContext);
  const { messagesBuffer, setMessagesBuffer } = useContext(NotificationContext);
  const { clearAll, setClearAll } = useContext(NotificationContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle("Mensagens");
    return () => setPageTitle("Vincely");
  }, [setPageTitle]);

  // manter contagem total de unread no contexto
  useEffect(() => {
    const total = [...chatUsers, ...archivedUsers].reduce((acc, u) => acc + (u.unread || 0), 0);
    setUnreadCount && setUnreadCount(total);
  }, [chatUsers, archivedUsers, setUnreadCount]);

  const fixedUsers = chatUsers.filter(u => u.fixed);

  const handleFixToggle = useCallback((user) => {
    if (!user.fixed && fixedUsers.length >= MAX_FIXADOS) {
      setToast("Limite de 5 conversas fixadas atingido");
      return;
    }
    setChatUsers(prev => prev.map(u => u.id === user.id ? { ...u, fixed: !u.fixed } : u));
  }, [chatUsers, fixedUsers]);

  const handleArchive = useCallback((user) => {
    setChatUsers(prev => prev.filter(u => u.id !== user.id));
    setArchivedUsers(prev => [user, ...prev]);
  }, []);

  const handleRestore = useCallback((user) => {
    setArchivedUsers(prev => prev.filter(u => u.id !== user.id));
    setChatUsers(prev => [user, ...prev]);
  }, []);

  const handleDeleteConfirm = useCallback((user) => {
    setConfirmUser(user);
  }, []);

  const handleDelete = useCallback(() => {
    setChatUsers(prev => prev.filter(u => u.id !== confirmUser.id));
    setArchivedUsers(prev => prev.filter(u => u.id !== confirmUser.id));
    setConfirmUser(null);
  }, [confirmUser]);

  const openConversation = useCallback((user) => {
    // Toggle: se já estiver selecionado, fecha a conversa
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null);
      return;
    }
    // abrir conversa (permitir para todos os usuários)
    setSelectedUser(user);
    // ao abrir, zerar unread desse usuário e limpar notificação relacionada
    setChatUsers(prev => prev.map(u => u.id === user.id ? { ...u, unread: 0 } : u));
    setArchivedUsers(prev => prev.map(u => u.id === user.id ? { ...u, unread: 0 } : u));
    
    // remover notificações desse usuário do contexto
    setNotifications && setNotifications(prev => (prev || []).filter(n => n.userId !== user.id));
    setMessagesMap(prev => {
      if (prev[user.id]) return prev;
      return {
        ...prev,
        [user.id]: [
          { id: 1, sender: 'them', text: user.lastMessage, time: user.time }
        ]
      };
    });
  }, [chatUsers, archivedUsers, setNotifications, selectedUser]);

  const sendMessage = useCallback(() => {
    if (!selectedUser || !composerText.trim()) return;
    setMessagesMap(prev => {
      const userMsgs = prev[selectedUser.id] || [];
      const next = { id: Date.now(), sender: 'me', text: composerText.trim(), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      return { ...prev, [selectedUser.id]: [...userMsgs, next] };
    });
    setComposerText("");
  }, [selectedUser, composerText]);

  

  // cleanup ao desmontar: liberar pending media URL se houver
  useEffect(() => {
    return () => {
      if (pendingMedia && pendingMedia.url) {
        URL.revokeObjectURL(pendingMedia.url);
      }
    };
  }, []);

  const togglePlay = useCallback((m) => {
    const el = document.getElementById(`audio-${m.id}`);
    if (!el) return;
    if (playingId === m.id) {
      el.pause();
      setPlayingId(null);
      return;
    }
    // pausar qualquer outro
    if (playingId) {
      const prev = document.getElementById(`audio-${playingId}`);
      if (prev) prev.pause();
    }
    // attach timeupdate handler to update progress
    el.ontimeupdate = () => {
      const dur = el.duration || 0;
      const cur = el.currentTime || 0;
      setAudioProgress(prev => ({ ...prev, [m.id]: { current: cur, percent: dur ? (cur / dur) * 100 : 0 } }));
    };
    el.onended = () => {
      setPlayingId(null);
      setAudioProgress(prev => ({ ...prev, [m.id]: { ...(prev[m.id] || {}), current: 0, percent: 0 } }));
    };
    el.play();
    setPlayingId(m.id);
  }, [playingId]);

  const seekAudio = useCallback((m, e) => {
    const ratio = computeClickRatio(e);
    const el = document.getElementById(`audio-${m.id}`);
    if (!el || !el.duration) return;
    el.currentTime = el.duration * ratio;
    setAudioProgress(prev => ({ ...prev, [m.id]: { current: el.currentTime, percent: ratio * 100 } }));
  }, []);

  // preview controls for pending recorded audio
  

    // MEDIA: abrir picker, tratar seleção, preview e enviar
    

    // Lightbox handlers
    const openLightbox = (messageId) => {
      if (!selectedUser) return;
      const msgs = (messagesMap[selectedUser.id] || []).filter(m => m.mediaUrl);
      if (!msgs || msgs.length === 0) return;
      const idx = msgs.findIndex(m => m.id === messageId);
      const start = idx >= 0 ? idx : 0;
      setLightboxItems(msgs);
      setLightboxIndex(start);
      setLightboxOpen(true);
    };

    const closeLightbox = () => setLightboxOpen(false);

    const nextLightbox = () => setLightboxIndex(i => (i + 1) % (lightboxItems.length || 1));
    const prevLightbox = () => setLightboxIndex(i => (i - 1 + (lightboxItems.length || 1)) % (lightboxItems.length || 1));

    useEffect(() => {
      if (!lightboxOpen) return;
      const onKey = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
        if (e.key === 'ArrowLeft') prevLightbox();
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [lightboxOpen, lightboxItems.length]);

    // lock body scroll when lightbox is open
    useEffect(() => {
      const prev = document.body.style.overflow;
      if (lightboxOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = prev;
      }
      return () => { document.body.style.overflow = prev; };
    }, [lightboxOpen]);

    // touch handlers for swipe navigation
    const onLightboxTouchStart = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      touchStartXRef.current = e.touches[0].clientX;
    };

    const onLightboxTouchEnd = (e) => {
      if (!touchStartXRef.current) return;
      const endX = (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientX) || null;
      if (endX === null) return;
      const delta = endX - touchStartXRef.current;
      const threshold = 50; // px
      if (delta < -threshold) nextLightbox();
      if (delta > threshold) prevLightbox();
      touchStartXRef.current = null;
    };

    // --- Annotations handled by hook ---
    const { textMode, toggleTextMode, annotationsMap, onLightboxImageClick, startDrag, editAnnotation, exportAnnotatedImage } = useAnnotations();

  const handleAudioSend = (pending) => {
    if (!pending || !selectedUser) return;
    setMessagesMap(prev => {
      const userMsgs = prev[selectedUser.id] || [];
      const next = { id: Date.now(), sender: 'me', audioUrl: pending.url, duration: pending.duration, time: pending.time };
      return { ...prev, [selectedUser.id]: [...userMsgs, next] };
    });
    const payload = { userId: selectedUser.id, userName: selectedUser.name, avatar: selectedUser.avatar || null, text: undefined, time: pending.time };
    pushNotification ? pushNotification(payload) : (setNotifications && setNotifications(prev => [{ id: Date.now(), userId: selectedUser.id, userName: payload.userName, avatar: payload.avatar, text: undefined, time: pending.time }, ...(prev || []).slice(0,49)]));
  };

  // Simula chegada de mensagem do usuário (poderá ser chamado por websocket/intervalo)
  const receiveMessageFrom = (userId, text) => {
    // adicionar mensagem
    setMessagesMap(prev => {
      const userMsgs = prev[userId] || [];
      const next = { id: Date.now(), sender: 'them', text, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      return { ...prev, [userId]: [...userMsgs, next] };
    });

    // incrementar unread se não estiver aberto
    const timeNow = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    setChatUsers(prev => prev.map(u => u.id === userId ? { ...u, unread: (u.unread || 0) + (selectedUser && selectedUser.id === userId ? 0 : 1), lastMessage: text, time: timeNow } : u));
    setArchivedUsers(prev => prev.map(u => u.id === userId ? { ...u, unread: (u.unread || 0) + (selectedUser && selectedUser.id === userId ? 0 : 1), lastMessage: text, time: timeNow } : u));

    // se estiver a conversa aberta com esse user, marcar como lida
    if (selectedUser && selectedUser.id === userId) {
      setChatUsers(prev => prev.map(u => u.id === userId ? { ...u, unread: 0 } : u));
      setArchivedUsers(prev => prev.map(u => u.id === userId ? { ...u, unread: 0 } : u));
    }

    // mostrar notificação lateral local (se estiver na página) e adicionar ao contexto via pushNotification
    const user = (chatUsers.find(u => u.id === userId) || archivedUsers.find(u => u.id === userId)) || users.find(u => u.id === userId);
    const payload = { userId, userName: (user && user.name) || 'Contato', avatar: (user && user.avatar) || null, text, time: timeNow };
    pushNotification ? pushNotification(payload) : (setNotifications && setNotifications(prev => [{ id: Date.now(), userId, userName: payload.userName, avatar: payload.avatar, text, time: timeNow }, ...(prev || []).slice(0,49)]));
  };

    // Simulador global movido para MainLayout; aqui não precisamos iniciar outro simulador.

    // quando chega notificação via receiveMessageFrom, também empurrar para o contexto
    useEffect(() => {
      // noop: dependências controladas via receiveMessageFrom
    }, [notifications, setNotifications]);
      // processa mensagens que vieram via messagesBuffer (simulador do contexto)
      useEffect(() => {
        if (!messagesBuffer || Object.keys(messagesBuffer).length === 0) return;

        // para cada userId no buffer, aplicar mensagens localmente
        Object.keys(messagesBuffer).forEach(uid => {
          const msgs = messagesBuffer[uid] || [];
          msgs.forEach(m => {
            const timeNow = m.time || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            // adicionar à lista de mensagens locais
            setMessagesMap(prev => {
              const userMsgs = prev[uid] || [];
              const next = { id: m.id || Date.now(), sender: 'them', text: m.text, time: timeNow };
              return { ...prev, [uid]: [...userMsgs, next] };
            });

            // atualizar unread / lastMessage nas listas locais
            setChatUsers(prev => prev.map(u => u.id === Number(uid) ? { ...u, unread: (u.unread || 0) + ((selectedUser && selectedUser.id === Number(uid)) ? 0 : 1), lastMessage: m.text, time: timeNow } : u));
            setArchivedUsers(prev => prev.map(u => u.id === Number(uid) ? { ...u, unread: (u.unread || 0) + ((selectedUser && selectedUser.id === Number(uid)) ? 0 : 1), lastMessage: m.text, time: timeNow } : u));

            // notificação lateral local (o provedor global também exibirá a notificação)
            const user = (chatUsers.find(u => u.id === Number(uid)) || archivedUsers.find(u => u.id === Number(uid))) || users.find(u => u.id === Number(uid));
          });

          // limpar esse user do buffer
          setMessagesBuffer(prev => {
            const copy = { ...(prev || {}) };
            delete copy[uid];
            return copy;
          });
        });
      }, [messagesBuffer]);

    // abrir conversa quando pendingOpenUserId for setado (clicou na dropdown)
    useEffect(() => {
      if (!pendingOpenUserId) return;
      const u = [...chatUsers, ...archivedUsers].find(x => x.id === pendingOpenUserId) || users.find(x => x.id === pendingOpenUserId);
      if (u) {
        openConversation(u);
      }
      setPendingOpenUserId && setPendingOpenUserId(null);
    }, [pendingOpenUserId]);

    // se a navegação trouxe um openUserId no state (via navigate(..., { state }))
    useEffect(() => {
      try {
        const openId = location && location.state && location.state.openUserId;
        if (!openId) return;
        const u = [...chatUsers, ...archivedUsers].find(x => x.id === openId) || users.find(x => x.id === openId);
        if (u) openConversation(u);
        // limpar o state de navegação para evitar reprocessamento
        navigate(location.pathname, { replace: true, state: {} });
      } catch (err) {
        // noop
      }
    }, []);

    // resposta ao 'marcar tudo como lido' do navbar
    useEffect(() => {
      if (!clearAll) return;
      setChatUsers(prev => prev.map(u => u.unread && u.unread > 0 ? { ...u, prevUnread: u.unread, unread: 0 } : u));
      setArchivedUsers(prev => prev.map(u => u.unread && u.unread > 0 ? { ...u, prevUnread: u.unread, unread: 0 } : u));
      setClearAll && setClearAll(false);
    }, [clearAll]);
  const handleSendMedia = () => {
    console.log('Enviar midia (placeholder)');
  };

  // alterna estado lido/não lido para um usuário
  const toggleRead = useCallback((userOrId) => {
    const id = userOrId && userOrId.id ? userOrId.id : userOrId;
    setChatUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      if (u.unread && u.unread > 0) {
        return { ...u, prevUnread: u.unread, unread: 0 };
      }
      const restored = (u.prevUnread && u.prevUnread > 0) ? u.prevUnread : 1;
      return { ...u, unread: restored, prevUnread: undefined };
    }));
    setArchivedUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      if (u.unread && u.unread > 0) {
        return { ...u, prevUnread: u.unread, unread: 0 };
      }
      const restored = (u.prevUnread && u.prevUnread > 0) ? u.prevUnread : 1;
      return { ...u, unread: restored, prevUnread: undefined };
    }));
  }, [selectedUser]);

  const fixados = chatUsers.filter(u => u.fixed);
  const restantes = chatUsers.filter(u => !u.fixed);

  return (
    <main className="mensagens-page">

      <div className="conteiner-msg">
        <div className="box-chats">

          {fixados.length > 0 && (
            <section className="fixadas">
              <div className="fixadas-header">
                <img src={IconFix} alt="fixado" />
                <h4 className="section-title">Conversas Fixadas</h4>
              </div>

              <div className="chat-fixado">
                {fixados.map(user => (
                  <CardMsg
                    key={user.id}
                    user={user}
                    onFix={handleFixToggle}
                    onArchive={handleArchive}
                    onDelete={handleDeleteConfirm}
                    onOpen={openConversation}
                    onToggleRead={toggleRead}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="consmensagens">
            <h4 className="section-title">Mensagens</h4>

            {restantes.map(user => (
              <CardMsg
                key={user.id}
                user={user}
                onFix={handleFixToggle}
                onArchive={handleArchive}
                onDelete={handleDeleteConfirm}
                onOpen={openConversation}
                onToggleRead={toggleRead}
              />
            ))}
          </section>

          {archivedUsers.length > 0 && (
            <section className="archived-container">
              <h4 className="section-title">Arquivados</h4>

              {archivedUsers.map(user => (
                <CardMsg
                  key={user.id}
                  user={user}
                  isArchived
                  onRestore={handleRestore}
                  onDelete={handleDeleteConfirm}
                  onOpen={openConversation}
                  onToggleRead={toggleRead}
                />
              ))}
            </section>
          )}
        </div>

        {/* Área de conversa à direita que ocupa o espaço restante */}
        <div className="chat-window">
          {!selectedUser ? (
            <div className="chat-empty">Selecione uma conversa para começar</div>
          ) : (
            <>
              <ChatHeader selectedUser={selectedUser} onBack={() => setSelectedUser(null)}>
                <Suspense fallback={null}>
                  <Lightbox
                    open={lightboxOpen}
                    items={lightboxItems}
                    index={lightboxIndex}
                    onClose={closeLightbox}
                    annotationsMap={annotationsMap}
                    onImageClick={onLightboxImageClick}
                    startDrag={startDrag}
                    editAnnotation={editAnnotation}
                  />
                </Suspense>
              </ChatHeader>

              <MessagesList
                messages={(messagesMap[selectedUser.id] || [])}
                playingId={playingId}
                audioProgress={audioProgress}
                togglePlay={togglePlay}
                seekAudio={seekAudio}
                openLightbox={openLightbox}
                formatTime={formatTime}
              />

              <Composer
                fileInputRef={fileInputRef}
                openFilePicker={openFilePicker}
                pendingMedia={pendingMedia}
                composerText={composerText}
                setComposerText={setComposerText}
                handleFileChange={handleFileChange}
                discardPendingMedia={discardPendingMedia}
                sendPendingMedia={sendPendingMedia}
                onAudioSend={handleAudioSend}
                sendMessage={sendMessage}
              />
            </>
          )}
        </div>
      </div>
      {/* notificação lateral flutuante */}
      
      {confirmUser && (
        <ConfirmModal
          title="Apagar conversa?"
          description="Todas as mensagens com essa pessoa serão apagadas permanentemente. Essa ação não poderá ser desfeita."
          onCancel={() => setConfirmUser(null)}
          onConfirm={handleDelete}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </main>
  );
} 

export default Mensagens;

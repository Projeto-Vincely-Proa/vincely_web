import React, { useContext, useEffect, useState, useCallback, lazy, Suspense } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "./chat.css";
import { PageTitleContext } from "../../contexts/PageTitleContext";
import { NotificationContext } from "../../contexts/NotificationContext";
import CardMsg from "../../components/cardMsg/cardmsg";
// ...existing code...
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


  // manipulação de mídia
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

  
  // utilitário de formatação de tempo
  const { setUnreadCount } = useContext(NotificationContext);
  const { setNotifications, pendingOpenUserId, setPendingOpenUserId, pushNotification } = useContext(NotificationContext);
  const { messagesBuffer, setMessagesBuffer } = useContext(NotificationContext);
  const { clearAll, setClearAll } = useContext(NotificationContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle("Mensagens");
    return () => setPageTitle("Vincely");
  }, [setPageTitle]);

  // contagem de não lidas
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
  }, [fixedUsers]);

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
    // toggle seleção de conversa
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null);
      return;
    }
    // abrir conversa
    setSelectedUser(user);
    
    // zerar não lidas ao abrir
    setChatUsers(prev => prev.map(u => u.id === user.id ? { ...u, unread: 0 } : u));
    setArchivedUsers(prev => prev.map(u => u.id === user.id ? { ...u, unread: 0 } : u));
    
    // remover notificações do usuário
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

  

  // cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (pendingMedia && pendingMedia.url) {
        URL.revokeObjectURL(pendingMedia.url);
      }
    };
  }, [pendingMedia]);

  const togglePlay = useCallback((m) => {
    const el = document.getElementById(`audio-${m.id}`);
    if (!el) return;
    if (playingId === m.id) {
      el.pause();
      setPlayingId(null);
      return;
    }
    
    // pausar outro áudio
    if (playingId) {
      const prev = document.getElementById(`audio-${playingId}`);
      if (prev) prev.pause();
    }

    // atualizar progresso do áudio
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
    }, [lightboxOpen, lightboxItems.length, nextLightbox, prevLightbox]);

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

 
    // --- Anotações tratadas pelo hook ---
    // --- Anotações tratadas pelo hook ---
    const { annotationsMap, onLightboxImageClick, startDrag, editAnnotation } = useAnnotations();
    

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

   
      // processa mensagens que vieram via messagesBuffer (simulador do contexto)
      useEffect(() => {
        if (!messagesBuffer || Object.keys(messagesBuffer).length === 0) return;
        Object.keys(messagesBuffer).forEach(uid => {
          const msgs = messagesBuffer[uid] || [];
          msgs.forEach(m => {
            const timeNow = m.time || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            setMessagesMap(prev => {
              const userMsgs = prev[uid] || [];
              const next = { id: m.id || Date.now(), sender: 'them', text: m.text, time: timeNow };
              return { ...prev, [uid]: [...userMsgs, next] };
            });
            setChatUsers(prev => prev.map(u => u.id === Number(uid) ? { ...u, unread: (u.unread || 0) + ((selectedUser && selectedUser.id === Number(uid)) ? 0 : 1), lastMessage: m.text, time: timeNow } : u));
            setArchivedUsers(prev => prev.map(u => u.id === Number(uid) ? { ...u, unread: (u.unread || 0) + ((selectedUser && selectedUser.id === Number(uid)) ? 0 : 1), lastMessage: m.text, time: timeNow } : u));
           
          });
          setMessagesBuffer(prev => {
            const copy = { ...(prev || {}) };
            delete copy[uid];
            return copy;
          });
        });
      }, [messagesBuffer, selectedUser, chatUsers, archivedUsers, setMessagesBuffer]);

    // abrir conversa via dropdown
    useEffect(() => {
      if (!pendingOpenUserId) return;
      const u = [...chatUsers, ...archivedUsers].find(x => x.id === pendingOpenUserId) || users.find(x => x.id === pendingOpenUserId);
      if (u) {
        openConversation(u);
      }
      setPendingOpenUserId && setPendingOpenUserId(null);
    }, [pendingOpenUserId, chatUsers, archivedUsers, openConversation, setPendingOpenUserId]);

    // abrir conversa via navegação
    useEffect(() => {
      try {
        const openId = location && location.state && location.state.openUserId;
        if (!openId) return;
        const u = [...chatUsers, ...archivedUsers].find(x => x.id === openId) || users.find(x => x.id === openId);
        if (u) openConversation(u);
        navigate(location.pathname, { replace: true, state: {} });
      } catch (err) {
       
      }
    }, [location, chatUsers, archivedUsers, openConversation, navigate]);

    // marcar tudo como lido
    useEffect(() => {
      if (!clearAll) return;
      setChatUsers(prev => prev.map(u => u.unread && u.unread > 0 ? { ...u, prevUnread: u.unread, unread: 0 } : u));
      setArchivedUsers(prev => prev.map(u => u.unread && u.unread > 0 ? { ...u, prevUnread: u.unread, unread: 0 } : u));
      setClearAll && setClearAll(false);
    }, [clearAll, setClearAll]);
  

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
  }, []);

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
      {/* Notificação lateral flutuante */}
      
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

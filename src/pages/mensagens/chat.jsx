import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  lazy,
  Suspense
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./chat.css";

import { PageTitleContext } from "../../contexts/PageTitleContext";
import { NotificationContext } from "../../contexts/NotificationContext";

import CardMsg from "../../components/cardMsg/cardmsg";
import Composer from "../../components/chat/Composer";
import ChatHeader from "../../components/chat/ChatHeader";
import ConfirmModal from "../../components/confirmModal/ConfirmModal";
import Toast from "../../components/toast/toast";
import MessagesList from "../../components/chat/MessagesList";

import { users } from "../../data/userdadosmsg";
import IconFix from "../../icons/Fixicon.svg";

import useChatMedia from "../../hooks/useChatMedia";
import useAnnotations from "../../hooks/useAnnotations";
import { formatTime, computeClickRatio } from "../../utils/chatUtils";

const Lightbox = lazy(() => import("../../components/Lightbox/Lightbox"));

const MAX_FIXADOS = 5;

function Mensagens() {
  const { setPageTitle } = useContext(PageTitleContext);


  const [chatUsers, setChatUsers] = useState(users);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messagesMap, setMessagesMap] = useState({});
  const [composerText, setComposerText] = useState("");
  const [confirmUser, setConfirmUser] = useState(null);
  const [toast, setToast] = useState("");

  const [playingId, setPlayingId] = useState(null);
  const [audioProgress, setAudioProgress] = useState({});

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxItems, setLightboxItems] = useState([]);

  const fixedUsers = chatUsers.filter(u => u.fixed);

  /*  Media  */
  const handleSendPendingMedia = useCallback((pending) => {
    if (!pending || !selectedUser) return;

    setMessagesMap(prev => {
      const msgs = prev[selectedUser.id] || [];
      return {
        ...prev,
        [selectedUser.id]: [
          ...msgs,
          {
            id: Date.now(),
            sender: "me",
            mediaUrl: pending.url,
            mediaType: pending.type,
            mediaName: pending.name,
            time: pending.time
          }
        ]
      };
    });
  }, [selectedUser]);

  const {
    fileInputRef,
    pendingMedia,
    openFilePicker,
    handleFileChange,
    discardPendingMedia,
    sendPendingMedia
  } = useChatMedia(handleSendPendingMedia);

  const {
    annotationsMap,
    onLightboxImageClick,
    startDrag,
    editAnnotation
  } = useAnnotations();

  /*  Page title  */
  useEffect(() => {
    setPageTitle("Mensagens");
    return () => setPageTitle("Vincely");
  }, [setPageTitle]);

  /*  Unread count  */
  useEffect(() => {
    const total = [...chatUsers, ...archivedUsers].reduce(
      (acc, u) => acc + (u.unread || 0),
      0
    );
    setUnreadCount?.(total);
  }, [chatUsers, archivedUsers, setUnreadCount]);

  /*  Fixar  */
  const handleFixToggle = useCallback((user) => {
    if (!user.fixed && fixedUsers.length >= MAX_FIXADOS) {
      setToast("Limite de 5 conversas fixadas atingido");
      return;
    }
    setChatUsers(prev =>
      prev.map(u =>
        u.id === user.id ? { ...u, fixed: !u.fixed } : u
      )
    );
  }, [fixedUsers]);

  const handleArchive = useCallback((user) => {
    setChatUsers(prev => prev.filter(u => u.id !== user.id));
    setArchivedUsers(prev => [user, ...prev]);
  }, []);

  const handleRestore = useCallback((user) => {
    setArchivedUsers(prev => prev.filter(u => u.id !== user.id));
    setChatUsers(prev => [user, ...prev]);
  }, []);

  /*  Abrir conversa  */
  const openConversation = useCallback((user) => {
    if (selectedUser?.id === user.id) {
      setSelectedUser(null);
      return;
    }
    setSelectedUser(user);
    setChatUsers(prev => prev.map(u => u.id === user.id ? { ...u, unread: 0 } : u));
    setArchivedUsers(prev => prev.map(u => u.id === user.id ? { ...u, unread: 0 } : u));
    setNotifications?.(prev => (prev || []).filter(n => n.userId !== user.id));
    setMessagesMap(prev => {
      if (prev[user.id]) return prev;
      return {
        ...prev,
        [user.id]: [
          { id: 1, sender: "them", text: user.lastMessage, time: user.time }
        ]
      };
    });
  }, [setNotifications, selectedUser?.id]);

  /*  Enviar texto  */
  const sendMessage = useCallback(() => {
    if (!selectedUser || !composerText.trim()) return;

    setMessagesMap(prev => {
      const msgs = prev[selectedUser.id] || [];
      return {
        ...prev,
        [selectedUser.id]: [
          ...msgs,
          {
            id: Date.now(),
            sender: "me",
            text: composerText.trim(),
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })
          }
        ]
      };
    });

    setComposerText("");
  }, [selectedUser, composerText]);

  /*  Áudio  */
  const togglePlay = useCallback((m) => {
    const el = document.getElementById(`audio-${m.id}`);
    if (!el) return;

    if (playingId === m.id) {
      el.pause();
      setPlayingId(null);
      return;
    }

    if (playingId) {
      const prev = document.getElementById(`audio-${playingId}`);
      prev?.pause();
    }

    el.ontimeupdate = () => {
      const dur = el.duration || 0;
      const cur = el.currentTime || 0;
      setAudioProgress(prev => ({
        ...prev,
        [m.id]: { current: cur, percent: dur ? (cur / dur) * 100 : 0 }
      }));
    };

    el.onended = () => {
      setPlayingId(null);
      setAudioProgress(prev => ({
        ...prev,
        [m.id]: { current: 0, percent: 0 }
      }));
    };

    el.play();
    setPlayingId(m.id);
  }, [playingId]);

  const seekAudio = useCallback((m, e) => {
    const ratio = computeClickRatio(e);
    const el = document.getElementById(`audio-${m.id}`);
    if (!el?.duration) return;
    el.currentTime = el.duration * ratio;
  }, []);

  /*  Lightbox  */
  const openLightbox = useCallback((messageId) => {
    if (!selectedUser) return;
    const msgs = (messagesMap[selectedUser.id] || []).filter(m => m.mediaUrl);
    if (!msgs.length) return;
    const idx = msgs.findIndex(m => m.id === messageId);
    setLightboxItems(msgs);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  }, [messagesMap, selectedUser]);

  // Funções estáveis para navegação do lightbox
  const nextLightbox = useCallback(() => {
    setLightboxIndex(i => (i + 1) % (lightboxItems.length || 1));
  }, [lightboxItems.length]);

  const prevLightbox = useCallback(() => {
    setLightboxIndex(i => (i - 1 + (lightboxItems.length || 1)) % (lightboxItems.length || 1));
  }, [lightboxItems.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, nextLightbox, prevLightbox]);

  /*  Render  */
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
                    onDelete={setConfirmUser}
                    onOpen={openConversation}
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
                onDelete={setConfirmUser}
                onOpen={openConversation}
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
                  onDelete={setConfirmUser}
                  onOpen={openConversation}
                />
              ))}
            </section>
          )}
        </div>

        <div className="chat-window">
          {!selectedUser ? (
            <div className="chat-empty">
              Selecione uma conversa para começar
            </div>
          ) : (
            <>
              <ChatHeader
                selectedUser={selectedUser}
                onBack={() => setSelectedUser(null)}
              >
                <Suspense fallback={null}>
                  <Lightbox
                    open={lightboxOpen}
                    items={lightboxItems}
                    index={lightboxIndex}
                    onClose={() => setLightboxOpen(false)}
                    annotationsMap={annotationsMap}
                    onImageClick={onLightboxImageClick}
                    startDrag={startDrag}
                    editAnnotation={editAnnotation}
                  />
                </Suspense>
              </ChatHeader>

              <MessagesList
                messages={messagesMap[selectedUser.id] || []}
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
                sendMessage={sendMessage}
              />
            </>
          )}
        </div>
      </div>

      {confirmUser && (
        <ConfirmModal
          title="Apagar conversa?"
          description="Todas as mensagens com essa pessoa serão apagadas permanentemente."
          onCancel={() => setConfirmUser(null)}
          onConfirm={() => setConfirmUser(null)}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </main>
  );
}

export default Mensagens;

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "./cardmsg.css";

function CardMsg({
  user,
  onFix,
  onArchive,
  onDelete,
  onRestore,
  onOpen,
  onToggleRead,
  isArchived = false
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const [menuRect, setMenuRect] = useState(null);
  const wrapperRef = useRef(null);
  const [menuTop, setMenuTop] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!openMenu) return;
    function handleDocClick(e) {
      const menuEl = menuRef.current;
      const wrapEl = wrapperRef.current;
      if (menuEl && menuEl.contains(e.target)) return;
      if (wrapEl && wrapEl.contains(e.target)) return;
      setOpenMenu(false);
    }
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [openMenu]);

  // calculate menu top position and flip upward if not enough space below
  useEffect(() => {
    if (!openMenu || !menuRect) return;
    let mounted = true;

    function updatePos() {
      const menuEl = menuRef.current;
      if (!menuEl || !menuRect) return;
      const h = menuEl.offsetHeight;
      const spaceBelow = window.innerHeight - menuRect.bottom;
      let y = menuRect.bottom + window.scrollY;
      if (spaceBelow < h + 8) {
        // place above
        y = menuRect.top + window.scrollY - h;
      }
      if (y < 8) y = 8;
      if (mounted) setMenuTop(y);
    }

    // run on next frame so menuRef has size
    requestAnimationFrame(updatePos);

    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos, true);
    return () => {
      mounted = false;
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('scroll', updatePos, true);
    };
  }, [openMenu, menuRect]);

  return (
    <div className={`card-msg-wrapper ${openMenu ? "open" : ""}`}>
      <div ref={wrapperRef} className="card-msg" onClick={() => !openMenu && (onOpen ? onOpen(user) : console.log("Abrir chat", user.id))}>

        <img
          src={user.avatar}
          alt={user.name}
          className="card-msg-avatar"
        />

        <div className="card-msg-content">
          <div className="card-msg-header">
            <span className="card-msg-name">{user.name}</span>
            {user.unread && user.unread > 0 ? (
              <span className="unread-badge">{user.unread}</span>
            ) : (
              <span className="card-msg-time">{user.time}</span>
            )}
          </div>

          <p className="card-msg-last">
            {user.lastMessage}
          </p>
        </div>

        {/* MENU 3 PONTINHOS */}
        <div className="card-msg-menu">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // toggle menu and calculate position
              setOpenMenu(prev => {
                const next = !prev;
                if (next && wrapperRef.current) {
                  const r = wrapperRef.current.getBoundingClientRect();
                  setMenuRect(r);
                }
                return next;
              });
            }}
          >
            ⋮
          </button>

          {openMenu && wrapperRef.current && typeof document !== 'undefined' && createPortal(
            <div
              ref={menuRef}
              className="menu-options"
              style={{ position: 'fixed', top: menuTop != null ? menuTop : (menuRect ? menuRect.bottom + window.scrollY : 0), right: menuRect ? (window.innerWidth - menuRect.right) : 0 }}
            >
              {!isArchived && (
                <>
                  <button onClick={() => onFix && onFix(user)}>
                    {user.fixed ? "Desafixar" : "Fixar"}
                  </button>
                  <button onClick={() => onArchive && onArchive(user)}>
                    Arquivar
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onToggleRead && onToggleRead(user); setOpenMenu(false); }}>
                    {user.unread && user.unread > 0 ? "Marcar como lido" : "Marcar como não lido"}
                  </button>
                </>
              )}

              {isArchived && (
                <button onClick={() => onRestore && onRestore(user)}>
                  Restaurar
                </button>
              )}

              <button
                className="danger"
                onClick={() => onDelete && onDelete(user)}
              >
                Apagar
              </button>
            </div>,
            document.body
          )}
        </div>

      </div>
    </div>
  );
}

export default CardMsg;

import React, {useContext, useState, useEffect, useRef} from "react";
import "./navbar.css";
import Search from "../../icons/bx-search.svg";
import Add from "../../icons/Icon_Mais.svg";
import Bell from "../../icons/Vector.svg";
import { PageTitleContext } from "../../contexts/PageTitleContext";
import { NotificationContext } from "../../contexts/NotificationContext";
import { useNavigate } from 'react-router-dom';

function Navbar({ sidebarOpen, setSidebarOpen }) {
    const {pageTitle } = useContext(PageTitleContext);
    const { unreadCount, notifications, setPendingOpenUserId, setNotifications, setClearAll, setUnreadCount, setNotifDropdownOpen } = useContext(NotificationContext);
    const [open, setOpen] = useState(false);
    const [pulse, setPulse] = useState(false);
    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        if (!notifications) return;
        // animação breve quando chega nova notificação
        setPulse(true);
        const t = setTimeout(() => setPulse(false), 700);
        return () => clearTimeout(t);
    }, [notifications && notifications.length]);

    return (
        <nav className="navbar">
            <button
                className="btn-hamburger"
                aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
                onClick={() => setSidebarOpen && setSidebarOpen(s => !s)}
            >
                <span className="hamburger-line" />
                <span className="hamburger-line" />
                <span className="hamburger-line" />
            </button>
            <h1 className="navbar-title">{pageTitle || 'Vincely'}</h1>
            <div className="navbar-content-right">
                <div className="input-search">
                    <img src={Search} alt="Pesquisar" />
                    <input
                        type="text"
                        placeholder="Search"
                        aria-label="Pesquisar"
                    />
                </div>

                <button className="btn-add" disabled aria-disabled="true" title="Em breve">
                    <img src={Add} alt="Adicionar" />
                </button>

                                                <div className={`bell-wrap ${open ? 'open' : ''}`} ref={containerRef}>
                                                    <button className={`btn-bell ${pulse ? 'pulse' : ''}`} aria-label="Notificações" onClick={() => {
                                                            setOpen(o => {
                                                                const next = !o;
                                                                setNotifDropdownOpen && setNotifDropdownOpen(next);
                                                                return next;
                                                            });
                                                        }}>
                                            <img src={Bell} alt="Notificações" />
                                            {unreadCount > 0 && (
                                                <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                                            )}
                                    </button>

                                    {open && (
                                        <div className="notif-dropdown">
                                            <div className="notif-dropdown-header">
                                                <div>Notificações</div>
                                            </div>
                                            <div className="notif-list">
                                                {notifications.length === 0 && <div className="notif-empty">Sem notificações</div>}
                                                    {notifications.map(n => (
                                                    <button key={n.id} className="notif-item" onClick={() => {
                                                        // marcar para abrir conversa na página /mensagens
                                                        setPendingOpenUserId && setPendingOpenUserId(n.userId);
                                                        setOpen(false);
                                                        setNotifDropdownOpen && setNotifDropdownOpen(false);
                                                        // passar openUserId no state da rota para garantir abertura imediata ao montar
                                                        navigate('/mensagens', { state: { openUserId: n.userId } });
                                                    }}>
                                                        <img src={n.avatar || Bell} alt={n.userName} />
                                                        <div className="notif-item-body">
                                                            <strong>{n.userName}</strong>
                                                            <div className="notif-item-text">{n.text}</div>
                                                        </div>
                                                        <div className="notif-item-time">{n.time}</div>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="notif-dropdown-footer">
                                                <button className="btn-mark-all" onClick={() => {
                                                    setNotifications && setNotifications([]);
                                                    setPendingOpenUserId && setPendingOpenUserId(null);
                                                    // sinalizar para Mensagens zerar unread
                                                    setClearAll && setClearAll(true);
                                                    // zerar badge imediato
                                                    setUnreadCount && setUnreadCount(0);
                                                }}>Marcar tudo como lido</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
            </div>
        </nav>
    );
}

export default Navbar;

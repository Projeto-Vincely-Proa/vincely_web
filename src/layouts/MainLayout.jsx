import React, { useState, useEffect, useRef } from 'react';
import './mainlayout.css';


import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar/sidebar';
import Navbar from '../components/navbar/navbar';
import { PageTitleContext } from '../contexts/PageTitleContext';
import NotificationContext from '../contexts/NotificationContext';
import { users } from '../data/userdadosmsg';

// Simulador persistente: envia notificações e popula messagesBuffer no contexto
// roda enquanto MainLayout estiver montado (persistente entre rotas filhas)




export default function MainLayout(){
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [pageTitle, setPageTitle] = useState('Vincely');
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [messagesBuffer, setMessagesBuffer] = useState({});
  const [pendingOpenUserId, setPendingOpenUserId] = useState(null);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [clearAll, setClearAll] = useState(false);

  // simulador persistente: gera mensagens temáticas de vários usuários e persiste em localStorage
  useEffect(() => {
    // restaurar estado persistido
    try {
      const savedNotifs = localStorage.getItem('vincely.notifications');
      const savedBuffer = localStorage.getItem('vincely.messagesBuffer');
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
      if (savedBuffer) setMessagesBuffer(JSON.parse(savedBuffer));
    } catch (e) {
      // noop
    }

    const pool = (users || []).filter(u => u.id);
    if (!pool || pool.length === 0) return;

    const THEMES = [
      '{name} está precisando de alguém para ouvir sobre algo pessoal.',
      'Hoje foi um dia difícil para {name} — só precisava desabafar.',
      'Boas notícias de {name}: terminei um projeto e estou feliz!',
      '{name} começou um hobby novo que tem ajudado muito a relaxar.',
      '{name} quer saber se alguém já teve a mesma experiência.',
      '{name} está celebrando um pequeno progresso e quis dividir com vocês.',
      '{name} procura sugestões de hobbies para aliviar o estresse.'
    ];

    let idx = 0;
    let sent = 0;
    const interval = setInterval(() => {
      // respeitar pausa temporária (ex: após marcar tudo como lido)
      if (pausedUntilRef.current && Date.now() < pausedUntilRef.current) return;

      const target = pool[idx % pool.length];
      idx += 1;
      sent += 1;

      // escolher tema aleatório garantindo que o mesmo usuário não repita o último texto
      let choice = Math.floor(Math.random() * THEMES.length);
      const last = perUserLastIndexRef.current[target.id];
      let tries = 0;
      while (THEMES.length > 1 && last !== undefined && choice === last && tries < 6) {
        choice = Math.floor(Math.random() * THEMES.length);
        tries += 1;
      }
      perUserLastIndexRef.current[target.id] = choice;

      // substituir placeholder {name} pelo nome do usuário para maior coerência
      const raw = THEMES[choice];
      const text = raw.replace(/\{name\}/g, target.name);
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const payload = { id: Date.now() + Math.random(), userId: target.id, userName: target.name, avatar: target.avatar || null, text, time: timeNow };

      // usar helper para centralizar lógica
      pushNotification(payload);

      // reinicia contador opcional para manter envio contínuo (não interrompe)
      if (sent >= 1000000) sent = 0;
    }, 10000);

    // primeira mensagem imediata
    const first = pool[0];
    const firstTheme = THEMES[Math.floor(Math.random() * THEMES.length)].replace(/\{name\}/g, first.name);
    pushNotification({ id: Date.now() + 1, userId: first.id, userName: first.name, avatar: first.avatar || null, text: firstTheme, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });

    return () => clearInterval(interval);
  }, []);

  // persistir em localStorage quando notifications ou buffer mudarem
  useEffect(() => {
    try {
      localStorage.setItem('vincely.notifications', JSON.stringify(notifications || []));
    } catch (e) {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('vincely.messagesBuffer', JSON.stringify(messagesBuffer || {}));
    } catch (e) {}
  }, [messagesBuffer]);
  const navigate = useNavigate();
  const [floatingNotif, setFloatingNotif] = React.useState(null);

  // mostrar notificação flutuante breve quando notifications é atualizado
  useEffect(() => {
    if (!notifications || notifications.length === 0) return;
    const latest = notifications[0];
    setFloatingNotif(latest);
    const t = setTimeout(() => setFloatingNotif(null), 4500);
    return () => clearTimeout(t);
  }, [notifications]);

  // helper central para empurrar notificações e popular buffer
  const pushNotification = (payload) => {
    if (!payload || !payload.userId) return;
    // se não houver texto (ex: notificações internas de áudio do próprio usuário),
    // não criar notificação/buffer para evitar bolhas vazias na conversa.
    if (!payload.text) return;
    const timeNow = payload.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const notif = { id: payload.id || (Date.now() + Math.random()), userId: payload.userId, userName: payload.userName || payload.user || 'Contato', avatar: payload.avatar || null, text: payload.text, time: timeNow };

    setNotifications(prev => [notif, ...(prev || []).slice(0, 49)]);
    setMessagesBuffer(prev => {
      const copy = { ...(prev || {}) };
      copy[notif.userId] = [...(copy[notif.userId] || []), { id: notif.id, text: notif.text, time: notif.time }];
      return copy;
    });
  };

  // ref para pausar temporariamente o simulador (timestamp em ms)
  const pausedUntilRef = useRef(0);
  // ref para lembrar último índice por usuário e evitar repetição
  const perUserLastIndexRef = useRef({});

  // responder ao 'marcar tudo como lido' disparado por outros componentes
  useEffect(() => {
    if (!clearAll) return;
    // limpar todas as notificações e buffer de mensagens pendentes
    setNotifications && setNotifications([]);
    setMessagesBuffer && setMessagesBuffer({});
    setUnreadCount && setUnreadCount(0);
    // pausar simulador por 5s para evitar reaparecimento imediato
    pausedUntilRef.current = Date.now() + 10000;
    // resetar flag
    setClearAll && setClearAll(false);
  }, [clearAll]);

  // atualizar badge globalmente com base em notifications (usuários distintos)
  useEffect(() => {
    const distinct = notifications ? Array.from(new Set(notifications.map(n => n.userId))).length : 0;
    setUnreadCount && setUnreadCount(distinct);
  }, [notifications, setUnreadCount]);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount, notifications, setNotifications, messagesBuffer, setMessagesBuffer, pushNotification, pendingOpenUserId, setPendingOpenUserId, notifDropdownOpen, setNotifDropdownOpen, clearAll, setClearAll }}>
      <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
        <div className="app-layout">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <main className="main-content">
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="main-inner">
              <Outlet />
            </div>
          </main>

          {floatingNotif && !notifDropdownOpen && (
            <div
              className={`global-floating-notif`}
              role="button"
              onClick={() => {
                // navegar e abrir conversa
                setPendingOpenUserId && setPendingOpenUserId(floatingNotif.userId);
                // navegar com state para evitar race
                navigate('/mensagens', { state: { openUserId: floatingNotif.userId } });
                setFloatingNotif(null);
              }}
            >
              <img src={floatingNotif.avatar || require('../icons/Vector.svg')} alt="notif" />
              <div className="global-floating-body">
                <strong>{floatingNotif.userName}</strong>
                <div className="global-floating-text">{floatingNotif.text}</div>
              </div>
            </div>
          )}
        </div>
      </PageTitleContext.Provider>
    </NotificationContext.Provider>
  )
}

import React from 'react';

export const NotificationContext = React.createContext({
  unreadCount: 0,
  setUnreadCount: () => {},
  notifications: [],
  setNotifications: () => {},
  // buffer de mensagens geradas pelo simulador quando a página de chat pode não estar montada
  messagesBuffer: {},
  setMessagesBuffer: () => {},
  // helper: adicionar notificação + buffer de mensagem de forma consistente
  pushNotification: () => {},
  pendingOpenUserId: null,
  setPendingOpenUserId: () => {},
  // se o dropdown de notificações do navbar está aberto (para ajustar UI global)
  notifDropdownOpen: false,
  setNotifDropdownOpen: () => {},
  clearAll: false,
  setClearAll: () => {}
});

export default NotificationContext;

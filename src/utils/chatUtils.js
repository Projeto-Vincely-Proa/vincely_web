export function formatTime(secs) {
  if (secs === undefined || secs === null) return '0:00';
  const s = Math.max(0, Math.floor(secs));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${String(ss).padStart(2, '0')}`;
}

// retorna ratio [0..1] a partir de um evento de click em uma barra
export function computeClickRatio(e) {
  const bar = e && e.currentTarget ? e.currentTarget : null;
  if (!bar) return 0;
  const rect = bar.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, x / rect.width));
  return ratio;
}

// scroll helper: rola a lista para o último item (index)
export function scrollToItem(listRef, index) {
  try {
    if (!listRef || !listRef.current) return;
    if (typeof listRef.current.scrollToItem === 'function') {
      listRef.current.scrollToItem(index, 'end');
    } else if (listRef.current.scrollTop !== undefined) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  } catch (err) {
    // noop
  }
}

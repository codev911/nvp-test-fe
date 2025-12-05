import { fetchNotifications, markNotifications } from '@/lib/api';
import type { NotificationItem } from '@/types';

const listeners = new Set<(items: NotificationItem[]) => void>();
let cache: NotificationItem[] = [];
let socket: WebSocket | null = null;
let activeToken: string | null = null;
let reconnectTimer: number | null = null;

function notify() {
  const sorted = [...cache].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  listeners.forEach((listener) => {
    listener(sorted);
  });
}

function getWsUrl() {
  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
  const wsBase = base.replace(/^http/i, 'ws');
  return `${wsBase}/ws/notifications`;
}

async function ensureHydrated(token: string) {
  activeToken = token;
  cache = await fetchNotifications(token);
  notify();
}

function connect(token: string) {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  const url = `${getWsUrl()}?token=${token}`;
  socket = new WebSocket(url);

  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data as string) as {
        type?: string;
        data?: NotificationItem;
      };
      if (payload.type === 'notification' && payload.data) {
        cache = [{ ...payload.data, read: false }, ...cache];
        notify();
      }
    } catch (_err) {
      // ignore malformed messages
    }
  };

  socket.onclose = () => {
    socket = null;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }
    reconnectTimer = window.setTimeout(() => {
      if (activeToken) {
        connect(activeToken);
      }
    }, 2000);
  };
}

export async function subscribeNotifications(
  token: string,
  listener: (items: NotificationItem[]) => void,
) {
  listeners.add(listener);
  if (activeToken !== token) {
    if (socket) {
      socket.close();
      socket = null;
    }
    await ensureHydrated(token);
  } else {
    listener([...cache]);
  }

  connect(token);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && socket) {
      socket.close();
      socket = null;
    }
  };
}

export async function markNotificationsRead(token: string) {
  await markNotifications(token);
  cache = cache.map((item) => ({ ...item, read: true }));
  notify();
}

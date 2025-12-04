import type { NotificationItem } from '@/types';

const notifications: NotificationItem[] = [];
const listeners = new Set<(items: NotificationItem[]) => void>();

export function subscribeNotifications(listener: (items: NotificationItem[]) => void) {
  listeners.add(listener);
  listener([...notifications]);
  return () => listeners.delete(listener);
}

export function markNotificationsRead() {
  notifications.forEach((n) => {
    n.read = true;
  });
  listeners.forEach((listener) => {
    listener([...notifications]);
  });
}

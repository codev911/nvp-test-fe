import { v4 as uuid } from 'uuid';
import type { AuthUser, Employee, NotificationItem } from '@/types';

const seededAdmin = {
  email: 'admin@nusa.id',
  name: 'Nusa Admin',
  passwordHash: hashPassword('Admin123!'),
};

const positions = [
  'Product Analyst',
  'Backend Engineer',
  'Frontend Engineer',
  'QA Specialist',
  'Data Scientist',
  'Product Manager',
  'People Ops',
  'Security Engineer',
  'DevOps Engineer',
  'Designer',
];

const employees: Employee[] = buildSeedEmployees();
const notifications: NotificationItem[] = [];
const notificationListeners = new Set<(items: NotificationItem[]) => void>();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function hashPassword(value: string) {
  return btoa(value.split('').reverse().join(''));
}

function buildSeedEmployees(): Employee[] {
  const list: Employee[] = [];
  const now = Date.now();
  for (let i = 1; i <= 12000; i += 1) {
    const created = new Date(now - i * 1000 * 60 * 12);
    list.push({
      id: uuid(),
      name: `Example ${i.toString().padStart(4, '0')}`,
      age: 21 + ((i * 7) % 25),
      position: positions[i % positions.length],
      salary: 6000000 + ((i * 12345) % 15000000),
      createdAt: created.toISOString(),
      updatedAt: created.toISOString(),
    });
  }
  return list;
}

function emitNotifications() {
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  notificationListeners.forEach((listener) => {
    listener(sorted);
  });
}

function pushNotification(message: string) {
  const item: NotificationItem = {
    id: uuid(),
    title: 'Job Update',
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  notifications.unshift(item);
  emitNotifications();
}

function scheduleNotification(message: string) {
  setTimeout(() => pushNotification(message), 1200 + Math.random() * 800);
}

export async function login(
  email: string,
  password: string,
): Promise<{ token: string; user: AuthUser }> {
  await delay(450);
  const passwordHash = hashPassword(password);
  if (email !== seededAdmin.email || passwordHash !== seededAdmin.passwordHash) {
    throw new Error('Email atau password salah');
  }
  const token = `mock-jwt-${uuid()}`;
  return { token, user: { email: seededAdmin.email, name: seededAdmin.name } };
}

export async function listEmployees(params: {
  search: string;
  page: number;
  pageSize: number;
}): Promise<{ data: Employee[]; total: number }> {
  const { search, page, pageSize } = params;
  await delay(180 + Math.random() * 120);
  const term = search.trim().toLowerCase();
  const filtered = term
    ? employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(term) ||
          emp.position.toLowerCase().includes(term) ||
          String(emp.age).includes(term),
      )
    : employees;
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return { data: filtered.slice(start, end), total };
}

export async function createEmployee(payload: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) {
  await delay(260);
  const now = new Date().toISOString();
  const record: Employee = {
    ...payload,
    id: uuid(),
    createdAt: now,
    updatedAt: now,
  };
  employees.unshift(record);
  scheduleNotification(`Profil ${record.name} selesai diproses.`);
  return record;
}

export async function updateEmployee(
  id: string,
  payload: Partial<Omit<Employee, 'id' | 'createdAt'>>,
): Promise<Employee> {
  await delay(220);
  const idx = employees.findIndex((item) => item.id === id);
  if (idx === -1) {
    throw new Error('Data tidak ditemukan');
  }
  const updated: Employee = {
    ...employees[idx],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  employees[idx] = updated;
  scheduleNotification(`Perubahan ${updated.name} dikonfirmasi.`);
  return updated;
}

export async function deleteEmployee(id: string) {
  await delay(200);
  const idx = employees.findIndex((item) => item.id === id);
  if (idx === -1) {
    throw new Error('Data tidak ditemukan');
  }
  const [removed] = employees.splice(idx, 1);
  scheduleNotification(`Data ${removed.name} dihapus.`);
  return true;
}

export async function importEmployeesFromCsv(
  content: string,
  onProgress?: (info: { percent: number; processed: number; total: number }) => void,
) {
  await delay(300);
  const rows = content
    .split(/\r?\n/)
    .map((r) => r.trim())
    .filter(Boolean);
  const total = Math.max(rows.length - 1, 200);
  let processed = 0;
  const batchSize = Math.max(5, Math.round(total / 18));

  return new Promise<number>((resolve) => {
    const timer = setInterval(() => {
      processed = Math.min(total, processed + batchSize);
      const percent = Math.min(100, Math.round((processed / total) * 100));
      onProgress?.({ percent, processed, total });

      if (processed >= total) {
        clearInterval(timer);
        const now = new Date().toISOString();
        const samples = rows.slice(1, Math.min(rows.length, 40));
        samples.forEach((line) => {
          const [name, age, position, salary] = line.split(',').map((v) => v?.trim());
          employees.unshift({
            id: uuid(),
            name: name || 'CSV Candidate',
            age: Number(age) || 23 + Math.floor(Math.random() * 10),
            position: position || positions[Math.floor(Math.random() * positions.length)],
            salary: Number(salary) || 8000000 + Math.floor(Math.random() * 8000000),
            createdAt: now,
            updatedAt: now,
          });
        });
        scheduleNotification(`Import batch (${samples.length || 10} data) selesai.`);
        resolve(samples.length || 10);
      }
    }, 240);
  });
}

export function subscribeNotifications(listener: (items: NotificationItem[]) => void) {
  notificationListeners.add(listener);
  listener([...notifications]);
  return () => notificationListeners.delete(listener);
}

export function markNotificationsRead() {
  notifications.forEach((n) => {
    n.read = true;
  });
  emitNotifications();
}

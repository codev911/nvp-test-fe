import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { Navbar } from '@/components/Navbar';
import { EmployeeTable } from '@/components/EmployeeTable';
import { AddEmployeeModal } from '@/components/AddEmployeeModal';
import { EditEmployeeModal } from '@/components/EditEmployeeModal';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { NotificationPanel } from '@/components/NotificationPanel';
import {
  PAGE_SIZE,
  useCreateEmployee,
  useDeleteEmployee,
  useEmployeeList,
  useImportEmployees,
  useUpdateEmployee,
} from '@/hooks/useEmployees';
import { markNotificationsRead, subscribeNotifications } from '@/lib/notifications';
import type { Employee, NotificationItem } from '@/types';

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'age' | 'position' | 'salary'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [importProgress, setImportProgress] = useState({ percent: 0, processed: 0, total: 100 });

  const { data, isLoading } = useEmployeeList({
    search,
    page,
    sort: sortField,
    sortType: sortOrder,
    token: token || '',
  });
  const createMutation = useCreateEmployee(token || '');
  const updateMutation = useUpdateEmployee(token || '');
  const deleteMutation = useDeleteEmployee(token || '');
  const importMutation = useImportEmployees((info) => setImportProgress(info), token || '');

  useEffect(() => {
    if (!token) return;
    let unsubscribe: (() => void) | undefined;
    subscribeNotifications(token, (items) => setNotifications(items)).then((unsub) => {
      unsubscribe = unsub;
    });
    return () => {
      unsubscribe?.();
      setNotifications([]);
    };
  }, [token]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleSortChange = (field: 'name' | 'age' | 'position' | 'salary') => {
    setPage(1);
    setSortOrder((prev) => (field === sortField ? (prev === 'asc' ? 'desc' : 'asc') : 'asc'));
    setSortField(field);
  };

  const hasUnread = useMemo(() => notifications.some((n) => !n.read), [notifications]);

  const handleCreateRows = async (rows: Array<{ name: string; age: number; position: string; salary: number }>) => {
    for (const row of rows) {
      await createMutation.mutateAsync(row);
    }
  };

  const handleUploadCsv = async (file: File) => {
    setImportProgress({ percent: 0, processed: 0, total: 100 });
    await importMutation.mutateAsync(file);
  };

  const handleEditSave = async (payload: { name: string; age: number; position: string; salary: number }) => {
    if (!editTarget) return;
    await updateMutation.mutateAsync({ id: editTarget.id, payload });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleMarkRead = async () => {
    if (!token) return;
    await markNotificationsRead(token);
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const totalEmployees = data?.total ?? 0;
  const processing =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    importMutation.isPending;
  const processLabel =
    (importMutation.isPending && 'Import in progress') ||
    (createMutation.isPending && 'Membuat data...') ||
    (updateMutation.isPending && 'Memperbarui data...') ||
    (deleteMutation.isPending && 'Menghapus data...') ||
    undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        userName={user?.name}
        onLogout={logout}
        onOpenNotifications={() => setNotifOpen((v) => !v)}
        hasUnread={hasUnread}
        processing={processing}
        processLabel={processLabel}
      />

      <div className="relative">
        {notifOpen && (
          <div className="absolute right-6 md:right-10">
            <NotificationPanel
              items={notifications}
              onClose={() => setNotifOpen(false)}
              onMarkRead={handleMarkRead}
            />
          </div>
        )}
      </div>

      <main className="flex-1 px-6 md:px-10 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Total" value={totalEmployees.toLocaleString('id-ID')} hint="entry aktif" />
          <StatCard
            label="Import job"
            value={`${importProgress.percent}%`}
            hint={`${importProgress.processed}/${importProgress.total} baris`}
            accent="from-indigo-500 to-fuchsia-500"
          />
          <StatCard
            label="Notifications"
            value={notifications.length}
            hint={hasUnread ? 'baru masuk' : 'semua dibaca'}
            accent="from-emerald-400 to-cyan-400"
          />
        </div>

        <EmployeeTable
          data={data?.data || []}
          total={totalEmployees}
          page={page}
          pageSize={PAGE_SIZE}
          loading={isLoading}
          search={search}
          sortField={sortField}
          sortOrder={sortOrder}
          onSearch={setSearch}
          onPageChange={setPage}
          onSortChange={handleSortChange}
          onAdd={() => setShowAdd(true)}
          onEdit={(emp) => setEditTarget(emp)}
          onDelete={(emp) => setDeleteTarget(emp)}
        />
      </main>

      <AddEmployeeModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreateRows={handleCreateRows}
        onUploadCsv={handleUploadCsv}
        uploadProgress={importProgress}
        uploading={importMutation.isPending}
        creating={createMutation.isPending}
      />

      <EditEmployeeModal
        open={Boolean(editTarget)}
        employee={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleEditSave}
        saving={updateMutation.isPending}
      />

      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        employee={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

function StatCard({ label, value, hint, accent = 'from-cyan-400 to-indigo-500' }: { label: string; value: string; hint: string; accent?: string }) {
  return (
    <div className="rounded-2xl blurred-panel border border-slate-800 p-4 flex items-center justify-between shadow-glow">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</div>
        <div className="text-2xl font-semibold text-slate-50">{value}</div>
        <div className="text-sm text-slate-500">{hint}</div>
      </div>
      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center text-slate-900 font-bold`}>
        •
      </div>
    </div>
  );
}

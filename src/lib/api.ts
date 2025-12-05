type ApiEnvelope<T> = {
  status?: string;
  message?: string;
  data?: T;
  pagination?: {
    total_data?: number;
    total_page?: number;
    page?: number;
    limit?: number;
  };
};

type FetchOptions = {
  method?: string;
  token?: string | null;
  body?: unknown;
  isFormData?: boolean;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

function buildHeaders(token?: string | null, isFormData?: boolean) {
  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<ApiEnvelope<T>> {
  if (!API_BASE_URL) {
    throw new Error('API base URL is not configured (VITE_API_BASE_URL)');
  }

  const { method = 'GET', token, body, isFormData } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token, isFormData),
    body: body ? (isFormData ? (body as BodyInit) : JSON.stringify(body)) : undefined,
  });

  const json = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok) {
    const message = json.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return json;
}

export async function login(email: string, password: string) {
  const res = await apiFetch<{ token: string }>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  const token = res.data?.token;
  if (!token) {
    throw new Error(res.message || 'Token tidak ditemukan');
  }
  return { token };
}

export async function getProfile(token: string) {
  const res = await apiFetch<{ username: string; role: string }>('/auth/me', {
    method: 'GET',
    token,
  });
  if (!res.data) {
    throw new Error(res.message || 'Profile tidak ditemukan');
  }
  return res.data;
}

export async function fetchEmployees(params: {
  page: number;
  pageSize: number;
  sort: string;
  sortType: 'asc' | 'desc';
  search?: string;
  token: string;
}) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.pageSize),
    sort: params.sort,
    sorttype: params.sortType,
  });
  if (params.search) {
    query.set('search', params.search);
  }
  const res = await apiFetch<
    Array<{
      id: string;
      name: string;
      age: number;
      position: string;
      salary: number;
      created_at?: string;
      updated_at?: string;
    }>
  >(`/employee/data?${query.toString()}`, {
    method: 'GET',
    token: params.token,
  });

  const items =
    res.data?.map((item) => ({
      id: item.id,
      name: item.name,
      age: item.age,
      position: item.position,
      salary: item.salary,
      createdAt: item.created_at || '',
      updatedAt: item.updated_at || '',
    })) ?? [];

  const total = res.pagination?.total_data ?? items.length;
  return { data: items, total };
}

export async function createEmployees(
  payload: Array<{ name: string; age: number; position: string; salary: number }>,
  token: string,
) {
  const res = await apiFetch<{ total_queued: number }>('/employee/add', {
    method: 'POST',
    token,
    body: payload,
  });
  return res.data;
}

export async function updateEmployees(
  payload: Array<{ id: string; name?: string; age?: number; position?: string; salary?: number }>,
  token: string,
) {
  const res = await apiFetch<{ total_queued: number }>('/employee/update', {
    method: 'PATCH',
    token,
    body: payload,
  });
  return res.data;
}

export async function deleteEmployees(ids: string[], token: string) {
  const res = await apiFetch<{ total_queued: number }>('/employee/remove', {
    method: 'DELETE',
    token,
    body: ids,
  });
  return res.data;
}

export async function fetchNotifications(token: string) {
  const res = await apiFetch<
    Array<{
      id: string;
      title: string;
      message: string;
      createdAt: string;
      read: boolean;
    }>
  >('/notifications', { method: 'GET', token });
  return res.data || [];
}

export async function markNotifications(token: string, ids?: string[]) {
  const res = await apiFetch<{ modified: number }>('/notifications/read', {
    method: 'PATCH',
    token,
    body: ids || [],
  });
  return res.data;
}

export async function importEmployeesCsv(file: File, token: string) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiFetch<{ total_queued: number }>('/employee/add/csv', {
    method: 'POST',
    token,
    body: formData,
    isFormData: true,
  });
  return res.data;
}

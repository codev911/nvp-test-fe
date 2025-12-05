import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/auth/AuthContext';

vi.mock('@/lib/api', () => ({
  login: vi.fn(async () => ({ token: 'jwt-token' })),
  getProfile: vi.fn(async () => ({ username: 'tester', role: 'admin' })),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('logs in and stores session', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('user@example.com', 'pass12345');
    });

    expect(result.current.token).toBe('jwt-token');
    expect(result.current.user?.name).toBe('tester');
    expect(localStorage.getItem('example-auth')).toContain('jwt-token');
  });

  it('logs out and clears storage', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('user@example.com', 'pass12345');
      result.current.logout();
    });

    expect(result.current.token).toBeNull();
    expect(localStorage.getItem('example-auth')).toBeNull();
  });
});

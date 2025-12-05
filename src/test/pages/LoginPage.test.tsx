import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/pages/LoginPage';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/auth/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    token: null,
    loading: false,
  }),
}));

describe('LoginPage', () => {
  it('submits login form', async () => {
    render(<LoginPage />);

    await userEvent.clear(screen.getByLabelText(/Email/i));
    await userEvent.type(screen.getByLabelText(/Email/i), 'user@example.com');
    await userEvent.clear(screen.getByLabelText(/Password/i));
    await userEvent.type(screen.getByLabelText(/Password/i), 'Secret123!');

    await userEvent.click(screen.getByRole('button', { name: /Enter Panel/i }));

    expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'Secret123!');
  });
});

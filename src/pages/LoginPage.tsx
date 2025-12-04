import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

const defaultEmail = 'admin@nusa.id';
const defaultPassword = 'Admin123!';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, token, loading } = useAuth();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate, token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Gagal login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch place-items-center">
        <div className="rounded-3xl blurred-panel p-10 shadow-glow flex flex-col gap-6 border border-slate-800 text-center md:text-left w-full">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-cyan-300/80">
            <div className="h-[1px] w-10 bg-cyan-400/40" />
            Access
          </div>
          <h1 className="text-4xl font-semibold font-display text-slate-50 leading-tight">
            Selamat datang di Example Control Room
          </h1>
          <p className="text-slate-400 max-w-md">
            Masuk untuk membuka panel karyawan; mode gelap menjaga fokus dan stabil di mode portrait sehingga
            pengalaman tetap tenang.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl blurred-panel p-8 md:p-10 shadow-xl border border-slate-800 flex flex-col gap-6 w-full text-center"
        >
          <div className="flex items-center justify-between md:justify-between flex-col md:flex-row gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Sign In</p>
              <p className="text-2xl font-display text-slate-50">Admin Lane</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500/70 to-indigo-500/70 flex items-center justify-center text-slate-900 font-semibold shadow-glow">
              •
            </div>
          </div>

          <label className="text-sm text-slate-300 space-y-2 text-left md:text-left">
            <span className="block text-slate-400">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl bg-slate-900/70 border border-slate-700 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition"
              placeholder="admin@nusa.id"
            />
          </label>

          <label className="text-sm text-slate-300 space-y-2 text-left md:text-left">
            <span className="block text-slate-400">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl bg-slate-900/70 border border-slate-700 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition"
              placeholder="••••••••"
            />
          </label>

          {error && <div className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-semibold py-3 shadow-glow transition hover:translate-y-[-1px] hover:shadow-xl disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Enter Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}

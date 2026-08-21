import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { useAuthStore } from '../../store';
import api from '../../api/client';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin/products';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleQuickFill = () => {
    setEmail('admin@firmitas.com');
    setPassword('Admin@123');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // The Firmitas backend is the only authority on credentials. There is no
      // offline/demo fallback: a failed sign-in must stay failed, otherwise
      // anyone knowing the placeholder password gets super admin access.
      const res = await api.post('/auth/login', { email, password });

      if (!res.data?.success || !res.data?.accessToken) {
        setErrorMsg(res.data?.message || 'Invalid email or password. Please try again.');
        return;
      }

      login(res.data.accessToken, res.data.user);
      toast.success(`Welcome back, ${res.data.user?.name || 'Admin'}!`);
      const from = (location.state as any)?.from?.pathname || '/admin/products';
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err?.code === 'ECONNABORTED') {
        setErrorMsg('The server took too long to respond. It may be waking up — please try again.');
      } else if (err?.code === 'ERR_NETWORK') {
        setErrorMsg('Cannot reach the server. Please check that the backend is running.');
      } else {
        setErrorMsg(err?.response?.data?.message || 'Invalid email or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#090b10] text-slate-100 p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-[#121620] border border-[#1e2536] rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-[#090b10] shadow-lg shadow-teal-500/20 mb-4">
              <ShieldCheck size={30} strokeWidth={2.4} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Firmitas Admin Portal</h1>
            <p className="text-sm text-slate-400 mt-1">Sign in to manage catalog, CMS & console</p>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="mb-6 bg-[#161c28] border border-[#252f44] rounded-xl p-3 text-xs flex items-center justify-between text-slate-300">
            <div>
              <span className="font-semibold text-teal-400">Default Admin:</span>
              <span className="ml-1 text-slate-300 font-mono">admin@firmitas.com</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 transition-all font-medium flex items-center gap-1 cursor-pointer"
            >
              <KeyRound size={12} /> Fill
            </button>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@firmitas.com"
                  className="w-full bg-[#181f2e] border border-[#263044] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#181f2e] border border-[#263044] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-[#1c2230] text-center text-xs text-slate-500">
            <a href="/" className="text-slate-400 hover:text-teal-400 transition-colors">
              ← Return to public website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

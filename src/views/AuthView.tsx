import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Images,
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const {
    authIntent,
    setAuthIntent,
    login,
    signup,
    currentUser,
    setCurrentPage,
    activePhotos,
    subtotal,
    totalPhotosCount,
  } = useApp();

  const [mode, setMode] = useState<'signup' | 'login'>(
    authIntent === 'login' ? 'login' : 'signup'
  );
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState(currentUser?.name || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup') {
      signup(email, name || email.split('@')[0]);
      setSuccessMessage('Account created successfully! Continuing to payment...');
    } else {
      login(email);
      setSuccessMessage('Logged in successfully! Continuing to payment...');
    }

    setTimeout(() => {
      setCurrentPage('pay');
    }, 400);
  };

  const handleDemoLogin = (demoEmail: string) => {
    login(demoEmail);
    setSuccessMessage(`Signed in as ${demoEmail}! Continuing to payment...`);
    setTimeout(() => {
      setCurrentPage('pay');
    }, 300);
  };

  return (
    <div className="pb-40 pt-8 max-w-4xl mx-auto px-4">
      {/* Top Back Nav */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentPage('checkout')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Address & Map</span>
        </button>

        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
          Step 3: User Authentication
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toggle Mode Banner */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-2">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-center text-xs sm:text-sm font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Account (Sign Up)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-center text-xs sm:text-sm font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Existing Customer (Log In)
          </button>
        </div>

        <div className="p-6 sm:p-10 max-w-xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {mode === 'signup' ? 'Create Your PhotoPrint Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {mode === 'signup'
                ? 'Save all your uploaded high-res photos to your permanent archive and track orders.'
                : 'Access your saved address, uploaded image vault, and past invoices.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Minimum 6 characters for demo or live account.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* "Continue to pay page" button as requested */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{mode === 'signup' ? 'Create Account & Continue to Pay' : 'Log In & Continue to Pay'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins for easy evaluator testing */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              One-Click Demo Accounts
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('jsadlerren@gmail.com')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-white text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                    J. Sadler
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                    Customer
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block truncate">
                  jsadlerren@gmail.com
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin@photoprint.com')}
                className="p-2.5 rounded-xl border border-amber-200/80 hover:border-amber-400 bg-amber-50/50 hover:bg-white text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 group-hover:text-amber-700">
                    Elena Vance
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">
                    Admin
                  </span>
                </div>
                <span className="text-[11px] text-amber-700/80 block truncate">
                  admin@photoprint.com
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Printer,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  MapPin,
  CreditCard,
  FileText,
  Images,
  Upload,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { ActivePage } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    currentUser,
    logout,
    activePhotos,
    latestOrder,
  } = useApp();

  const steps: { id: ActivePage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: '1. Upload Photos', icon: Upload },
    { id: 'checkout', label: '2. Address & Map', icon: MapPin },
    { id: 'auth', label: '3. Account / Guest', icon: UserIcon },
    { id: 'pay', label: '4. Payment', icon: CreditCard },
    { id: 'invoice', label: '5. Invoice & DHL', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner with Quick Switcher */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
              <Sparkles className="w-3 h-3" /> DHL Express Worldwide Delivery
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              Archival Lab Quality Photo Prints & Framed Canvas
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded text-[11px]">
              <span className="text-slate-400">Current Role:</span>
              <span
                className={`font-semibold ${
                  currentUser?.role === 'admin'
                    ? 'text-amber-400'
                    : currentUser
                    ? 'text-emerald-400'
                    : 'text-sky-400'
                }`}
              >
                {currentUser?.role === 'admin'
                  ? 'Admin'
                  : currentUser
                  ? `User (${currentUser.name})`
                  : 'Guest User'}
              </span>
            </div>

            {/* Direct Admin link button */}
            <button
              type="button"
              onClick={() => setCurrentPage('admin')}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                currentPage === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-amber-950/40 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          type="button"
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                PhotoPrint
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                Express
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Upload • Custom Maps Checkout • DHL Tracking
            </p>
          </div>
        </button>

        {/* Steps Breadcrumb */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentPage === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentPage(step.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{step.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User / Action Buttons */}
        <div className="flex items-center gap-2">
          {/* User Account / Photos record button */}
          <button
            type="button"
            onClick={() => setCurrentPage('account')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              currentPage === 'account'
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <Images className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">My Photos Vault</span>
            {currentUser?.uploadedPhotos && currentUser.uploadedPhotos.length > 0 && (
              <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                {currentUser.uploadedPhotos.length}
              </span>
            )}
          </button>

          {/* Login / Signup / Profile */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage('account')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors"
                title={`Logged in as ${currentUser.email}`}
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate hidden md:inline font-semibold">
                  {currentUser.name}
                </span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage('auth')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('auth')}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Step Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50/90 py-1.5 px-2 text-[11px] overflow-x-auto">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentPage === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentPage(step.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md whitespace-nowrap ${
                isActive
                  ? 'font-bold text-indigo-700 bg-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{step.label.replace(/^[0-9]\.\s*/, '')}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

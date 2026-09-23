/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomThumbnailsBar } from './components/BottomThumbnailsBar';
import { HomeView } from './views/HomeView';
import { CheckoutView } from './views/CheckoutView';
import { AuthView } from './views/AuthView';
import { PayView } from './views/PayView';
import { InvoiceView } from './views/InvoiceView';
import { UserAccountView } from './views/UserAccountView';
import { AdminView } from './views/AdminView';
import { ShieldCheck, Truck, Printer, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentPage } = useApp();

  return (
    <main className="min-h-[calc(100vh-140px)]">
      {currentPage === 'home' && <HomeView />}
      {currentPage === 'checkout' && <CheckoutView />}
      {currentPage === 'auth' && <AuthView />}
      {currentPage === 'pay' && <PayView />}
      {currentPage === 'invoice' && <InvoiceView />}
      {currentPage === 'account' && <UserAccountView />}
      {currentPage === 'admin' && <AdminView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <MainContent />
        <BottomThumbnailsBar />

        {/* Global Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500 print:hidden">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-slate-800">PhotoPrint Express</span>
              <span>• Archival Photo Lab & Worldwide Delivery</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-amber-500" /> Official DHL Logistics Partner
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 256-Bit SSL Encrypted
              </span>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}

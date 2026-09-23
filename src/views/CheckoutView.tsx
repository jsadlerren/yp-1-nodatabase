import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleMapsAddressPicker } from '../components/GoogleMapsAddressPicker';
import {
  MapPin,
  User,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  UserCheck,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { DeliveryAddress } from '../types';

export const CheckoutView: React.FC = () => {
  const {
    currentAddress,
    setDeliveryAddress,
    currentUser,
    setCurrentPage,
    setAuthIntent,
    activePhotos,
    subtotal,
    totalPhotosCount,
    continueAsPaidGuest,
  } = useApp();

  const [formAddress, setFormAddress] = useState<DeliveryAddress>(currentAddress);
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');
  const [guestName, setGuestName] = useState(currentAddress.fullName || currentUser?.name || '');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleFieldChange = (field: keyof DeliveryAddress, value: string) => {
    const updated = { ...formAddress, [field]: value };
    setFormAddress(updated);
    setDeliveryAddress(updated);
  };

  const handleMapAddressChange = (newAddress: DeliveryAddress) => {
    setFormAddress(newAddress);
    setDeliveryAddress(newAddress);
  };

  const handlePaidGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail || !guestEmail.includes('@')) {
      setValidationError('Please enter a valid delivery email address for invoice and tracking.');
      return;
    }
    setDeliveryAddress(formAddress);
    continueAsPaidGuest(guestEmail, guestName || formAddress.fullName);
  };

  const handleGoToAuth = (intent: 'signup' | 'login') => {
    setDeliveryAddress(formAddress);
    setAuthIntent(intent);
    setCurrentPage('auth');
  };

  return (
    <div className="pb-40 pt-6 max-w-7xl mx-auto px-4">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() => setCurrentPage('home')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Photos ({totalPhotosCount})</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="hidden sm:inline">Checkout Step 2 of 4</span>
          <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md text-[11px]">
            Address & Map
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Address Entry & Google Map */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Delivery Destination Address
                </h2>
                <p className="text-xs text-slate-500">
                  Where should DHL Express deliver your printed photos?
                </p>
              </div>
            </div>

            {/* Address Input Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    value={formAddress.fullName}
                    onChange={(e) => {
                      handleFieldChange('fullName', e.target.value);
                      if (!guestName) setGuestName(e.target.value);
                    }}
                    placeholder="e.g. Alex Reynolds"
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (for DHL delivery SMS)
                  </label>
                  <input
                    type="tel"
                    value={formAddress.phone || ''}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    placeholder="+1 (555) 019-2831"
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formAddress.street}
                  onChange={(e) => handleFieldChange('street', e.target.value)}
                  placeholder="Street address, suite, unit, building, floor"
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formAddress.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    placeholder="City"
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    value={formAddress.state}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    placeholder="State / Province"
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={formAddress.zipCode}
                    onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                    placeholder="ZIP / Postal code"
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formAddress.country}
                  onChange={(e) => handleFieldChange('country', e.target.value)}
                  placeholder="United States"
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Interactive Google Map: "show address on google map" */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                Live Google Maps Location Preview
              </span>
              <span className="text-[11px] text-slate-500">
                Pin automatically updates with coordinates
              </span>
            </div>

            <GoogleMapsAddressPicker
              address={formAddress}
              onAddressChange={handleMapAddressChange}
              interactive={true}
              height="340px"
              zoom={14}
              showSearchPresets={true}
            />
          </div>
        </div>

        {/* Right column: Checkout Options (Paid Guest or Signup) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Option Box 1: Paid Guest Checkout */}
          <div className="bg-white rounded-2xl border-2 border-emerald-500/30 p-6 shadow-sm hover:border-emerald-500 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 mb-2">
                  Fast & No Password Needed
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Option A: Paid Guest Checkout
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Checkout immediately without creating a password. You will receive your DHL tracking code and invoice via email.
                </p>
              </div>
            </div>

            <form onSubmit={handlePaidGuest} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address for DHL Tracking & Invoice *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => {
                      setGuestEmail(e.target.value);
                      setValidationError('');
                    }}
                    placeholder="your.email@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {validationError && (
                <p className="text-xs text-rose-600 font-medium">{validationError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Continue as Paid Guest to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Option Box 2: Sign Up or Log In */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-2xl border border-indigo-200 p-6 shadow-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 mb-2">
              Recommended for Photographers
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Option B: Sign Up or Log In
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Create an account to keep a permanent digital archive of all your uploaded photos, re-order prints in one click, and access the user account.
            </p>

            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                onClick={() => handleGoToAuth('signup')}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Create Account & Continue to Pay</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleGoToAuth('login')}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Existing User? Log In Here</span>
              </button>
            </div>
          </div>

          {/* Order Summary Snapshot */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 space-y-2">
            <div className="flex justify-between font-bold text-slate-800 text-sm">
              <span>Order Summary ({totalPhotosCount} prints)</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Estimated DHL Shipping</span>
              <span className="text-emerald-700 font-semibold">Calculated at Pay step</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Estimated Tax (8.25%)</span>
              <span className="font-mono">${(subtotal * 0.0825).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

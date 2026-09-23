import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sparkles,
  Zap,
} from 'lucide-react';

export const PayView: React.FC = () => {
  const {
    activePhotos,
    subtotal,
    totalPhotosCount,
    currentAddress,
    currentUser,
    placeOrder,
    setCurrentPage,
    getProduct,
  } = useApp();

  const [shippingMethod, setShippingMethod] = useState<'DHL Express Worldwide' | 'DHL Standard Ground'>(
    'DHL Express Worldwide'
  );
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('884');
  const [cardholderName, setCardholderName] = useState(
    currentAddress.fullName || currentUser?.name || 'Alex Reynolds'
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCost = shippingMethod === 'DHL Express Worldwide' ? 9.99 : 4.99;
  const tax = Number((subtotal * 0.0825).toFixed(2));
  const total = Number((subtotal + shippingCost + tax).toFixed(2));

  const handleBuyNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      placeOrder(
        {
          brand: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
          last4: cardNumber.replace(/\D/g, '').slice(-4) || '4242',
        },
        shippingMethod
      );
      setIsProcessing(false);
      setCurrentPage('invoice');
    }, 800);
  };

  const fillTestCard = () => {
    setCardNumber('4532 8192 3840 9281');
    setExpiry('08/29');
    setCvc('312');
    setCardholderName(currentAddress.fullName || 'J. Sadler');
  };

  return (
    <div className="pb-44 pt-6 max-w-7xl mx-auto px-4">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() => setCurrentPage('auth')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Account</span>
        </button>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
          Step 4: Secure Payment & Buy Now
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Payment Form (Pay by Card) & Shipping */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Tier Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Select DHL Delivery Speed</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  shippingMethod === 'DHL Express Worldwide'
                    ? 'border-indigo-600 bg-indigo-50/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === 'DHL Express Worldwide'}
                  onChange={() => setShippingMethod('DHL Express Worldwide')}
                  className="sr-only"
                />
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> DHL Express Worldwide
                  </span>
                  <span className="font-mono text-xs font-bold text-indigo-700">$9.99</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Priority air transit • Delivered in 1–2 business days with door signature
                </p>
              </label>

              <label
                className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  shippingMethod === 'DHL Standard Ground'
                    ? 'border-indigo-600 bg-indigo-50/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === 'DHL Standard Ground'}
                  onChange={() => setShippingMethod('DHL Standard Ground')}
                  className="sr-only"
                />
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-xs text-slate-900">DHL Standard Ground</span>
                  <span className="font-mono text-xs font-bold text-slate-700">$4.99</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Standard courier delivery • 3–5 business days
                </p>
              </label>
            </div>
          </div>

          {/* Pay by Card Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Pay by Card</h3>
                  <p className="text-xs text-slate-500">
                    256-bit encrypted card processing via Stripe / PCI-DSS Level 1
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={fillTestCard}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 transition-colors"
              >
                Fill Demo Card
              </button>
            </div>

            <form onSubmit={handleBuyNow} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cardholder Full Name
                </label>
                <input
                  type="text"
                  required
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="Name on card"
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-9 pr-3 py-2.5 font-mono text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <div className="absolute right-3 top-2.5 flex items-center gap-1">
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                      VISA
                    </span>
                    <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                      MC
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full text-center font-mono text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Security Code (CVC)
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="CVC"
                      maxLength={4}
                      className="w-full pl-8 pr-3 text-center font-mono text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl py-2.5 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Buy Now Button as explicitly requested */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing || activePhotos.length === 0}
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-emerald-700/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing & Routing to DHL...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Buy Now • Pay ${total.toFixed(2)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Instant order confirmation & official DHL tracking number generated.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order & Delivery Summary Review */}
        <div className="lg:col-span-5 space-y-6">
          {/* Delivery Destination Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Shipping Destination
            </h4>
            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900">
                {currentAddress.fullName || currentUser?.name || 'Customer'}
              </p>
              <p>{currentAddress.street}</p>
              <p>
                {currentAddress.city}, {currentAddress.state} {currentAddress.zipCode}
              </p>
              <p className="text-slate-400">{currentAddress.country}</p>
              <p className="font-mono text-[11px] text-slate-400 pt-1">
                Lat: {currentAddress.lat?.toFixed(4)}, Lng: {currentAddress.lng?.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Payment Summary
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Photo Prints ({totalPhotosCount} units)</span>
                <span className="font-mono font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping ({shippingMethod})</span>
                <span className="font-mono font-medium">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Sales Tax (8.25%)</span>
                <span className="font-mono font-medium">${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-900">
              <span className="text-sm">Total Due Today</span>
              <span className="text-xl font-mono text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

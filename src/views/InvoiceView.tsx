import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleMapsAddressPicker } from '../components/GoogleMapsAddressPicker';
import {
  CheckCircle2,
  Printer,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  ArrowRight,
  Sparkles,
  Download,
  Copy,
  Check,
  ExternalLink,
  Package,
  Layers,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { Order } from '../types';

export const InvoiceView: React.FC = () => {
  const {
    latestOrder,
    orders,
    selectedOrderId,
    setCurrentPage,
    getProduct,
    updateOrder,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [showDHLModal, setShowDHLModal] = useState(false);

  // Pick order to display: selectedOrderId or latestOrder or first order
  const order: Order | undefined =
    (selectedOrderId && orders.find((o) => o.id === selectedOrderId)) ||
    latestOrder ||
    orders[0];

  if (!order) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">No Orders Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          You have not placed any orders yet.
        </p>
        <button
          type="button"
          onClick={() => setCurrentPage('home')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Start a New Photo Print Order
        </button>
      </div>
    );
  }

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(order.dhlTrackingNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdvanceDHLStatus = () => {
    const statuses: Order['status'][] = [
      'Processing',
      'Printed',
      'Handed to DHL',
      'In Transit',
      'Out for Delivery',
      'Delivered',
    ];
    const currentIndex = statuses.indexOf(order.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    const newEvent = {
      timestamp: new Date().toLocaleString(),
      status: `Status updated to ${nextStatus}`,
      location: 'DHL Regional Distribution Center',
      description: `Automated courier checkpoint scan: ${nextStatus}`,
    };

    updateOrder(order.id, {
      status: nextStatus,
      dhlEvents: [newEvent, ...order.dhlEvents],
    });
  };

  const printInvoiceWindow = () => {
    window.print();
  };

  return (
    <div className="pb-32 pt-6 max-w-5xl mx-auto px-4 print:p-0 print:m-0">
      {/* Success banner (hidden in print) */}
      <div className="bg-emerald-600 text-white rounded-2xl p-6 mb-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black">
              Payment Confirmed & Order Placed!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
              Your photos have entered the high-precision lab queue. Tracking code generated below.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={printInvoiceWindow}
            className="px-3.5 py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Print More Photos</span>
          </button>
        </div>
      </div>

      {/* Main Invoice Sheet */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-900">
                PhotoPrint
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                Official Invoice
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Archival Laboratory & Worldwide Express Delivery
            </p>
            <p className="text-xs font-mono text-slate-400 mt-2">
              Tax ID: US-EIN-94-2094182 • Receipt #{order.id}
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <div className="inline-block bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Order Number
              </span>
              <span className="font-mono font-black text-lg text-indigo-700">
                {order.orderNo}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex sm:justify-end items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        {/* DHL Tracking Block: "DHL tracking no." */}
        <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                DHL
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900">
                  {order.shippingMethod}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-base sm:text-lg text-slate-900">
                    {order.dhlTrackingNo}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyTracking}
                    className="p-1 rounded-md bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 transition-colors"
                    title="Copy tracking number"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDHLModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xs flex items-center gap-1"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track Live Progress</span>
              </button>

              <button
                type="button"
                onClick={handleAdvanceDHLStatus}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-amber-300 text-amber-900 text-xs font-semibold transition-colors print:hidden"
                title="Simulate courier scanning"
              >
                Simulate Next Scan
              </button>
            </div>
          </div>

          {/* Status Progress Pills */}
          <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">Current Status:</span>
              <span className="bg-white px-2 py-0.5 rounded-md border border-amber-300 font-semibold text-amber-900">
                {order.status}
              </span>
            </div>
            <div className="text-slate-600 text-[11px] hidden sm:block">
              Estimated Delivery: <strong>{order.estimatedDelivery}</strong>
            </div>
          </div>
        </div>

        {/* Customer & Address Details: "Name, address, address on google map" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer & Billing */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Customer & Recipient Details
            </h4>
            <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
            <p className="text-slate-600">Email: {order.customerEmail}</p>
            <p className="text-slate-600">Phone: {order.customerPhone}</p>
            <div className="pt-2 border-t border-slate-200 mt-2 text-slate-500">
              Payment Method:{' '}
              <strong className="text-slate-800">
                {order.paymentMethod.brand} ending in {order.paymentMethod.last4}
              </strong>
            </div>
          </div>

          {/* Shipping Address Text */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              Delivery Destination Address
            </h4>
            <p className="text-sm font-bold text-slate-900">
              {order.shippingAddress.fullName || order.customerName}
            </p>
            <p className="text-slate-700">{order.shippingAddress.street}</p>
            <p className="text-slate-700">
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.zipCode}
            </p>
            <p className="text-slate-500">{order.shippingAddress.country}</p>
            <p className="text-[11px] font-mono text-slate-400">
              Geo Coordinates: {order.shippingAddress.lat?.toFixed(4)}°, {order.shippingAddress.lng?.toFixed(4)}°
            </p>
          </div>
        </div>

        {/* Address on Google Map: "address on google map" */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Google Map Delivery Pinpoint
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">
              Live Google Maps JavaScript Platform
            </span>
          </div>

          <GoogleMapsAddressPicker
            address={order.shippingAddress}
            interactive={false}
            height="260px"
            zoom={15}
            showSearchPresets={false}
          />
        </div>

        {/* Itemized Photo Prints Table with Thumbnails */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Printed Photo Gallery Items ({order.photos.length} items)
          </h4>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Photo Preview</th>
                  <th className="py-3 px-4">Format & Finish</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.photos.map((photo, idx) => {
                  const prod = getProduct(photo.format);
                  const unitPrice = prod ? prod.price : 0.29;
                  const lineTotal = unitPrice * photo.quantity;

                  return (
                    <tr key={photo.id || idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow-2xs"
                            loading="lazy"
                          />
                          <div>
                            <p className="font-semibold text-slate-800 truncate max-w-[180px]">
                              {photo.name}
                            </p>
                            <p className="text-[10px] font-mono text-slate-400">
                              Uploaded {new Date(photo.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800">
                          {prod ? prod.name : '4x6" Glossy'}
                        </span>
                        <span className="block text-[10px] text-slate-500 uppercase">
                          Finish: {photo.finish}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-800">
                        {photo.quantity}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        ${unitPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ${lineTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Financial Summary */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-mono">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>DHL Express Shipping:</span>
                <span className="font-mono">${order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>State / Sales Tax (8.25%):</span>
                <span className="font-mono">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Paid:</span>
                <span className="font-mono text-indigo-700 text-base">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <button
            type="button"
            onClick={() => setCurrentPage('account')}
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <span>View All My Uploaded Photos Vault</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={printInvoiceWindow}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
            >
              Upload New Order
            </button>
          </div>
        </div>
      </div>

      {/* DHL Real-Time Tracking Modal */}
      {showDHLModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                  DHL
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    DHL Express Live Tracking
                  </h3>
                  <p className="font-mono text-xs text-slate-500">
                    {order.dhlTrackingNo}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDHLModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Tracking Milestones */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {order.dhlEvents.map((evt, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  <div className="mt-1 w-3 h-3 rounded-full bg-emerald-500 shrink-0 ring-4 ring-emerald-100" />
                  <div className="flex-1">
                    <p className="font-bold text-xs text-slate-900">{evt.status}</p>
                    <p className="text-[11px] text-slate-500">{evt.location}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{evt.description}</p>
                    <span className="text-[10px] font-mono text-indigo-600 block mt-1">
                      {evt.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDHLModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

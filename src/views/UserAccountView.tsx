import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleMapsAddressPicker } from '../components/GoogleMapsAddressPicker';
import {
  Images,
  User,
  MapPin,
  Package,
  Calendar,
  Upload,
  Trash2,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  Download,
  Maximize2,
  CheckCircle2,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { PhotoItem, DeliveryAddress } from '../types';

export const UserAccountView: React.FC = () => {
  const {
    currentUser,
    orders,
    removeUserPhoto,
    addUserPhoto,
    updateUserAddress,
    setCurrentPage,
    setSelectedOrderId,
    reorderPhotos,
    addUploadedPhotos,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'photos' | 'orders' | 'address'>('photos');
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState<DeliveryAddress>(
    currentUser?.address || {
      fullName: currentUser?.name || 'Customer',
      street: '1600 Amphitheatre Pkwy',
      city: 'Mountain View',
      state: 'CA',
      zipCode: '94043',
      country: 'United States',
      lat: 37.422,
      lng: -122.084,
    }
  );

  if (!currentUser) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign In to Access Your Account</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Log in or create an account to view your permanent archive of uploaded photos and orders.
        </p>
        <button
          type="button"
          onClick={() => setCurrentPage('auth')}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // All uploaded images for this user
  const userPhotos = currentUser.uploadedPhotos || [];
  const userOrders = orders.filter(
    (o) => o.userId === currentUser.id || o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const handleUploadNewToVault = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    await addUploadedPhotos(files);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserAddress(currentUser.id, addressForm);
    setIsEditingAddress(false);
  };

  return (
    <div className="pb-36 pt-6 max-w-7xl mx-auto px-4">
      {/* Account Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shadow-indigo-500/20">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{currentUser.name}</h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {currentUser.role === 'admin' ? 'Administrator' : 'Verified Customer'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser.email}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Account ID: {currentUser.id} • Member since {new Date(currentUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Photos to Vault</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUploadNewToVault}
              multiple
              accept="image/*"
              className="hidden"
            />

            {currentUser.role === 'admin' && (
              <button
                type="button"
                onClick={() => setCurrentPage('admin')}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mt-8 gap-4 sm:gap-8 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`pb-3 font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'photos'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Images className="w-4 h-4" />
            <span>Uploaded Images Record ({userPhotos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders & DHL Shipments ({userOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('address')}
            className={`pb-3 font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'address'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Shipping Address & Map</span>
          </button>
        </div>
      </div>

      {/* Tab Content: Uploaded Images Record */}
      {activeTab === 'photos' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Permanent Photo Upload Vault
              </h3>
              <p className="text-xs text-slate-500">
                The user account keeps a record of all uploaded images so you can re-order prints anytime.
              </p>
            </div>

            {userPhotos.length > 0 && (
              <button
                type="button"
                onClick={() => reorderPhotos(userPhotos)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Re-Order All {userPhotos.length} Photos</span>
              </button>
            )}
          </div>

          {userPhotos.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <Images className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No Photos Uploaded Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-6">
                Upload your high-res vacation, family, or portrait photos to keep a permanent archive.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
              >
                Upload First Photos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {userPhotos.map((photo, index) => (
                <div
                  key={photo.id || index}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative aspect-square bg-slate-950 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewPhotoUrl(photo.url)}
                        className="p-2 rounded-lg bg-white/90 hover:bg-white text-slate-900 shadow-sm"
                        title="View high-res"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => reorderPhotos([photo])}
                        className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                        title="Re-order this photo"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeUserPhoto(currentUser.id, photo.id)}
                        className="p-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
                        title="Delete from vault"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 backdrop-blur-2xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="p-2.5 text-xs flex flex-col justify-between flex-1">
                    <p className="font-semibold text-slate-900 truncate" title={photo.name}>
                      {photo.name}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-mono">
                      <span>{new Date(photo.uploadedAt).toLocaleDateString()}</span>
                      <span className="capitalize">{photo.finish}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            Order History & DHL Shipments
          </h3>

          {userOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No Orders Found</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                You haven't placed any photo print orders yet.
              </p>
              <button
                type="button"
                onClick={() => setCurrentPage('home')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
              >
                Start Printing Photos
              </button>
            </div>
          ) : (
            userOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-700 text-sm">
                      {ord.orderNo}
                    </span>
                    <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {ord.photos.length} Photo Prints • Total: ${ord.total.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    DHL Tracking: {ord.dhlTrackingNo} • {new Date(ord.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrderId(ord.id);
                      setCurrentPage('invoice');
                    }}
                    className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <span>View Invoice & Map</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => reorderPhotos(ord.photos)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Re-Order
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Saved Address */}
      {activeTab === 'address' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Default Delivery Address
              </h3>
              <p className="text-xs text-slate-500">
                Saved address used to pre-fill future photo print checkouts.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
            >
              {isEditingAddress ? 'Cancel' : 'Edit Address'}
            </button>
          </div>

          {isEditingAddress ? (
            <form onSubmit={handleSaveAddress} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullName: e.target.value })
                  }
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, street: e.target.value })
                  }
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ZIP
                  </label>
                  <input
                    type="text"
                    value={addressForm.zipCode}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, zipCode: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Save Delivery Address
              </button>
            </form>
          ) : (
            <div className="text-xs text-slate-700 space-y-1">
              <p className="text-sm font-bold text-slate-900">{addressForm.fullName}</p>
              <p>{addressForm.street}</p>
              <p>
                {addressForm.city}, {addressForm.state} {addressForm.zipCode}
              </p>
              <p>{addressForm.country}</p>
            </div>
          )}

          {/* Interactive Google Map of user's address */}
          <div className="mt-4">
            <GoogleMapsAddressPicker
              address={addressForm}
              onAddressChange={(newAddr) => {
                setAddressForm(newAddr);
                updateUserAddress(currentUser.id, newAddr);
              }}
              interactive={true}
              height="280px"
              zoom={14}
            />
          </div>
        </div>
      )}

      {/* High-res modal */}
      {previewPhotoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewPhotoUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={previewPhotoUrl}
              alt="High resolution vault preview"
              className="max-h-[85vh] w-auto object-contain mx-auto"
            />
            <button
              type="button"
              onClick={() => setPreviewPhotoUrl(null)}
              className="absolute top-3 right-3 px-3 py-1 bg-black/60 hover:bg-black/80 text-white rounded-lg text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

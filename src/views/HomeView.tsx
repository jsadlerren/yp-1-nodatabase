import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Upload,
  Sparkles,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  ArrowRight,
  Sliders,
  Maximize2,
  Info,
  ShieldCheck,
  Truck,
  HeartHandshake,
} from 'lucide-react';
import { PrintFinish } from '../types';

export const HomeView: React.FC = () => {
  const {
    activePhotos,
    addUploadedPhotos,
    addSamplePhotos,
    removePhoto,
    updatePhoto,
    clearActivePhotos,
    products,
    getProduct,
    subtotal,
    totalPhotosCount,
    setCurrentPage,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    await addUploadedPhotos(fileArray);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const applyFormatToAll = (formatId: string, finish: PrintFinish) => {
    activePhotos.forEach((photo) => {
      updatePhoto(photo.id, { format: formatId, finish });
    });
  };

  return (
    <div className="pb-36 pt-6 max-w-7xl mx-auto px-4">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Premium Archival Photo Lab
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Upload Multiple Photos & Print in Gallery Quality
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
          Upload any number of pictures, pick your finishes, input your delivery address on Google Maps,
          and track door-to-door delivery with DHL Express.
        </p>
      </div>

      {/* Upload Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/50 shadow-xs'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          multiple
          accept="image/*"
          className="hidden"
        />

        <div className="max-w-md mx-auto flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
            <Upload className="w-8 h-8 stroke-[1.8]" />
          </div>
          <div>
            <p className="text-base sm:text-lg font-bold text-slate-900">
              Click to select or drag and drop multiple photos
            </p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Supports high-resolution JPG, PNG, HEIC, WEBP (No size limit)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-colors"
            >
              Select Photos from Device
            </button>
            <button
              type="button"
              onClick={addSamplePhotos}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Load Sample Pack (5 Photos)
            </button>
          </div>
        </div>
      </div>

      {/* Feature Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3 shadow-2xs">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">DHL Express Tracked</h2>
            <p className="text-[11px] text-slate-500">Live GPS tracking & delivery ETA</p>
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3 shadow-2xs">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">100-Year Archival Inks</h2>
            <p className="text-[11px] text-slate-500">Fade-resistant museum grade paper</p>
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3 shadow-2xs">
          <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">100% Happiness Guarantee</h2>
            <p className="text-[11px] text-slate-500">Free re-print if you aren't thrilled</p>
          </div>
        </div>
      </div>

      {/* Uploaded Photos Section */}
      {activePhotos.length > 0 && (
        <div className="mt-10">
          {/* Header & Bulk Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>Configuring Uploaded Photos</span>
                <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  {totalPhotosCount} {totalPhotosCount === 1 ? 'print' : 'prints'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize dimensions, paper finish, and quantity for each picture.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Quick Batch:</span>
              <button
                type="button"
                onClick={() => applyFormatToAll('print_4x6', 'glossy')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              >
                All 4x6" Glossy ($0.29)
              </button>
              <button
                type="button"
                onClick={() => applyFormatToAll('print_5x7', 'matte')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              >
                All 5x7" Matte ($0.89)
              </button>
              <button
                type="button"
                onClick={clearActivePhotos}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Photo Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {activePhotos.map((photo, index) => {
              const currentProduct = getProduct(photo.format);
              const unitPrice = currentProduct ? currentProduct.price : 0.29;
              const photoSubtotal = unitPrice * photo.quantity;

              return (
                <div
                  key={photo.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Image Preview */}
                  <div className="relative aspect-4/3 w-full bg-slate-950 overflow-hidden group">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    <button
                      type="button"
                      onClick={() => setPreviewModalUrl(photo.url)}
                      className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                      title="Enlarge preview"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded-md">
                      #{index + 1} • {photo.name}
                    </div>
                  </div>

                  {/* Settings & Pricing */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      {/* Product / Size Select */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Print Format & Size
                        </label>
                        <select
                          value={photo.format}
                          onChange={(e) => {
                            const newProd = getProduct(e.target.value);
                            updatePhoto(photo.id, {
                              format: e.target.value,
                              finish: newProd?.finish || photo.finish,
                            });
                          }}
                          className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        >
                          {products.map((prod) => (
                            <option key={prod.id} value={prod.id}>
                              {prod.name} — ${prod.price.toFixed(2)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Finish Select */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Paper Finish
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(['glossy', 'matte', 'canvas'] as PrintFinish[]).map((finishOpt) => (
                            <button
                              key={finishOpt}
                              type="button"
                              onClick={() => updatePhoto(photo.id, { finish: finishOpt })}
                              className={`py-1.5 text-center text-xs font-medium rounded-lg border capitalize transition-all ${
                                photo.finish === finishOpt
                                  ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-semibold shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {finishOpt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quantity and Price Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500">Qty:</span>
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            type="button"
                            onClick={() =>
                              updatePhoto(photo.id, {
                                quantity: Math.max(1, photo.quantity - 1),
                              })
                            }
                            className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-bold text-slate-800">
                            {photo.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updatePhoto(photo.id, { quantity: photo.quantity + 1 })
                            }
                            className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">
                          ${unitPrice.toFixed(2)} each
                        </span>
                        <span className="text-sm font-bold font-mono text-slate-900">
                          ${photoSubtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout CTA Card */}
          <div className="mt-8 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 block mb-1">
                Order Ready for Checkout
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                {totalPhotosCount} Photos Configured • Total: ${subtotal.toFixed(2)}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Next: Provide delivery address, view destination on Google Map, and select guest or account.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage('checkout')}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              <span>Continue to Address & Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* High-res Image Preview Modal */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={previewModalUrl}
              alt="High resolution preview"
              className="max-h-[85vh] w-auto object-contain mx-auto"
            />
            <button
              type="button"
              onClick={() => setPreviewModalUrl(null)}
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

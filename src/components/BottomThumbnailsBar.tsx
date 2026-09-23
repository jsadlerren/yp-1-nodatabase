import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronUp,
  ChevronDown,
  Images,
  Trash2,
  Plus,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Layers,
} from 'lucide-react';

export const BottomThumbnailsBar: React.FC = () => {
  const {
    activePhotos,
    removePhoto,
    subtotal,
    totalPhotosCount,
    currentPage,
    setCurrentPage,
    getProduct,
    addSamplePhotos,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(true);

  // We show the bottom bar on all creation / checkout pages
  const shouldShow =
    currentPage === 'home' ||
    currentPage === 'checkout' ||
    currentPage === 'auth' ||
    currentPage === 'pay';

  if (!shouldShow) return null;

  const handleNextStep = () => {
    if (currentPage === 'home') {
      setCurrentPage('checkout');
    } else if (currentPage === 'checkout') {
      setCurrentPage('auth');
    } else if (currentPage === 'auth') {
      setCurrentPage('pay');
    }
  };

  const getStepButtonLabel = () => {
    switch (currentPage) {
      case 'home':
        return 'Proceed to Checkout';
      case 'checkout':
        return 'Continue (Guest / Account)';
      case 'auth':
        return 'Continue to Pay';
      case 'pay':
        return 'Scroll to Card & Buy Now';
      default:
        return 'Next Step';
    }
  };

  return (
    <aside
      aria-label="Order photo tray"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/80 text-white shadow-2xl transition-all duration-300"
    >
      {/* Upper header ribbon */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-700"
            title="Toggle thumbnails tray"
          >
            <Images className="w-4 h-4 text-indigo-400" />
            <span>
              Uploads Tray ({totalPhotosCount} {totalPhotosCount === 1 ? 'photo' : 'photos'})
            </span>
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {activePhotos.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Subtotal:{' '}
                <strong className="text-white font-mono text-sm font-bold">
                  ${subtotal.toFixed(2)}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Action Button for current step */}
        <div className="flex items-center gap-2">
          {activePhotos.length === 0 ? (
            <button
              type="button"
              onClick={addSamplePhotos}
              className="flex items-center gap-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Photos</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-950/30 hover:shadow-emerald-500/20 active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{getStepButtonLabel()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable thumbnails strip */}
      {isExpanded && (
        <div className="max-w-7xl mx-auto px-4 pb-3 pt-1 border-t border-slate-800/80">
          {activePhotos.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
              <Images className="w-7 h-7 text-slate-600 stroke-[1.5]" />
              <p>No photos selected yet for printing. Upload photos above or click below to test.</p>
              <button
                type="button"
                onClick={addSamplePhotos}
                className="text-indigo-400 hover:text-indigo-300 font-medium underline inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Quick Add 5 High-Res Sample Photos
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 overflow-x-auto py-1.5 scrollbar-thin scrollbar-thumb-slate-700">
              {activePhotos.map((photo, index) => {
                const prod = getProduct(photo.format);
                const formatLabel = prod ? prod.size : '4x6"';
                const finishLabel = photo.finish.toUpperCase();

                return (
                  <div
                    key={photo.id}
                    className="group relative flex-shrink-0 w-24 bg-slate-800 rounded-lg overflow-hidden border border-slate-700/80 shadow-md hover:border-indigo-400 transition-all"
                  >
                    {/* Image preview */}
                    <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {/* Quantity badge */}
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                        ×{photo.quantity}
                      </span>
                      {/* Index badge */}
                      <span className="absolute top-1 left-1 bg-slate-900/80 text-slate-300 text-[9px] px-1 rounded">
                        #{index + 1}
                      </span>
                      {/* Delete button on hover */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePhoto(photo.id);
                        }}
                        title="Remove photo"
                        className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Format metadata footer */}
                    <div className="p-1.5 text-[10px] bg-slate-850 flex flex-col gap-0.5">
                      <span className="font-semibold text-slate-200 truncate" title={photo.name}>
                        {formatLabel}
                      </span>
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider">
                        {finishLabel}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Add more button in tray */}
              <button
                type="button"
                onClick={() => setCurrentPage('home')}
                className="flex-shrink-0 w-24 h-[110px] border-2 border-dashed border-slate-700 hover:border-indigo-400 hover:bg-slate-800/60 rounded-lg flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-indigo-300 transition-all text-xs"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[10px] font-medium text-center">Add Photos</span>
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

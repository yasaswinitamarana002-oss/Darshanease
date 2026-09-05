import React from 'react';
import { X, Clock, AlertTriangle, ShieldCheck, Gift } from 'lucide-react';

export default function TempleModal({ temple, onClose, onBookDarshan }) {
  if (!temple) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Cover Image & Header */}
        <div className="relative h-48 sm:h-64 overflow-hidden rounded-t-2xl">
          <img src={temple.imageUrl} alt={temple.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="px-2.5 py-0.5 rounded-full bg-saffron-600 text-xs font-bold uppercase tracking-wide">
              {temple.deity}
            </span>
            <h3 className="text-2xl font-bold font-serif mt-1">{temple.name}</h3>
            <p className="text-xs text-stone-300">📍 {temple.city}, {temple.state}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-stone-700">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-saffron-700">About the Sacred Shrine</h4>
            <p className="text-sm mt-1 leading-relaxed text-stone-600">{temple.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
            <div>
              <span className="font-bold text-stone-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-saffron-600" /> Sanctum Timings:
              </span>
              <p className="text-stone-600 mt-0.5">{temple.timings}</p>
            </div>
            <div>
              <span className="font-bold text-stone-800">⏳ Current Queue Wait:</span>
              <p className="text-saffron-700 font-bold mt-0.5">
                ~{temple.waitTimeMins} minutes ({temple.crowdStatus} crowd)
              </p>
            </div>
            <div className="sm:col-span-2">
              <span className="font-bold text-stone-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Dress Code Protocol:
              </span>
              <p className="text-stone-600 mt-0.5">{temple.dressCode}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="font-bold text-stone-800 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Important Guidelines:
              </span>
              <p className="text-stone-600 mt-0.5">{temple.rules}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-saffron-700 mb-2">
              Available Poojas & Sevas
            </h4>
            <div className="space-y-2">
              {temple.poojas?.map((p) => (
                <div
                  key={p._id || p.name}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center text-xs"
                >
                  <div>
                    <span className="font-bold text-stone-800 text-sm">{p.name}</span>
                    <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded bg-saffron-100 text-saffron-800 uppercase">
                      {p.category}
                    </span>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      {p.description} • <span className="text-saffron-800 font-medium">🎁 {p.prasadamIncluded}</span>
                    </p>
                  </div>
                  <div className="text-right pl-3">
                    <span className="text-sm font-extrabold text-saffron-700">
                      {p.price === 0 ? 'FREE' : `₹${p.price.toFixed(0)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookDarshan(temple._id);
              }}
              className="px-5 py-2 text-sm font-bold text-white bg-saffron-600 hover:bg-saffron-700 rounded-lg shadow-md transition"
            >
              Book Darshan Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

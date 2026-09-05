import React from 'react';
import { Star, MapPin, Clock } from 'lucide-react';

export default function TempleCard({ temple, onViewDetails, onBookSlot }) {
  const badgeColor =
    temple.crowdStatus === 'Low'
      ? 'bg-emerald-100 text-emerald-800'
      : temple.crowdStatus === 'Moderate'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-rose-100 text-rose-800';

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={temple.imageUrl}
          alt={temple.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <span className={`absolute top-3 right-3 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${badgeColor} shadow-sm`}>
          {temple.crowdStatus} Crowd (~{temple.waitTimeMins}m)
        </span>
        <div className="absolute bottom-2 left-3 text-white text-xs font-semibold bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>{temple.rating?.toFixed(1) || '4.9'}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <span className="text-[11px] font-extrabold text-saffron-700 uppercase tracking-wider">
          {temple.deity}
        </span>
        <h3 className="text-base font-bold text-stone-900 mt-0.5 line-clamp-1 font-serif">
          {temple.name}
        </h3>
        <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-stone-400" />
          <span>{temple.city}, {temple.state}</span>
        </p>
        <p className="text-xs text-stone-600 mt-2.5 line-clamp-2 leading-relaxed">
          {temple.description}
        </p>

        <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={() => onViewDetails(temple)}
            className="px-3 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition text-center"
          >
            Guidelines
          </button>
          <button
            onClick={() => onBookSlot(temple._id)}
            className="px-3 py-2 text-xs font-bold text-white bg-saffron-600 hover:bg-saffron-700 rounded-lg shadow-sm transition text-center"
          >
            Book Slot
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Activity } from 'lucide-react';

export default function LiveCrowdTracker({ crowdUpdates }) {
  return (
    <section id="crowd-tracker" className="py-16 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-saffron-600">
              Live Sanctum Queue Status
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 font-serif mt-1">
              Real-Time Temple Crowd & Wait-Time Tracker
            </h2>
            <p className="text-stone-600 mt-2">
              Check live queue lengths and estimated waiting times before you report to the entrance turnstiles.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs font-semibold text-stone-500">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Live Radar Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {crowdUpdates.map((c) => {
            const color =
              c.crowdStatus === 'Low'
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : c.crowdStatus === 'Moderate'
                ? 'text-amber-700 bg-amber-50 border-amber-200'
                : 'text-rose-700 bg-rose-50 border-rose-200';

            return (
              <div key={c._id} className={`p-4 rounded-xl border ${color} shadow-sm flex flex-col justify-between`}>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">{c.city}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/80">
                      {c.crowdStatus}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 line-clamp-1">{c.name}</h4>
                  <p className="text-xs text-stone-500 mt-1">Timings: {c.timings}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-black/10 flex justify-between items-center">
                  <span className="text-xs font-medium">Estimated Wait:</span>
                  <span className="text-base font-extrabold">~{c.waitTimeMins} mins</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

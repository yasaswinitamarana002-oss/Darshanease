import React, { useState } from 'react';
import { Bus, Train, Plane, Clock, ArrowRight } from 'lucide-react';

export default function TransportSection({ routes, onBookTransport }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredRoutes = activeCategory === 'all'
    ? routes
    : routes.filter((r) => r.mode === activeCategory);

  return (
    <section id="transport-section" className="py-16 bg-stone-100 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-saffron-600">
            Pilgrimage Travel Logistics
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 font-serif mt-1">
            Multi-Modal Travel to Sacred Shrines
          </h2>
          <p className="text-stone-600 mt-2">
            Book connecting buses, express trains (Vande Bharat), and flights synchronized with your darshan time slot.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white p-1 rounded-xl shadow-sm border border-stone-300">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition ${
                activeCategory === 'all' ? 'bg-saffron-600 text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Transport
            </button>
            <button
              onClick={() => setActiveCategory('bus')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5 ${
                activeCategory === 'bus' ? 'bg-saffron-600 text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bus className="w-4 h-4" />
              <span>Buses</span>
            </button>
            <button
              onClick={() => setActiveCategory('train')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5 ${
                activeCategory === 'train' ? 'bg-saffron-600 text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Train className="w-4 h-4" />
              <span>Trains</span>
            </button>
            <button
              onClick={() => setActiveCategory('flight')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5 ${
                activeCategory === 'flight' ? 'bg-saffron-600 text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>Flights</span>
            </button>
          </div>
        </div>

        {/* Routes Grid */}
        <div className="space-y-4 max-w-5xl mx-auto">
          {filteredRoutes.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center border border-stone-200 text-stone-500">
              <p className="font-bold text-sm">No transport routes available for this category.</p>
            </div>
          ) : (
            filteredRoutes.map((r) => {
              const modeTagColor =
                r.mode === 'bus'
                  ? 'bg-amber-100 text-amber-800'
                  : r.mode === 'train'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800';

              const availableSeats = r.availableSeats ?? (r.totalSeats - r.bookedSeats);

              return (
                <div
                  key={r._id}
                  className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-xl shrink-0">
                      {r.mode === 'bus' && <Bus className="w-6 h-6 text-amber-600" />}
                      {r.mode === 'train' && <Train className="w-6 h-6 text-blue-600" />}
                      {r.mode === 'flight' && <Plane className="w-6 h-6 text-purple-600" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded ${modeTagColor}`}>
                          {r.mode}
                        </span>
                        <span className="text-xs text-stone-400 font-mono font-semibold">{r.serviceNumber}</span>
                      </div>
                      <h4 className="text-base font-bold text-stone-900 mt-0.5">{r.operatorName}</h4>
                      <p className="text-xs text-stone-500">{r.classType}</p>
                    </div>
                  </div>

                  {/* Matrix */}
                  <div className="flex items-center justify-between md:justify-center space-x-6 text-center border-y md:border-y-0 md:border-x border-stone-100 py-3 md:py-0 md:px-8">
                    <div>
                      <span className="text-base font-extrabold text-stone-900">{r.departureTime}</span>
                      <p className="text-[11px] text-stone-500">{r.sourceCity}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-stone-400 font-medium">{r.duration}</span>
                      <div className="w-16 h-0.5 bg-stone-300 my-1 relative">
                        <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-stone-400"></span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold">Direct Route</span>
                    </div>
                    <div>
                      <span className="text-base font-extrabold text-stone-900">{r.arrivalTime}</span>
                      <p className="text-[11px] text-stone-500">{r.destinationCity}</p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                    <div className="text-left md:text-right">
                      <span className="text-xl font-extrabold text-saffron-700">₹{r.price.toFixed(0)}</span>
                      <p className="text-[10px] text-stone-500">{availableSeats} seats left</p>
                    </div>
                    <button
                      onClick={() => onBookTransport(r)}
                      className="px-5 py-2 text-xs font-bold text-white bg-saffron-600 hover:bg-saffron-700 rounded-xl shadow-sm transition"
                    >
                      Book Seat
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

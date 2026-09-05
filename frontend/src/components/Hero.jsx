import React, { useState } from 'react';
import { Search, Landmark, Bus, Train, Plane, Calendar, MapPin } from 'lucide-react';

export default function Hero({ temples, onStartDarshanBooking, onSearchTransport }) {
  const [activeTab, setActiveTab] = useState('darshan');
  const [selectedTempleId, setSelectedTempleId] = useState('');
  const [darshanDate, setDarshanDate] = useState(new Date().toISOString().split('T')[0]);

  // Transport search state
  const [transMode, setTransMode] = useState('all');
  const [transSource, setTransSource] = useState('');
  const [transDest, setTransDest] = useState('');

  const handleDarshanSubmit = (e) => {
    e.preventDefault();
    if (!selectedTempleId && temples.length > 0) {
      onStartDarshanBooking(temples[0]._id, darshanDate);
    } else {
      onStartDarshanBooking(selectedTempleId, darshanDate);
    }
  };

  const handleTransportSubmit = (e) => {
    e.preventDefault();
    onSearchTransport({ mode: transMode, source: transSource, destination: transDest });
    const section = document.getElementById('transport-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-b from-saffron-50/60 via-amber-50/30 to-stone-50 py-14 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-saffron-100 text-saffron-800 font-semibold text-xs tracking-wide uppercase mb-4 border border-saffron-200 shadow-sm">
            <span>✨ Complete MERN Pilgrimage Booking Suite</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight font-serif">
            Divine Darshan & <span className="bg-gradient-to-r from-saffron-600 to-sacredmaroon-800 bg-clip-text text-transparent">Seamless Travel</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
            Reserve confirmed temple darshan slots & poojas across sacred shrines in India. Book connecting <strong>buses, express trains, and flights</strong> effortlessly.
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-stone-200/80 border border-stone-200 overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex border-b border-stone-200 bg-stone-50/80">
            <button
              onClick={() => setActiveTab('darshan')}
              className={`flex-1 py-4 text-center font-bold text-sm sm:text-base border-b-2 flex items-center justify-center space-x-2 transition ${
                activeTab === 'darshan'
                  ? 'border-saffron-600 text-saffron-700 bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Landmark className="w-5 h-5 text-saffron-600" />
              <span>Reserve Temple Darshan & Pooja</span>
            </button>
            <button
              onClick={() => setActiveTab('transport')}
              className={`flex-1 py-4 text-center font-bold text-sm sm:text-base border-b-2 flex items-center justify-center space-x-2 transition ${
                activeTab === 'transport'
                  ? 'border-saffron-600 text-saffron-700 bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Bus className="w-5 h-5 text-saffron-600" />
              <span>Book Pilgrimage Travel (Bus / Train / Flight)</span>
            </button>
          </div>

          {/* Darshan Tab Form */}
          {activeTab === 'darshan' && (
            <form onSubmit={handleDarshanSubmit} className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Landmark className="w-3.5 h-3.5 text-saffron-600" />
                    <span>Select Sacred Temple</span>
                  </label>
                  <select
                    value={selectedTempleId}
                    onChange={(e) => setSelectedTempleId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-3 text-sm font-medium text-stone-800 focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                  >
                    <option value="">-- Choose Sacred Temple --</option>
                    {temples.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.city})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-saffron-600" />
                    <span>Pilgrimage Date</span>
                  </label>
                  <input
                    type="date"
                    value={darshanDate}
                    onChange={(e) => setDarshanDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-3 text-sm font-medium text-stone-800 focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-gradient-to-r from-saffron-600 to-saffron-700 hover:from-saffron-700 hover:to-saffron-800 text-white font-bold rounded-xl shadow-md shadow-saffron-600/30 transition transform active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Check Available Slots</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Transport Tab Form */}
          {activeTab === 'transport' && (
            <form onSubmit={handleTransportSubmit} className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Transport Mode</label>
                  <select
                    value={transMode}
                    onChange={(e) => setTransMode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-3 text-sm font-medium text-stone-800 focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                  >
                    <option value="all">All Modes</option>
                    <option value="bus">Buses (Volvo/RTC)</option>
                    <option value="train">Trains (Vande Bharat/Express)</option>
                    <option value="flight">Flights (Air India/IndiGo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Origin City</label>
                  <input
                    type="text"
                    value={transSource}
                    onChange={(e) => setTransSource(e.target.value)}
                    placeholder="e.g. Chennai, Delhi, Bangalore"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-3 text-sm font-medium text-stone-800 focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Pilgrim Destination</label>
                  <input
                    type="text"
                    value={transDest}
                    onChange={(e) => setTransDest(e.target.value)}
                    placeholder="e.g. Tirupati, Shirdi, Varanasi"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-3 text-sm font-medium text-stone-800 focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-gradient-to-r from-sacredmaroon-800 to-saffron-700 hover:from-sacredmaroon-900 hover:to-saffron-800 text-white font-bold rounded-xl shadow-md shadow-sacredmaroon-900/30 transition transform active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Travel Routes</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Feature Badges */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
          <div className="p-3 bg-white/70 backdrop-blur rounded-xl border border-stone-200 shadow-sm">
            <p className="text-xs font-bold text-stone-500 uppercase">Verified Sansthan Slots</p>
            <p className="text-sm font-extrabold text-saffron-700">100% Guaranteed Passes</p>
          </div>
          <div className="p-3 bg-white/70 backdrop-blur rounded-xl border border-stone-200 shadow-sm">
            <p className="text-xs font-bold text-stone-500 uppercase">Multi-Modal Logistics</p>
            <p className="text-sm font-extrabold text-saffron-700">Bus, Train & Flights</p>
          </div>
          <div className="p-3 bg-white/70 backdrop-blur rounded-xl border border-stone-200 shadow-sm">
            <p className="text-xs font-bold text-stone-500 uppercase">Instant Digital Pass</p>
            <p className="text-sm font-extrabold text-saffron-700">QR Code Gate Entry</p>
          </div>
          <div className="p-3 bg-white/70 backdrop-blur rounded-xl border border-stone-200 shadow-sm">
            <p className="text-xs font-bold text-stone-500 uppercase">Devotee Support</p>
            <p className="text-sm font-extrabold text-saffron-700">24/7 Yatra Assistance</p>
          </div>
        </div>
      </div>
    </section>
  );
}

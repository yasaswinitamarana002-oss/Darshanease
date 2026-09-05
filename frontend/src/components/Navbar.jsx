import React from 'react';
import { Landmark, Ticket, PlusCircle } from 'lucide-react';

export default function Navbar({ onOpenMyBookings, onStartDarshanBooking, crowdTicker }) {
  return (
    <>
      {/* Top Ticker */}
      <div className="bg-gradient-to-r from-sacredmaroon-900 via-saffron-800 to-sacredmaroon-900 text-white text-xs sm:text-sm py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-amber-200">LIVE CROWD RADAR:</span>
            <span className="text-stone-200 truncate max-w-xl">{crowdTicker || 'Monitoring Sanctum Queues...'}</span>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span>Toll-Free: <strong>1800-DARSHAN</strong></span>
            <button onClick={onOpenMyBookings} className="underline hover:text-amber-300 font-semibold transition">
              Track Booking
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-500 to-sacredmaroon-800 flex items-center justify-center shadow-md shadow-saffron-500/20 text-white">
              <Landmark className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-saffron-700 via-saffron-600 to-sacredmaroon-800 bg-clip-text text-transparent">
                DarshanEase
              </span>
              <p className="text-[11px] font-semibold text-stone-500 tracking-wider uppercase">
                MERN Spiritual Darshan & Travel Portal
              </p>
            </div>
          </a>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-700">
            <a href="#temples" className="hover:text-saffron-600 transition">Sacred Temples</a>
            <a href="#transport-section" className="hover:text-saffron-600 transition">Buses • Trains • Flights</a>
            <a href="#guidelines" className="hover:text-saffron-600 transition">Devotee Guidelines</a>
            <a href="#crowd-tracker" className="hover:text-saffron-600 transition">Live Queue Tracker</a>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenMyBookings}
              className="px-4 py-2 text-sm font-semibold text-stone-700 hover:text-saffron-700 border border-stone-300 rounded-lg hover:border-saffron-400 hover:bg-saffron-50 transition flex items-center space-x-1.5 shadow-sm"
            >
              <Ticket className="w-4 h-4" />
              <span>My Bookings</span>
            </button>
            <button
              onClick={() => onStartDarshanBooking()}
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-saffron-600 to-saffron-700 hover:from-saffron-700 hover:to-saffron-800 rounded-lg shadow-md shadow-saffron-600/30 transition transform active:scale-95 flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book Darshan</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

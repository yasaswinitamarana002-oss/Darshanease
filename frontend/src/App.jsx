import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TempleCard from './components/TempleCard';
import TempleModal from './components/TempleModal';
import DarshanBookingModal from './components/DarshanBookingModal';
import TransportSection from './components/TransportSection';
import TransportBookingModal from './components/TransportBookingModal';
import DigitalPassModal from './components/DigitalPassModal';
import MyBookingsModal from './components/MyBookingsModal';
import LiveCrowdTracker from './components/LiveCrowdTracker';
import Guidelines from './components/Guidelines';
import Footer from './components/Footer';
import { api } from './services/api';

export default function App() {
  const [temples, setTemples] = useState([]);
  const [selectedState, setSelectedState] = useState('All');
  const [transportRoutes, setTransportRoutes] = useState([]);
  const [crowdUpdates, setCrowdUpdates] = useState([]);
  const [crowdTicker, setCrowdTicker] = useState('');

  // Modals state
  const [selectedTempleForModal, setSelectedTempleForModal] = useState(null);
  const [isDarshanModalOpen, setIsDarshanModalOpen] = useState(false);
  const [darshanModalTempleId, setDarshanModalTempleId] = useState('');
  const [darshanModalDate, setDarshanModalDate] = useState('');

  const [selectedRouteForBooking, setSelectedRouteForBooking] = useState(null);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [activeDigitalPassId, setActiveDigitalPassId] = useState(null);

  // Toast
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    loadTemples();
    loadTransport();
    loadCrowd();
  }, []);

  const loadTemples = async (search = '', state = 'All') => {
    try {
      const data = await api.getTemples(search, state);
      if (data.success) {
        setTemples(data.temples || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadTransport = async (filters = {}) => {
    try {
      const data = await api.searchTransport(filters);
      if (data.success) {
        setTransportRoutes(data.results || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadCrowd = async () => {
    try {
      const data = await api.getCrowdStatus();
      if (data.success) {
        setCrowdUpdates(data.crowdUpdates || []);
        const ticker = data.crowdUpdates
          .slice(0, 4)
          .map((c) => `${c.name.split('(')[0].trim()}: ${c.waitTimeMins}m wait (${c.crowdStatus})`)
          .join(' • ');
        setCrowdTicker(ticker);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterState = (state) => {
    setSelectedState(state);
    loadTemples('', state);
  };

  const handleStartDarshanBooking = (templeId = '', date = '') => {
    setDarshanModalTempleId(templeId);
    setDarshanModalDate(date);
    setIsDarshanModalOpen(true);
  };

  const handleBookingSuccess = (bookingId) => {
    setIsDarshanModalOpen(false);
    setSelectedRouteForBooking(null);
    setActiveDigitalPassId(bookingId);
  };

  const statesList = [
    'All',
    'Andhra Pradesh',
    'Maharashtra',
    'Uttar Pradesh',
    'Uttarakhand',
    'Tamil Nadu',
    'Odisha',
    'Gujarat'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800">
      {/* Navigation */}
      <Navbar
        crowdTicker={crowdTicker}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onStartDarshanBooking={handleStartDarshanBooking}
      />

      {/* Hero with Unified Search */}
      <Hero
        temples={temples}
        onStartDarshanBooking={handleStartDarshanBooking}
        onSearchTransport={loadTransport}
      />

      {/* Temples Catalog Section */}
      <section id="temples" className="py-16 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-saffron-600">
                Devotional Shrines
              </span>
              <h2 className="text-3xl font-extrabold text-stone-900 font-serif mt-1">
                Reserve Your Darshan at Sacred Temples
              </h2>
              <p className="text-stone-600 mt-2">
                Explore available slots, traditional seva rituals, and Sanctum Sanctorum guidelines.
              </p>
            </div>

            {/* State Filter Pills */}
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              {statesList.map((st) => (
                <button
                  key={st}
                  onClick={() => handleFilterState(st)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition ${
                    selectedState === st
                      ? 'bg-saffron-600 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {st === 'All' ? 'All Temples' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {temples.map((t) => (
              <TempleCard
                key={t._id}
                temple={t}
                onViewDetails={(temp) => setSelectedTempleForModal(temp)}
                onBookSlot={(tid) => handleStartDarshanBooking(tid)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Modal Transport Section */}
      <TransportSection
        routes={transportRoutes}
        onBookTransport={(route) => setSelectedRouteForBooking(route)}
      />

      {/* Live Crowd Tracker */}
      <LiveCrowdTracker crowdUpdates={crowdUpdates} />

      {/* Devotee Guidelines */}
      <Guidelines />

      {/* Footer */}
      <Footer onOpenMyBookings={() => setIsMyBookingsOpen(true)} />

      {/* ================= MODALS ================= */}

      {/* Temple Details Modal */}
      {selectedTempleForModal && (
        <TempleModal
          temple={selectedTempleForModal}
          onClose={() => setSelectedTempleForModal(null)}
          onBookDarshan={(tid) => handleStartDarshanBooking(tid)}
        />
      )}

      {/* Darshan Booking Stepper Modal */}
      <DarshanBookingModal
        isOpen={isDarshanModalOpen}
        initialTempleId={darshanModalTempleId}
        initialDate={darshanModalDate}
        temples={temples}
        onClose={() => setIsDarshanModalOpen(false)}
        onBookingSuccess={handleBookingSuccess}
        showToast={showToast}
      />

      {/* Transport Booking Modal */}
      {selectedRouteForBooking && (
        <TransportBookingModal
          route={selectedRouteForBooking}
          onClose={() => setSelectedRouteForBooking(null)}
          onBookingSuccess={handleBookingSuccess}
          showToast={showToast}
        />
      )}

      {/* Digital E-Pass Modal */}
      {activeDigitalPassId && (
        <DigitalPassModal
          bookingId={activeDigitalPassId}
          onClose={() => setActiveDigitalPassId(null)}
        />
      )}

      {/* My Bookings Lookup Modal */}
      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        onSelectBooking={(id) => setActiveDigitalPassId(id)}
        showToast={showToast}
      />

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 pointer-events-none">
        {toasts.map((toast) => {
          const bg =
            toast.type === 'success'
              ? 'bg-emerald-800 text-white'
              : toast.type === 'warning'
              ? 'bg-amber-700 text-white'
              : toast.type === 'error'
              ? 'bg-rose-800 text-white'
              : 'bg-stone-800 text-white';

          return (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 text-xs font-semibold ${bg} max-w-sm pointer-events-auto transition-all`}
            >
              <span>{toast.type === 'success' ? '✓' : toast.type === 'warning' ? '⚠️' : toast.type === 'error' ? '✕' : 'ℹ️'}</span>
              <span>{toast.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Search, Ticket } from 'lucide-react';
import { api } from '../services/api';

export default function MyBookingsModal({ isOpen, onClose, onSelectBooking, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      showToast('Please enter an email, phone number, or booking reference.', 'warning');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const data = await api.getMyBookings(searchQuery.trim());
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        setBookings([]);
        showToast(data.message || 'No bookings found.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Error searching bookings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${bookingId}?`)) return;

    try {
      const data = await api.cancelBooking(bookingId);
      if (data.success) {
        showToast('Booking cancelled and quota restored.', 'success');
        // Refresh
        const refresh = await api.getMyBookings(searchQuery.trim());
        if (refresh.success) setBookings(refresh.bookings || []);
      } else {
        showToast(data.message || 'Could not cancel booking.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error cancelling booking.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <div>
            <h3 className="text-xl font-bold font-serif text-stone-900">My Pilgrimage Bookings</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Retrieve your confirmed Darshan passes & travel boarding tickets
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter Email, Mobile, or Booking Reference (e.g. DE-DAR-12345)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-saffron-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-sm rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </form>

          <div className="space-y-3 pt-2">
            {!hasSearched ? (
              <div className="text-center py-8 text-stone-400 text-sm">
                Enter your contact email, mobile, or reference ID above to find your passes.
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-xs">
                No active or past bookings found for <strong>"{searchQuery}"</strong>.
              </div>
            ) : (
              bookings.map((b) => {
                const isDarshan = b.bookingType === 'darshan';
                const title = isDarshan
                  ? b.temple?.name
                  : `${b.transport?.operatorName} (${b.transport?.mode?.toUpperCase()})`;

                const sub = isDarshan
                  ? `${b.pooja?.name || 'Darshan'} • ${b.slot?.slotDate} (${b.slot?.timeSlot})`
                  : `${b.transport?.sourceCity} ➔ ${b.transport?.destinationCity}`;

                const statusClass =
                  b.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-200 text-stone-700';

                return (
                  <div
                    key={b.bookingId}
                    className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-saffron-700">{b.bookingId}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${statusClass}`}>
                          {b.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 mt-1">{title}</h4>
                      <p className="text-xs text-stone-500">{sub}</p>
                      <p className="text-[11px] text-stone-400 mt-1">
                        Booked: {new Date(b.createdAt).toLocaleDateString()} • Total: ₹{b.totalAmount.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectBooking(b.bookingId);
                        }}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-saffron-600 hover:bg-saffron-700 rounded-lg shadow-sm transition flex items-center gap-1"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>View Pass</span>
                      </button>
                      {b.status === 'Confirmed' && (
                        <button
                          onClick={() => handleCancel(b.bookingId)}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition border border-rose-200"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

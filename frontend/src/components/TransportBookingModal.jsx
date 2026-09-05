import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';

export default function TransportBookingModal({
  route,
  onClose,
  onBookingSuccess,
  showToast
}) {
  if (!route) return null;

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [passengers, setPassengers] = useState([
    { fullName: '', age: 30, gender: 'Male', seatNumber: 'Seat 1' }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddPassenger = () => {
    setPassengers([
      ...passengers,
      { fullName: '', age: 30, gender: 'Male', seatNumber: `Seat ${passengers.length + 1}` }
    ]);
  };

  const handleRemovePassenger = (idx) => {
    if (passengers.length <= 1) return;
    setPassengers(passengers.filter((_, i) => i !== idx));
  };

  const handlePassengerChange = (idx, field, value) => {
    const updated = [...passengers];
    updated[idx][field] = value;
    setPassengers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      showToast('Please provide contact information.', 'warning');
      return;
    }

    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].fullName.trim()) {
        showToast(`Please enter passenger #${i + 1} name.`, 'warning');
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        transportId: route._id,
        contactName,
        contactEmail,
        contactPhone,
        passengers
      };

      const res = await api.createTransportBooking(payload);
      if (res.success) {
        showToast('Transportation Booked Successfully!', 'success');
        onBookingSuccess(res.bookingId);
      } else {
        showToast(res.message || 'Booking failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error reserving transport.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const totalFare = route.price * passengers.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        <div className="p-6 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
          <div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-saffron-100 text-saffron-800 uppercase">
              {route.mode}
            </span>
            <h3 className="text-xl font-bold text-stone-900 mt-1">
              {route.operatorName} ({route.serviceNumber})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-stone-500">Route:</span>
              <span className="font-bold text-stone-800">{route.sourceCity} ➔ {route.destinationCity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Schedule:</span>
              <span className="font-bold text-stone-800">{route.departureTime} - {route.arrivalTime} ({route.duration})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Class:</span>
              <span className="font-bold text-stone-800">{route.classType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Fare per seat:</span>
              <span className="font-extrabold text-saffron-700 text-sm">₹{route.price.toFixed(0)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide">Contact Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                placeholder="Full Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="border border-stone-300 rounded-lg p-2 font-medium"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="border border-stone-300 rounded-lg p-2 font-medium"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="border border-stone-300 rounded-lg p-2 font-medium"
              />
            </div>

            <div className="border-t border-stone-200 pt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">Passengers List</span>
                <button
                  type="button"
                  onClick={handleAddPassenger}
                  className="text-xs font-bold text-saffron-700 bg-saffron-50 hover:bg-saffron-100 px-3 py-1 rounded transition"
                >
                  + Add Passenger
                </button>
              </div>

              <div className="space-y-2">
                {passengers.map((p, index) => (
                  <div key={index} className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Passenger Name"
                      value={p.fullName}
                      onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value)}
                      className="sm:col-span-2 border border-stone-300 rounded p-1.5 font-medium bg-white"
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      min="1"
                      max="120"
                      value={p.age}
                      onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value) || 0)}
                      className="border border-stone-300 rounded p-1.5 font-medium bg-white"
                    />
                    <div className="flex items-center space-x-1">
                      <select
                        value={p.gender}
                        onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                        className="border border-stone-300 rounded p-1.5 font-medium bg-white w-full"
                      >
                        <option value="Male">M</option>
                        <option value="Female">F</option>
                      </select>
                      {passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePassenger(index)}
                          className="text-rose-600 font-bold px-1.5"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
            <div>
              <span className="text-xs text-stone-500">Total Travel Fare:</span>
              <p className="text-lg font-extrabold text-stone-900">₹{totalFare.toFixed(2)}</p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-bold text-white bg-saffron-600 hover:bg-saffron-700 rounded-xl shadow-md transition disabled:opacity-50"
            >
              {submitting ? 'Confirming...' : 'Confirm & Book Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

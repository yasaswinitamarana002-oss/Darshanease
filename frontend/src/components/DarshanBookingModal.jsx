import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

export default function DarshanBookingModal({
  isOpen,
  initialTempleId,
  initialDate,
  temples,
  onClose,
  onBookingSuccess,
  showToast
}) {
  const [step, setStep] = useState(1);
  const [templeId, setTempleId] = useState(initialTempleId || '');
  const [selectedTemple, setSelectedTemple] = useState(null);
  const [selectedPooja, setSelectedPooja] = useState(null);
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Contact & Devotees
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [devotees, setDevotees] = useState([
    { fullName: '', age: 35, gender: 'Male', idType: 'Aadhaar Card', idNumber: '' }
  ]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const tid = initialTempleId || (temples[0] ? temples[0]._id : '');
      setTempleId(tid);
      setStep(1);
    }
  }, [isOpen, initialTempleId, temples]);

  useEffect(() => {
    if (templeId) {
      const found = temples.find((t) => t._id === templeId);
      setSelectedTemple(found || null);
      if (found && found.poojas?.length > 0) {
        setSelectedPooja(found.poojas[0]);
      }
    }
  }, [templeId, temples]);

  useEffect(() => {
    if (step === 2 && templeId && selectedDate) {
      loadSlots(templeId, selectedDate);
    }
  }, [step, templeId, selectedDate]);

  const loadSlots = async (tid, date) => {
    setLoadingSlots(true);
    try {
      const data = await api.getTempleSlots(tid, date);
      if (data.success) {
        setSlots(data.slots || []);
        if (data.slots?.length > 0) {
          setSelectedSlot(data.slots[0]);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading slot quotas.', 'error');
    } finally {
      setLoadingSlots(false);
    }
  };

  if (!isOpen) return null;

  const handleAddDevotee = () => {
    setDevotees([
      ...devotees,
      { fullName: '', age: 30, gender: 'Male', idType: 'Aadhaar Card', idNumber: '' }
    ]);
  };

  const handleRemoveDevotee = (idx) => {
    if (devotees.length <= 1) return;
    setDevotees(devotees.filter((_, i) => i !== idx));
  };

  const handleDevoteeChange = (idx, field, value) => {
    const updated = [...devotees];
    updated[idx][field] = value;
    setDevotees(updated);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!selectedPooja) {
        showToast('Please select a Pooja or Darshan type.', 'warning');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedSlot) {
        showToast('Please select an available time slot.', 'warning');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
        showToast('Please fill complete primary contact information.', 'warning');
        return;
      }
      for (let i = 0; i < devotees.length; i++) {
        if (!devotees[i].fullName.trim() || !devotees[i].idNumber.trim()) {
          showToast(`Please enter name and ID for Devotee #${i + 1}`, 'warning');
          return;
        }
      }
      setStep(4);
    } else if (step === 4) {
      handleSubmitBooking();
    }
  };

  const handleSubmitBooking = async () => {
    setSubmitting(true);
    try {
      const payload = {
        templeId,
        poojaId: selectedPooja._id,
        slotId: selectedSlot._id,
        contactName,
        contactEmail,
        contactPhone,
        devotees
      };

      const res = await api.createDarshanBooking(payload);
      if (res.success) {
        showToast('Darshan Slot Confirmed! Your E-Pass is ready.', 'success');
        onBookingSuccess(res.bookingId);
      } else {
        showToast(res.message || 'Booking failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error reserving darshan slot.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = (selectedPooja ? selectedPooja.price : 0) * devotees.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-gradient-to-r from-saffron-50 to-amber-50 flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-saffron-700 uppercase tracking-wide">
              Official Sansthan Slot Reservation
            </span>
            <h3 className="text-xl font-bold font-serif text-stone-900">
              {selectedTemple ? selectedTemple.name : 'Reserve Temple Darshan'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Indicators */}
        <div className="px-6 py-3 bg-stone-100 border-b border-stone-200 flex items-center justify-between text-xs font-bold text-stone-500">
          <span className={`flex items-center space-x-1 ${step >= 1 ? 'text-saffron-700 font-extrabold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-saffron-600 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Temple & Pooja</span>
          </span>
          <span>➔</span>
          <span className={`flex items-center space-x-1 ${step >= 2 ? 'text-saffron-700 font-extrabold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-saffron-600 text-white' : 'bg-stone-300 text-stone-700'}`}>2</span>
            <span>Date & Slot</span>
          </span>
          <span>➔</span>
          <span className={`flex items-center space-x-1 ${step >= 3 ? 'text-saffron-700 font-extrabold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-saffron-600 text-white' : 'bg-stone-300 text-stone-700'}`}>3</span>
            <span>Devotees Roster</span>
          </span>
          <span>➔</span>
          <span className={`flex items-center space-x-1 ${step >= 4 ? 'text-saffron-700 font-extrabold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 4 ? 'bg-saffron-600 text-white' : 'bg-stone-300 text-stone-700'}`}>4</span>
            <span>Review & Pass</span>
          </span>
        </div>

        {/* Step Contents */}
        <div className="p-6 flex-1">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                  Select Temple
                </label>
                <select
                  value={templeId}
                  onChange={(e) => setTempleId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-800 focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                >
                  {temples.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.city}, {t.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                  Choose Darshan / Pooja / Seva Type
                </label>
                <div className="space-y-2.5">
                  {selectedTemple?.poojas?.map((p) => (
                    <label
                      key={p._id || p.name}
                      className={`block p-3.5 rounded-xl border cursor-pointer transition ${
                        selectedPooja?._id === p._id
                          ? 'border-saffron-600 bg-saffron-50/70 ring-2 ring-saffron-500/20'
                          : 'border-stone-200 bg-white hover:border-saffron-400'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name="poojaRadio"
                            checked={selectedPooja?._id === p._id}
                            onChange={() => setSelectedPooja(p)}
                            className="mt-1 text-saffron-600 focus:ring-saffron-500"
                          />
                          <div>
                            <span className="text-sm font-bold text-stone-900">{p.name}</span>
                            <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 uppercase">
                              {p.category}
                            </span>
                            <p className="text-xs text-stone-600 mt-1">{p.description}</p>
                            <p className="text-[11px] text-saffron-800 font-medium mt-1">
                              🎁 Prasadam: {p.prasadamIncluded}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-saffron-700">
                            {p.price === 0 ? 'FREE' : `₹${p.price.toFixed(0)}`}
                          </span>
                          <p className="text-[10px] text-stone-400">per devotee</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-saffron-600" />
                  <span>Select Darshan Date</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-800 focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-saffron-600" />
                  <span>Select Available Time Slot</span>
                </label>

                {loadingSlots ? (
                  <div className="py-8 text-center text-xs text-stone-500">Checking sanctum quota...</div>
                ) : slots.length === 0 ? (
                  <div className="py-8 text-center text-xs text-rose-500 font-bold">
                    No quotas found for this date. Please choose another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {slots.map((s) => {
                      const avail = s.availableSeats ?? (s.capacity - s.bookedCount);
                      const isSelected = selectedSlot?._id === s._id;
                      const badgeClass =
                        avail > 40
                          ? 'bg-emerald-100 text-emerald-800'
                          : avail > 10
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800';

                      return (
                        <div
                          key={s._id}
                          onClick={() => setSelectedSlot(s)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition ${
                            isSelected
                              ? 'border-saffron-600 bg-saffron-50 ring-2 ring-saffron-500/20'
                              : 'border-stone-200 bg-white hover:border-saffron-400'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-stone-900">{s.timeSlot}</span>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${badgeClass}`}>
                              {avail} Left
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-1">Total Capacity: {s.capacity} pilgrims</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Primary Contact */}
              <div className="bg-saffron-50 p-4 rounded-xl border border-saffron-200">
                <h4 className="text-xs font-bold text-saffron-800 uppercase tracking-wide mb-2">
                  Primary Contact (For E-Pass & SMS Delivery)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600">Full Name</label>
                    <input
                      type="text"
                      placeholder="Contact Name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-saffron-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-saffron-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600">Mobile Phone</label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-saffron-500"
                    />
                  </div>
                </div>
              </div>

              {/* Devotees List */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                    Devotees List (Must carry original ID proof)
                  </label>
                  <button
                    onClick={handleAddDevotee}
                    className="text-xs font-bold text-saffron-700 hover:text-saffron-800 bg-saffron-100 hover:bg-saffron-200 px-3 py-1 rounded-lg transition"
                  >
                    + Add Devotee
                  </button>
                </div>

                <div className="space-y-3">
                  {devotees.map((d, index) => (
                    <div key={index} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                          Devotee #{index + 1}
                        </span>
                        {devotees.length > 1 && (
                          <button
                            onClick={() => handleRemoveDevotee(index)}
                            className="text-[11px] text-rose-600 hover:text-rose-800 font-bold"
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Full Name (as on photo ID)"
                            value={d.fullName}
                            onChange={(e) => handleDevoteeChange(index, 'fullName', e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded-lg p-2 font-medium"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Age"
                            min="1"
                            max="120"
                            value={d.age}
                            onChange={(e) => handleDevoteeChange(index, 'age', parseInt(e.target.value) || 0)}
                            className="w-full bg-white border border-stone-300 rounded-lg p-2 font-medium"
                          />
                        </div>
                        <div>
                          <select
                            value={d.gender}
                            onChange={(e) => handleDevoteeChange(index, 'gender', e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded-lg p-2 font-medium"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <select
                            value={d.idType}
                            onChange={(e) => handleDevoteeChange(index, 'idType', e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded-lg p-2 font-medium"
                          >
                            <option value="Aadhaar Card">Aadhaar Card</option>
                            <option value="Passport">Passport</option>
                            <option value="Voter ID">Voter ID</option>
                            <option value="Driving License">Driving License</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Govt Photo ID Number"
                            value={d.idNumber}
                            onChange={(e) => handleDevoteeChange(index, 'idNumber', e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded-lg p-2 font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3 text-sm">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Temple:</span>
                  <span className="font-bold text-stone-800">{selectedTemple?.name}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Pooja / Seva:</span>
                  <span className="font-bold text-stone-800">
                    {selectedPooja?.name} ({selectedPooja?.price === 0 ? 'FREE' : `₹${selectedPooja?.price}`})
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Date & Slot:</span>
                  <span className="font-bold text-stone-800">
                    {selectedDate} | {selectedSlot?.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Total Devotees:</span>
                  <span className="font-bold text-stone-800">{devotees.length} Pilgrim(s)</span>
                </div>
                <div className="flex justify-between items-center pt-1 text-base font-extrabold text-saffron-700">
                  <span>Total Payable Amount:</span>
                  <span>{totalAmount === 0 ? 'FREE' : `₹${totalAmount.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant digital e-pass with gate QR verification will be generated immediately.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-stone-200 bg-stone-50 flex justify-between items-center">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-200 rounded-lg transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-saffron-600 hover:bg-saffron-700 rounded-lg shadow-md transition flex items-center gap-1 disabled:opacity-50"
            >
              <span>{submitting ? 'Processing...' : step === 4 ? 'Confirm & Generate E-Pass ✨' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

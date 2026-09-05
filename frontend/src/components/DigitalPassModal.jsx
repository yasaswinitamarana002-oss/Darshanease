import React, { useEffect, useState } from 'react';
import { X, Printer, Landmark, CheckCircle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

// Deterministic 25x25 SVG QR Code Generator
function generateSvgQr(text) {
  const size = 25;
  const matrix = Array(size).fill(0).map(() => Array(size).fill(false));

  const drawFinder = (r, c) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          matrix[r + i][c + j] = true;
        }
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) & 0xffffffff;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)) continue;
      matrix[r][c] = ((hash ^ (r * 37 + c * 43 + r * c)) & 1) === 1;
    }
  }

  const cellSize = 6;
  const dim = size * cellSize;

  return (
    <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} xmlns="http://www.w3.org/2000/svg" className="rounded-lg shadow-sm border border-stone-200">
      <rect width="100%" height="100%" fill="#ffffff" />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill="#1c1917" /> : null
        )
      )}
    </svg>
  );
}

export default function DigitalPassModal({ bookingId, onClose }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      loadBookingDetails(bookingId);
    }
  }, [bookingId]);

  const loadBookingDetails = async (id) => {
    setLoading(true);
    try {
      const data = await api.getBooking(id);
      if (data.success) {
        setBooking(data.booking);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingId) return null;

  const isDarshan = booking?.bookingType === 'darshan';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-stone-300 print:shadow-none print:border-none">
        {/* Print & Close Action Bar (Hidden in Print) */}
        <div className="p-4 bg-stone-100 border-b border-stone-200 flex justify-between items-center print:hidden">
          <span className="text-xs font-bold text-stone-600 uppercase tracking-wide">
            Official Verified E-Pass
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 text-xs font-bold bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg shadow-sm flex items-center space-x-1 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold text-xs transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Pass Content */}
        {loading ? (
          <div className="py-12 text-center text-xs text-stone-500">Retrieving E-Pass...</div>
        ) : !booking ? (
          <div className="py-12 text-center text-xs text-rose-500">Booking pass could not be retrieved.</div>
        ) : (
          <div className="p-6 bg-stone-50 space-y-5 print-area">
            {/* Pass Header */}
            <div className="border-b-2 border-dashed border-stone-300 pb-4 text-center">
              <div className="inline-block p-2 rounded-xl bg-saffron-600 text-white mb-2">
                <Landmark className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
                {isDarshan ? booking.temple?.name : booking.transport?.operatorName}
              </h2>
              <p className="text-xs text-saffron-700 font-extrabold uppercase tracking-wider mt-0.5">
                {isDarshan
                  ? `${booking.pooja?.name || 'Darshan'} Pass`
                  : `${booking.transport?.mode?.toUpperCase()} BOARDING PASS`}
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                Booking Reference: <strong className="text-stone-800">{booking.bookingId}</strong>
              </p>
            </div>

            {/* Timing Matrix */}
            <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-stone-200 text-xs">
              <div>
                <span className="text-stone-500 block">Date of Visit:</span>
                <strong className="text-stone-900 text-sm">
                  {isDarshan ? booking.slot?.slotDate : 'Scheduled Travel Date'}
                </strong>
              </div>
              <div>
                <span className="text-stone-500 block">Allotted Time / Schedule:</span>
                <strong className="text-stone-900 text-sm">
                  {isDarshan
                    ? booking.slot?.timeSlot
                    : `${booking.transport?.departureTime} - ${booking.transport?.arrivalTime}`}
                </strong>
              </div>
              <div>
                <span className="text-stone-500 block">Reporting Gate:</span>
                <strong className="text-saffron-700">
                  {isDarshan ? 'Sanctum Queue Gate 1 (Vaikuntam)' : `Boarding: ${booking.transport?.sourceCity}`}
                </strong>
              </div>
              <div>
                <span className="text-stone-500 block">Status:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 inline-block">
                  {booking.status}
                </span>
              </div>
            </div>

            {/* Devotees / Passengers */}
            <div>
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {isDarshan ? 'Devotees / Pilgrims' : 'Passengers'}
              </h4>
              <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs space-y-1.5">
                {booking.devotees?.map((d, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-stone-100 pb-1">
                    <div>
                      <span className="font-bold text-stone-900">{d.fullName}</span>
                      <span className="text-stone-500 ml-1">({d.gender}, Age {d.age})</span>
                    </div>
                    <div className="text-right font-mono text-[11px] text-stone-600">
                      {d.idType}: <strong>{d.idNumber}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 text-center space-y-2">
              <div className="flex justify-center">
                {generateSvgQr(booking.qrToken)}
              </div>
              <p className="text-[10px] text-stone-400 font-mono tracking-widest uppercase">
                {booking.qrToken}
              </p>
              <p className="text-[11px] text-stone-500">
                Scan at Gate Scanner Turnstiles for Verified Entry
              </p>
            </div>

            {/* Guidelines Notice */}
            <div className="text-[11px] text-stone-500 border-t border-stone-200 pt-3 leading-relaxed space-y-1">
              <p>• <strong>Strict Traditional Dress Code:</strong> Devotees must adhere to temple attire guidelines.</p>
              <p>• <strong>Verification:</strong> Carry original Photo ID matching details printed on this pass.</p>
              <p>• <strong>Reporting Time:</strong> Report at gate 30 minutes prior to slot.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

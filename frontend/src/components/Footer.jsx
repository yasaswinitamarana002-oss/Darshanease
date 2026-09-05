import React from 'react';
import { Landmark } from 'lucide-react';

export default function Footer({ onOpenMyBookings }) {
  return (
    <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-saffron-600 flex items-center justify-center text-white font-bold">
                <Landmark className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">DarshanEase</span>
            </div>
            <p className="text-stone-400 text-sm max-w-md leading-relaxed">
              MERN Stack Pilgrimage Portal transforming spiritual journeys across India with authorized slot reservations, transparent crowd management, and multi-modal travel logistics.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Popular Shrines</h4>
            <ul className="text-sm space-y-2 text-stone-400">
              <li><a href="#temples" className="hover:text-saffron-400 transition">Tirupati Balaji Darshan</a></li>
              <li><a href="#temples" className="hover:text-saffron-400 transition">Shirdi Sai Baba Samadhi</a></li>
              <li><a href="#temples" className="hover:text-saffron-400 transition">Kashi Vishwanath Corridor</a></li>
              <li><a href="#temples" className="hover:text-saffron-400 transition">Vaishno Devi Bhawan</a></li>
              <li><a href="#temples" className="hover:text-saffron-400 transition">Kedarnath Jyotirlinga</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Pilgrim Support</h4>
            <ul className="text-sm space-y-2 text-stone-400">
              <li>
                <button onClick={onOpenMyBookings} className="hover:text-saffron-400 transition">
                  Download E-Pass
                </button>
              </li>
              <li><a href="#guidelines" className="hover:text-saffron-400 transition">Dress Code Guidelines</a></li>
              <li><a href="#crowd-tracker" className="hover:text-saffron-400 transition">Live Queue Tracker</a></li>
              <li className="text-stone-400">Toll-Free: <strong>1800-DARSHAN</strong></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500">
          <p>&copy; 2026 DarshanEase (MERN). All Rights Reserved. Built for Devotees.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span>MongoDB</span>
            <span>Express.js</span>
            <span>React.js</span>
            <span>Node.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

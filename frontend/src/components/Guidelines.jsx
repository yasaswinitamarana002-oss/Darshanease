import React from 'react';
import { Shirt, IdCard, Ban } from 'lucide-react';

export default function Guidelines() {
  return (
    <section id="guidelines" className="py-16 bg-gradient-to-b from-amber-50/40 to-stone-100 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-saffron-600">
            Sanctum Sanctity & Etiquette
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 font-serif mt-1">
            Devotee Guidelines & Dress Code Protocol
          </h2>
          <p className="text-stone-600 mt-2">
            Please observe these traditional customs to ensure a serene, respectful spiritual experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-saffron-100 text-saffron-700 flex items-center justify-center font-bold text-xl mb-4">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Traditional Attire Rules</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              <strong>Men:</strong> Dhoti with Kurta, Pyjama Kurta, or traditional Veshti. Upper body shirts must be removed at specific sanctums.<br />
              <strong>Women:</strong> Sarees, Half-sarees, or Chudidar with Dupatta. Western outfits and shorts are strictly prohibited.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl mb-4">
              <IdCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Mandatory Identity Proof</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Original government-issued photo ID (Aadhaar Card, Passport, Voter ID, or Driving License) used during slot booking must be carried for physical verification at all temple entry queues.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl mb-4">
              <Ban className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Prohibited Belongings</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Mobile phones, cameras, smartwatches, leather belts/wallets, and footwear must be deposited in security lockers outside the temple complex prior to entering the queue line.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

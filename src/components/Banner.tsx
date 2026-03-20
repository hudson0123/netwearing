import React from 'react';

const MESSAGES = [
  "✦ SYNERGY SPECIAL: FREE SHIPPING ON ALL RÉSUMÉ SHIRTS ✦",
  "🚀 NOW TRENDING: THE 'PIVOT' COLLECTION IS HERE 🚀",
  "⚠ WARNING: WEARING THIS SHIRT MAY CAUSE UNINTENDED ENDORSEMENTS ⚠",
  "🤝 DISRUPTING THE NETWORKING INDUSTRY ONE SHIRT AT A TIME 🤝",
  "📈 Q1 RESULTS: 400% INCREASE IN 'WHO-IS-THIS' QUERIES 📈",
];

export default function Banner() {
  return (
    <div className="bg-linkedin-blue text-white py-1.5 overflow-hidden whitespace-nowrap border-b border-linkedin-dark relative h-8 flex items-center">
      <div className="flex animate-marquee absolute top-0 left-0 h-full items-center">
        {[...MESSAGES, ...MESSAGES].map((msg, i) => (
          <span key={i} className="mx-8 font-bold text-[0.7rem] uppercase tracking-wider flex items-center gap-2">
            {msg}
          </span>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

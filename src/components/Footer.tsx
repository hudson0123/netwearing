import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-text text-white/60 py-12 px-6 text-center">
      <div className="max-w-[1000px] mx-auto">
        {/* Logo */}
        <div className="font-serif text-2xl font-bold text-white mb-1">
          Netwearing™
        </div>
        <p className="text-sm mb-6">
          Dress for the job you'll never get. 🚀
        </p>

        {/* Fine print */}
        <p className="text-xs opacity-40 max-w-xl mx-auto leading-relaxed">
          © 2025 Netwearing™ · Not affiliated with LinkedIn. · Not responsible for
          unintended career outcomes. · All testimonials are fictional. Results may
          vary. Synergy not guaranteed.
        </p>
      </div>
    </footer>
  );
}

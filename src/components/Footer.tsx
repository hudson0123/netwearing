
export default function Footer() {
  return (
    <footer className="bg-text text-white/60 py-12 px-6 text-center">
      <div className="max-w-[1000px] mx-auto">
        {/* Logo */}
        <p className="text-sm mb-6">
          Dress for the job you&apos;ll never get.
        </p>

        {/* Fine print */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-mono opacity-50 mb-2">
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <span>·</span>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
          </div>
          <p className="text-xs opacity-40 max-w-xl mx-auto leading-relaxed">
            © 2026 Netwearing™ · Not affiliated with LinkedIn. · Not responsible for
            unintended career outcomes. Results may
            vary. Synergy not guaranteed.
          </p>
        </div>
      </div>
    </footer>
  );
}

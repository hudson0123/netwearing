import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center h-[52px]">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight">
          <span className="text-linkedin-blue">Net</span>
          <span className="text-text">wearing</span>
          <span className="text-text">™</span>
        </Link>
      </div>
    </nav>
  );
}

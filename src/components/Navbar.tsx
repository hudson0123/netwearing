import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-[52px]">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="Netwearing Logo" 
            width={120} 
            height={50} 
            className="my-auto w-auto"
            priority
          />
        </Link>
        <Link 
          href="/checkout"
          className="bg-linkedin-blue text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-linkedin-dark transition-colors"
        >
          Submit Application
        </Link>
      </div>
    </nav>
  );
}

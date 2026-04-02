import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/CartContext';

export default function Navbar() {
  const { setIsOpen, itemCount } = useCart();

  return (
    <nav className="bg-surface sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-[52px]">
        <Link href="/" className="flex items-center h-full cursor-pointer py-1">
          <Image 
            src="/logo.png" 
            alt="Netwearing Logo" 
            width={240} 
            height={80} 
            className="w-32 sm:w-48 h-auto object-contain mt-1"
            priority
          />
        </Link>

        <div className="flex items-center gap-3">
          {/* Cart Icon */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 rounded-md hover:bg-bg transition-colors group cursor-pointer"
            aria-label="Open cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text group-hover:text-linkedin-blue transition-colors"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>

            {/* Badge */}
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-linkedin-blue text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

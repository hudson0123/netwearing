import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { formatPrice } from '@/lib/products';
import { useEffect } from 'react';

const FREE_SHIPPING_THRESHOLD = 0; // Temporarily set to $0.00 in cents for all orders

export default function SidebarCart() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, subtotal } =
    useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[90] transition-opacity duration-300 cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-surface z-[100] shadow-[-4px_0_24px_rgba(0,0,0,0.15)] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-linkedin-blue text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold tracking-wide">Cart</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/20 transition-colors text-xl font-bold cursor-pointer"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="text-4xl mb-3">🛒</div>
              <p className="text-muted text-sm">Your cart is empty.</p>
              <p className="text-muted text-xs mt-1">
                Click a size on any product to add it.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((item, index) => (
                <div key={`${item.product.id}-${item.size}-${index}`} className="px-5 py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-bg rounded border border-border flex items-center justify-center shrink-0 overflow-hidden relative">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <span className="text-2xl">👕</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-text truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          Size: {item.size}
                        </p>
                      </div>
                      <span className="text-sm font-bold whitespace-nowrap">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>

                    {/* Quantity + Remove */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-border rounded">
                        <button
                          onClick={() =>
                            updateQuantity(index, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-sm font-bold hover:bg-bg transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(index, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-sm font-bold hover:bg-bg transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-xs font-bold text-muted hover:text-red transition-colors uppercase tracking-wide cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (only when items exist) */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 shrink-0 space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Subtotal</span>
              <span className="text-base font-bold">{formatPrice(subtotal)}</span>
            </div>

            <p className="text-xs text-muted">
              Shipping &amp; taxes calculated at checkout
            </p>

            {/* Free shipping banner */}
            <div
              className={`text-xs font-semibold px-4 py-3 rounded-md border-2 border-dashed text-center ${
                hasFreeShipping
                  ? 'bg-green/10 border-green text-green'
                  : 'bg-linkedin-light border-linkedin-blue text-linkedin-blue'
              }`}
            >
              {hasFreeShipping
                ? " You've unlocked free shipping!"
                : `Add ${formatPrice(amountToFreeShipping)} more to unlock free shipping.`}
            </div>

            {/* Checkout */}
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-linkedin-blue text-white text-center py-3.5 rounded-md font-bold text-sm hover:bg-linkedin-dark transition-colors uppercase tracking-wider cursor-pointer"
            >
              Check Out
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

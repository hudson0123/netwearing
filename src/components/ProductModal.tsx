import Image from 'next/image';
import { useEffect } from 'react';
import { Product, formatPrice } from '@/lib/products';
import { useCart } from '@/lib/CartContext';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addToCart } = useCart();

  // Lock body scroll when modal is open
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

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleAddToCart = (size: string) => {
    addToCart(product.id, size);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[80] animate-[fadeIn_0.2s_ease]"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[85] flex items-end md:items-center md:justify-center pointer-events-none"
      >
        <div
          className="relative bg-surface w-full h-full md:h-auto md:max-w-3xl md:rounded-xl md:shadow-2xl md:mx-4 overflow-y-auto pointer-events-auto animate-[modalSlideUp_0.3s_ease]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-bg/80 hover:bg-bg text-text transition-colors text-lg font-bold cursor-pointer"
            aria-label="Close product details"
          >
            ✕
          </button>

          <div className="md:flex">
            {/* Image Side */}
            <div className="md:w-1/2 bg-bg flex items-center justify-center p-6 md:p-10 md:rounded-l-xl">
              <div className="relative w-full aspect-square max-w-[360px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Details Side */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
              {/* Header */}
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-text mb-1">
                {product.name}
              </h2>
              <p className="text-xl font-bold text-linkedin-blue mb-3">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm italic text-muted mb-4">
                &ldquo;{product.tagline}&rdquo;
              </p>

              {/* Divider */}
              <div className="h-px bg-border mb-4" />

              {/* Product Details */}
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                <strong>Material</strong> 100% premium ring-spun cotton · <strong>Weight</strong> 5.3 oz midweight · <strong>Fit</strong> Unisex, true-to-size · <strong>Print</strong> DTG (direct-to-garment) · <strong>Care</strong> Machine wash cold, tumble dry low
              </p>

              {/* Divider */}
              <div className="h-px bg-border mb-4" />

              {/* Size / Add to Cart */}
              <div>
                <h3 className="font-serif text-sm font-bold text-text uppercase tracking-wider mb-3">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleAddToCart(size)}
                      className="px-5 py-2.5 text-sm font-bold bg-linkedin-blue text-white rounded-md hover:bg-linkedin-dark transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                      aria-label={`Add size ${size} to cart`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted mt-3">
                  Click a size to add to cart
                </p>
              </div>

              {/* Upload note */}
              {product.requiresUpload && (
                <div className="mt-4 px-4 py-3 bg-linkedin-light/50 rounded-lg border border-linkedin-light">
                  <p className="text-xs text-linkedin-dark font-semibold">
                    📄 Résumé upload required at checkout — we&apos;ll print your actual qualifications on the shirt.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

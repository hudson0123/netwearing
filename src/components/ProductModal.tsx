import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Product, formatPrice } from '@/lib/products';
import { useCart } from '@/lib/CartContext';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset image index when modal opens with a new product
  useEffect(() => {
    if (isOpen) {
      setActiveImageIndex(0);
    }
  }, [isOpen, product]);

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

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
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
            className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-bg/80 hover:bg-bg text-text transition-colors text-lg font-bold cursor-pointer"
            aria-label="Close product details"
          >
            ✕
          </button>

          <div className="md:flex">
            {/* Image Side */}
            <div className="md:w-1/2 bg-bg flex flex-col items-center justify-center p-6 md:p-10 md:rounded-l-xl relative group/slider">
              <div className="relative w-full aspect-square max-w-[360px] z-0">
                {product.images.map((img, idx) => (
                  <Image
                    key={img + idx}
                    src={img}
                    alt={`${product.name} - image ${idx + 1}`}
                    fill
                    className={`object-contain transition-opacity duration-700 ease-in-out ${
                      idx === activeImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    priority={idx === 0}
                  />
                ))}
              </div>

              {/* Slider Controls */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-surface/80 hover:bg-surface text-text shadow-md transition-all md:opacity-0 md:group-hover/slider:opacity-100 cursor-pointer z-10"
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-surface/80 hover:bg-surface text-text shadow-md transition-all md:opacity-0 md:group-hover/slider:opacity-100 cursor-pointer z-10"
                    aria-label="Next image"
                  >
                    →
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {product.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i); }}
                        className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                          i === activeImageIndex ? 'bg-linkedin-blue' : 'bg-border hover:bg-muted'
                        }`}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
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


import Image from 'next/image';
import { useState, useEffect } from 'react';
import { products, formatPrice, Product } from '@/lib/products';
import { useCart } from '@/lib/CartContext';
import ProductModal from './ProductModal';

function ProductCard({
  product,
  onSelect,
  onAddToCart,
}: {
  product: Product;
  onSelect: (p: Product) => void;
  onAddToCart: (id: string, size: string) => void;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (product.images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % product.images.length);
    }, 4000); // Cycle every 4 seconds

    return () => clearInterval(interval);
  }, [product.images.length]);

  return (
    <div
      className="group overflow-hidden cursor-pointer"
      onClick={() => onSelect(product)}
    >
      {/* Image Container */}
      <div className="flex items-center justify-center p-2 relative aspect-square overflow-hidden">
        <div className="relative w-full h-full z-0">
          {product.images.map((img, idx) => (
            <Image
              key={img + idx}
              src={img}
              alt={product.name}
              fill
              className={`object-contain transition-all duration-1000 ease-in-out ${
                idx === activeImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } group-hover:scale-105 transition-transform duration-500`}
              priority={idx === 0}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 text-center">
        <h3 className="font-serif text-lg font-bold text-text mb-1">
          {product.name}
        </h3>
        <p className="text-base font-semibold text-muted mb-4">
          {formatPrice(product.price)}
        </p>

        {/* Size Buttons */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product.id, size);
              }}
              className="px-4 py-2 text-sm font-bold bg-linkedin-blue text-white rounded hover:bg-linkedin-dark transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              aria-label={`Add ${size} to cart`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductSection() {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section id="product" className="bg-bg py-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}


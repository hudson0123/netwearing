import Image from 'next/image';
import { products, formatPrice } from '@/lib/products';
import { useCart } from '@/lib/CartContext';


export default function ProductSection() {
  const { addToCart } = useCart();

  return (
    <section id="product" className="bg-bg py-12 px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            return (
              <div
                key={product.id}
                className="group overflow-hidden"
              >
                {/* Image */}
                <div className="flex items-center justify-center p-6 relative aspect-square overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                    />
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
                        onClick={() => addToCart(product.id, size)}
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
          })}
        </div>
      </div>
    </section>
  );
}

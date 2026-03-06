import Link from 'next/link';
import Image from 'next/image';
import ShirtMockup from './ShirtMockup';
import { products, formatPrice } from '@/lib/products';

export default function ProductSection() {
  const product = products[0];

  return (
    <section id="product" className="bg-surface border-border py-12 px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Visual */}
          <div className="bg-bg border border-border rounded flex flex-col items-center justify-center relative overflow-hidden aspect-[4/4] p-4">
            <div className="relative w-full h-full">
              <Image 
                src="/netwearing-shirt.png" 
                alt="Netwearing Shirt - Front and Back" 
                fill
                priority
              />
            </div>
            <p className="mt-4 text-[10px] text-muted text-center px-4 leading-tight">
              Front: Your name, bold as your LinkedIn headline.
              <br />
              Back: Your entire résumé. Tiny. Readable. Controversial.
            </p>
          </div>

          {/* Info */}
          <div className="py-4">
            {/* Name & tagline */}
            <h2 className="font-serif text-3xl font-bold tracking-tight mb-2">
              {product.name}
            </h2>
            <p className="text-muted text-base leading-relaxed mb-6">
              {product.tagline} {product.description}
            </p>

            {/* Skills */}
            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Skills Endorsed By This Shirt
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs border border-border px-3 py-1 rounded-full text-linkedin-blue font-medium bg-surface"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-text">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-muted">
                Free shipping · Because you've suffered enough.
              </span>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              className="block w-full bg-linkedin-blue text-white text-center py-3.5 rounded-full font-semibold text-base hover:bg-linkedin-dark transition-all hover:-translate-y-0.5"
            >
              Submit My Application →
            </Link>
            <p className="text-center text-xs text-muted mt-2">
              We'll send a mockup within 48 hrs. No ghosting. (We mean it.)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

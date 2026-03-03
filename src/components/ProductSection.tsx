import Link from 'next/link';
import ShirtMockup from './ShirtMockup';
import { products, formatPrice } from '@/lib/products';

export default function ProductSection() {
  const product = products[0];

  return (
    <section id="product" className="bg-surface border-t border-b border-border py-12 px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Visual */}
          <div className="bg-bg border border-border rounded flex flex-col items-center justify-center relative overflow-hidden aspect-[3/4]">
            <div className="absolute top-4 right-4 bg-green text-white text-[0.7rem] font-bold px-2.5 py-0.5 rounded-full">
              New Drop
            </div>
            <ShirtMockup />
            <p className="mt-6 text-xs text-muted text-center px-4">
              Front: Your name, bold as your LinkedIn headline.
              <br />
              Back: Your entire résumé. Tiny. Readable. Controversial.
            </p>
          </div>

          {/* Info */}
          <div className="py-4">
            {/* Meta tags */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-linkedin-light text-linkedin-blue px-2.5 py-0.5 rounded-full font-semibold">
                Featured
              </span>
            </div>

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

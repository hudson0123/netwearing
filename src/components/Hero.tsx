import Link from 'next/link';
import NextImage from 'next/image';

export default function Hero() {
  return (
    <section className="bg-surface border-border py-14 sm:py-20 px-6 text-center relative overflow-hidden">
      {/* LinkedIn-blue accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-linkedin-blue via-[#70b5f9] to-linkedin-blue" />

      {/* Eyebrow */}
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-linkedin-blue uppercase tracking-wide bg-linkedin-light px-3 py-1 rounded-full mb-5 animate-fade-up">
        ✦ Now Accepting Applications
      </div>

      {/* Headline */}
      <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-text max-w-3xl mx-auto mb-5 animate-fade-up">
        Dress for the job<br />
        you'll <em className="italic text-linkedin-blue">never</em> get.
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-muted max-w-lg mx-auto mb-8 leading-relaxed animate-fade-up-delay-1">
        Put your résumé on a shirt. Wear your qualifications. Let your
        credentials do the networking.
      </p>

      {/* CTA */}
      <Link
        href="/checkout"
        className="inline-block bg-linkedin-blue text-white px-8 py-3.5 rounded-full font-semibold text-base hover:bg-linkedin-dark transition-all hover:-translate-y-0.5 mb-3 animate-fade-up-delay-2"
      >
        Submit Your Application →
      </Link>

      <span className="block text-xs text-muted mt-2 animate-fade-up-delay-2">
        * No cover letter required. For once.
      </span>
    </section>
  );
}

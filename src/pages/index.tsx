import Head from 'next/head';
import ProductSection from '@/components/ProductSection';

export default function Home() {
  return (
    <>
      <Head>
        <title>Netwearing</title>
      </Head>

      {/* Welcome Bar */}
      <section className="mt-6 py-5 px-6 text-center">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text mb-1">
          Dress for the job you'll <em className="italic text-linkedin-blue">never</em> get.
        </h1>
        <p className="text-sm text-muted">
          Put your résumé on a shirt. Let your outfit do the networking.
        </p>
      </section>

      <ProductSection />
    </>
  );
}

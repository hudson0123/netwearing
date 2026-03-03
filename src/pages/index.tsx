import Head from 'next/head';
import Hero from '@/components/Hero';
import ProductSection from '@/components/ProductSection';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';

export default function Home() {
  return (
    <>
      <Head>
        <title>Netwearing™ | Dress For The Job You'll Never Get</title>
      </Head>
      <Hero />
      <ProductSection />
      <HowItWorks />
      <Testimonials />
      <FAQ />
    </>
  );
}

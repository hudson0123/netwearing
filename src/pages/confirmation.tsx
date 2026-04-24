import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '@/lib/CartContext';
import { useEffect } from 'react';

export default function ConfirmationPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const { payment_intent } = router.query;
  const paymentIntentId = typeof payment_intent === 'string' ? payment_intent : null;

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Head>
        <title>Application Received — Netwearing™</title>
      </Head>

      <div className="min-h-screen bg-bg py-12 px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* Success icon */}
          <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#057642" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          {/* Header */}
          <h1 className="font-serif text-3xl font-bold tracking-tight mb-2">
            Exciting news regarding your application 🎉
          </h1>
          <p className="text-muted text-sm mb-12 max-w-sm mx-auto leading-relaxed">
            Your credentials have been successfully received and are currently under review.
            We will be in touch within 48 hours with next steps regarding your materialization.
          </p>

          {/* Back to home */}
          <Link
            href="/"
            className="inline-block bg-text text-bg px-8 py-3 rounded-sm font-mono text-xs font-bold uppercase tracking-widest hover:bg-linkedin-blue transition-all"
          >
            ← Back to Netwearing
          </Link>
        </div>
      </div>
    </>
  );
}

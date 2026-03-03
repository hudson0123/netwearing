import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ConfirmationPage() {
  const router = useRouter();
  const paymentIntentId = router.query.payment_intent as string | undefined;

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
          <p className="text-muted text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            Your order has been received and is currently under review by our team.
            We will be in touch within 48 hours with next steps. We appreciate your
            interest and look forward to moving this process forward.
          </p>

          {/* Upload CTA */}
          <div className="bg-surface border border-border rounded-lg p-6 mb-6">
            <h2 className="font-serif text-xl font-bold mb-2">
              One more thing — your qualifications.
            </h2>
            <p className="text-sm text-muted mb-4">
              Upload your résumé so we can design your shirt. Think of it as the
              final round of the interview process. But this time, you actually get
              something out of it.
            </p>
            {paymentIntentId ? (
              <Link
                href={`/upload/${paymentIntentId}`}
                className="inline-block bg-linkedin-blue text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-linkedin-dark transition-all hover:-translate-y-0.5"
              >
                Attach Your Qualifications →
              </Link>
            ) : (
              <p className="text-xs text-muted italic">
                Check your email for your upload link, or contact us if you need
                help.
              </p>
            )}
          </div>

          {/* Back to home */}
          <Link
            href="/"
            className="text-sm text-linkedin-blue font-medium hover:underline"
          >
            ← Back to Netwearing
          </Link>
        </div>
      </div>
    </>
  );
}

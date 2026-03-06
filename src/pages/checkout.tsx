import Head from 'next/head';
import Image from 'next/image';
import { useState, FormEvent } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripeClient';
import { products, formatPrice } from '@/lib/products';
import { useRouter } from 'next/router';

const product = products[0];

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [size, setSize] = useState('M');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setLoading(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/confirmation`,
        payment_method_data: {
          billing_details: {
            name,
            email,
          },
        },
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message || 'Payment failed');
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      router.push(`/confirmation?payment_intent=${paymentIntent.id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Info */}
      <div>
        <h3 className="font-serif text-lg font-bold mb-4">Your Details</h3>
        <div className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe, Senior Synergy Officer"
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.professional@email.com"
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
            />
          </div>
        </div>
      </div>

      {/* Size Selector */}
      <div>
        <h3 className="font-serif text-lg font-bold mb-4">Select Your Size</h3>
        <div className="grid grid-cols-6 gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                size === s
                  ? 'bg-linkedin-blue text-white border-linkedin-blue'
                  : 'bg-surface text-text border-border hover:border-linkedin-blue'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div>
        <h3 className="font-serif text-lg font-bold mb-4">Payment</h3>
        <div className="border border-border rounded-lg p-4 bg-surface">
          <PaymentElement />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red/10 text-red text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-linkedin-blue text-white py-3.5 rounded-full font-semibold text-base hover:bg-linkedin-dark transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? 'Processing...' : `Pay ${formatPrice(product.price)} →`}
      </button>

      <p className="text-center text-xs text-muted">
        Your résumé upload happens after payment. One step at a time — just like your career.
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState('');
  const [initializing, setInitializing] = useState(false);
  const [started, setStarted] = useState(false);

  async function initPayment(name: string, email: string, size: string, linkedinUrl: string, uploadLater: boolean) {
    setInitializing(true);
    setFetchError('');

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          name,
          email,
          size,
          linkedinUrl,
          uploadLater,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      setClientSecret(data.clientSecret);
      setStarted(true);
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setInitializing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Checkout — Netwearing™</title>
      </Head>

      <div className="min-h-screen bg-bg py-8 sm:py-12 px-4">
        <div className="max-w-[1000px] mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-linkedin-blue uppercase tracking-wide bg-linkedin-light px-3 py-1 rounded-full mb-3">
              Application Form
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight mb-2">
              Submit Your Application
            </h1>
            <p className="text-sm text-muted">
              Complete the form below. No references required. Yet.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Product card (Left on Desktop) */}
            <div className="bg-surface border border-border rounded-lg overflow-hidden sticky top-[72px]">
              <div className="bg-bg flex items-center justify-center p-8">
                <div className="relative w-full aspect-[4/3] max-w-[300px]">
                  <Image 
                    src="/netwearing-shirt.png" 
                    alt="Netwearing Shirt" 
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="p-5 border-t border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-serif text-lg font-bold">{product.name}</h2>
                    <p className="text-xs text-muted mt-0.5">{product.tagline}</p>
                  </div>
                  <span className="text-xl font-bold whitespace-nowrap ml-4">{formatPrice(product.price)}</span>
                </div>
                <p className="text-xs text-muted mt-2">Custom print · Free shipping</p>
              </div>
            </div>

            {/* Checkout form (Right on Desktop) */}
            <div className="bg-surface border border-border rounded-lg p-6">
              {!started ? (
                <PreCheckoutForm
                  onSubmit={initPayment}
                  loading={initializing}
                  error={fetchError}
                />
              ) : clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#0a66c2',
                        fontFamily: "'DM Sans', sans-serif",
                        borderRadius: '8px',
                      },
                    },
                  }}
                >
                  <CheckoutForm />
                </Elements>
              ) : (
                <div className="text-center py-8 text-muted text-sm">Loading payment form...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* Pre-checkout step: collect name/email/size before creating payment intent */
function PreCheckoutForm({
  onSubmit,
  loading,
  error,
}: {
  onSubmit: (name: string, email: string, size: string, linkedinUrl: string, uploadLater: boolean) => void;
  loading: boolean;
  error: string;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [size, setSize] = useState('M');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [uploadLater, setUploadLater] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(name, email, size, linkedinUrl, uploadLater);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-serif text-lg font-bold mb-4">Your Details</h3>
        <div className="space-y-3">
          <div>
            <label htmlFor="pre-name" className="block text-sm font-medium text-text mb-1">
              Full Name
            </label>
            <input
              id="pre-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe, Senior Synergy Officer"
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-bg focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
            />
          </div>
          <div>
            <label htmlFor="pre-email" className="block text-sm font-medium text-text mb-1">
              Email
            </label>
            <input
              id="pre-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.professional@email.com"
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-bg focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="pre-linkedin" className={`text-sm font-medium ${uploadLater ? 'text-muted' : 'text-text'}`}>
                LinkedIn Profile URL
              </label>
            </div>
            <input
              id="pre-linkedin"
              type="url"
              required={!uploadLater}
              disabled={uploadLater}
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourname"
              className={`w-full border border-border rounded-lg px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-linkedin-blue ${
                uploadLater ? 'bg-bg/50 border-border/50 text-muted opacity-60' : 'bg-bg'
              }`}
            />
            <div className="mt-2.5 flex items-center gap-2">
              <input
                id="pre-upload-later"
                type="checkbox"
                checked={uploadLater}
                onChange={(e) => setUploadLater(e.target.checked)}
                className="w-4 h-4 rounded border-border text-linkedin-blue focus:ring-linkedin-blue"
              />
              <label htmlFor="pre-upload-later" className="text-[0.75rem] text-muted cursor-pointer hover:text-text transition-colors">
                I'll upload my résumé after payment
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-serif text-lg font-bold mb-4">Select Your Size</h3>
        <div className="grid grid-cols-6 gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                size === s
                  ? 'bg-linkedin-blue text-white border-linkedin-blue'
                  : 'bg-bg text-text border-border hover:border-linkedin-blue'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red/10 text-red text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-linkedin-blue text-white py-3.5 rounded-full font-semibold text-base hover:bg-linkedin-dark transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Setting up...' : 'Continue to Payment →'}
      </button>
    </form>
  );
}

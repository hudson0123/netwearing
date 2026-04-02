import Head from 'next/head';
import Image from 'next/image';
import { useState, FormEvent } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripeClient';
import { products, formatPrice } from '@/lib/products';
import { useRouter } from 'next/router';
import { useCart } from '@/lib/CartContext';

const product = products[0];

function CheckoutForm({ subtotal, customerName, customerEmail }: { subtotal: number, customerName: string, customerEmail: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

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
            name: customerName,
            email: customerEmail,
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



      <div className="pb-2">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-muted mb-4 border-b border-border pb-2">
           Part 2: Application Processing Fee
        </h3>
        <div className="border-2 border-border rounded-sm p-4 bg-surface">
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
        className="w-full bg-text text-bg py-3.5 rounded-sm font-mono text-xs font-bold tracking-widest uppercase hover:bg-linkedin-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-2 border-text hover:border-linkedin-blue"
      >
        {loading ? 'Processing Authorization...' : `Submit Application & Pay Fee (${formatPrice(subtotal)})`}
      </button>

      <p className="text-center text-[10px] text-muted font-mono uppercase mt-4">
        * Mandatory screening fee is non-refundable. Do not contact HR regarding your application status.
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState('');
  const [initializing, setInitializing] = useState(false);
  const [started, setStarted] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  async function initPayment(name: string, email: string, linkedinUrl: string, uploadLater: boolean) {
    setCustomerName(name);
    setCustomerEmail(email);
    setInitializing(true);
    setFetchError('');

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.product.id, size: i.size, quantity: i.quantity })),
          name,
          email,
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

      <div className="min-h-screen bg-bg py-4 sm:py-6 px-4">
        <div className="max-w-[1000px] mx-auto">
          {/* Header */}
          <div className="text-center mb-8 border-b border-border pb-6 mt-4">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-muted border border-border px-2 py-0.5 rounded-sm mb-3 tracking-widest">
              FORM NW-1099
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-2 uppercase">
              Official Candidate Submission
            </h1>
            <p className="text-sm font-medium text-muted max-w-lg mx-auto">
              Please complete all mandatory fields below. False or misleading information may result in your immediate disqualification from the talent pool.
            </p>
          </div>

          <div className="max-w-[600px] mx-auto">
            {/* Checkout form (Right on Desktop) */}
            <div className="bg-surface border-2 border-border shadow-sm rounded-sm p-6 sm:p-8">
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
                  <CheckoutForm subtotal={subtotal} customerName={customerName} customerEmail={customerEmail} />
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
  onSubmit: (name: string, email: string, linkedinUrl: string, uploadLater: boolean) => void;
  loading: boolean;
  error: string;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [uploadLater, setUploadLater] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(name, email, linkedinUrl, uploadLater);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="pb-2">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-muted mb-4 border-b border-border pb-2">
          Part 1: Identification & Background
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="pre-name" className="block text-xs font-bold text-text mb-1 uppercase tracking-wider">
              1. Legal Full Name *
            </label>
            <input
              id="pre-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. DOE, JOHN"
              className="w-full border border-border rounded-sm px-4 py-2.5 text-sm bg-bg focus:outline-none focus:border-linkedin-blue focus:ring-1 focus:ring-linkedin-blue transition-colors"
            />
          </div>
          <div>
            <label htmlFor="pre-email" className="block text-xs font-bold text-text mb-1 uppercase tracking-wider">
              2. Primary Electronic Mail *
            </label>
            <input
              id="pre-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="applicant@domain.com"
              className="w-full border border-border rounded-sm px-4 py-2.5 text-sm bg-bg focus:outline-none focus:border-linkedin-blue focus:ring-1 focus:ring-linkedin-blue transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="pre-linkedin" className={`text-xs font-bold uppercase tracking-wider ${uploadLater ? 'text-muted' : 'text-text'}`}>
                3. Professional Network URL (LinkedIn) *
              </label>
            </div>
            <input
              id="pre-linkedin"
              type="url"
              required={!uploadLater}
              disabled={uploadLater}
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className={`w-full border border-border rounded-sm px-4 py-2.5 text-sm transition-all focus:outline-none focus:border-linkedin-blue focus:ring-1 focus:ring-linkedin-blue ${
                uploadLater ? 'bg-bg/50 border-border/50 text-muted opacity-60' : 'bg-bg'
              }`}
            />
            <div className="mt-2.5 flex items-center gap-2">
              <input
                id="pre-upload-later"
                type="checkbox"
                checked={uploadLater}
                onChange={(e) => setUploadLater(e.target.checked)}
                className="w-4 h-4 rounded border-border text-linkedin-blue focus:ring-linkedin-blue cursor-pointer"
              />
              <label htmlFor="pre-upload-later" className="text-[0.75rem] text-muted cursor-pointer hover:text-text transition-colors">
                I'll upload my résumé after payment
              </label>
            </div>
          </div>
        </div>
      </div>



      {error && (
        <div className="bg-red/10 text-red text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-text text-bg py-3.5 rounded-sm font-mono text-xs font-bold tracking-widest uppercase hover:bg-linkedin-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-2 border-text hover:border-linkedin-blue mt-4"
      >
        {loading ? 'Accessing Secure Gateway...' : 'Initialize Part 2 →'}
      </button>
    </form>
  );
}

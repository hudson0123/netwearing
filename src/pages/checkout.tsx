import Head from 'next/head';
import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripeClient';
import { formatPrice } from '@/lib/products';
import { useRouter } from 'next/router';
import { useCart } from '@/lib/CartContext';

interface ShippingAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

function CheckoutForm({
  subtotal,
  customerName,
  customerEmail,
  shipping,
}: {
  subtotal: number;
  customerName: string;
  customerEmail: string;
  shipping: ShippingAddress;
}) {
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
            address: {
              line1: shipping.line1,
              line2: shipping.line2 || undefined,
              city: shipping.city,
              state: shipping.state,
              postal_code: shipping.postal_code,
              country: shipping.country,
            },
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
          <PaymentElement options={{ fields: { shipping: 'never' } } as any} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red/10 text-red text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Price Note */}
      <div className="flex items-center justify-between px-1 text-[10px] font-bold text-muted uppercase tracking-wider">
        <span>Total Dues</span>
        <span>Sales Tax & Fees Included</span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-text text-bg py-3.5 rounded-sm font-mono text-xs font-bold tracking-widest uppercase hover:bg-linkedin-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-2 border-text hover:border-linkedin-blue"
      >
        {loading ? 'Processing Authorization...' : `Submit Application & Pay Fee (${formatPrice(subtotal)})`}
      </button>
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
  const [shipping, setShipping] = useState<ShippingAddress>({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });

  async function initPayment(
    name: string,
    email: string,
    linkedinUrl: string,
    address: ShippingAddress,
    resumeFile: File | null
  ) {
    setCustomerName(name);
    setCustomerEmail(email);
    setShipping(address);
    setInitializing(true);
    setFetchError('');

    try {
      // 1. Create Payment Intent
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.product.id, size: i.size, quantity: i.quantity })),
          name,
          email,
          linkedinUrl,
          shipping: address,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create payment');

      const piId = data.paymentIntentId;

      // 2. If we have a file, upload it immediately
      if (resumeFile) {
        const formData = new FormData();
        formData.append('file', resumeFile);
        formData.append('orderId', piId);

        const uploadRes = await fetch('/api/upload-resume', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const uploadData = await uploadRes.json();
          throw new Error(uploadData.error || 'Identity verification / upload failed');
        }
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

      <div className="min-h-screen bg-bg py-4 sm:py-6 px-4 font-sans">
        <div className="max-w-[1000px] mx-auto text-text">
          {/* Header */}
          <div className="text-center mb-8 border-b border-border pb-6 mt-4">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-muted border border-border px-2 py-0.5 rounded-sm mb-3 tracking-widest bg-white">
              FORM NW-1099
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-2 uppercase">
              Official Candidate Submission
            </h1>
            <p className="text-sm font-medium text-muted max-w-lg mx-auto">
              Please complete all mandatory fields below. False or misleading information may result in your immediate disqualification from the talent pool.
            </p>
          </div>

          <div className="max-w-[640px] mx-auto">
            {/* Checkout form */}
            <div className="bg-surface border-2 border-border shadow-sm rounded-sm p-6 sm:p-8">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-lg font-bold mb-4 uppercase tracking-widest">DOCKET EMPTY</h2>
                  <p className="text-muted text-sm mb-8 leading-relaxed">No professional materialization items found. Please return to the registry to select your credentials.</p>
                  <Link href="/" className="inline-block bg-text text-bg px-8 py-3 rounded-sm font-mono text-xs font-bold uppercase tracking-widest hover:bg-linkedin-blue transition-all">
                    ← Return to Home
                  </Link>
                </div>
              ) : !started ? (
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
                        borderRadius: '4px',
                      },
                    },
                  }}
                >
                  <CheckoutForm
                    subtotal={subtotal}
                    customerName={customerName}
                    customerEmail={customerEmail}
                    shipping={shipping}
                  />
                </Elements>
              ) : (
                <div className="text-center py-8 text-muted text-sm italic">Accessing secure payment gateway...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* Pre-checkout step: collect name/email/linkedin/shipping before creating payment intent */
function PreCheckoutForm({
  onSubmit,
  loading,
  error,
}: {
  onSubmit: (name: string, email: string, linkedinUrl: string, shipping: ShippingAddress, resumeFile: File | null) => void;
  loading: boolean;
  error: string;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('US');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidationError('');

    // 1. Evidence Check
    if (!resumeFile && (!linkedinUrl || linkedinUrl.trim() === '')) {
        setValidationError('Mandatory evidence missing. Please provide either a LinkedIn URL or attach your résumé for materialization.');
        return;
    }

    // 2. Terms Check
    if (!agreeTerms) {
        setValidationError('You must accept the Terms of Engagement to authorize data processing.');
        return;
    }

    onSubmit(name, email, linkedinUrl, {
      line1,
      line2,
      city,
      state,
      postal_code: postalCode,
      country,
    }, resumeFile);
  }

  const inputClass =
    'w-full border border-border rounded-sm px-4 py-2.5 text-sm bg-bg focus:outline-none focus:border-linkedin-blue focus:ring-1 focus:ring-linkedin-blue transition-colors disabled:opacity-50';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Part 1: Identification */}
      <div className="pb-2">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-muted mb-4 border-b border-border pb-2">
          Part 1: Identification &amp; Credentials
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pre-name" className="block text-[10px] font-bold text-text mb-1 uppercase tracking-wider">
                1. Legal Full Name *
              </label>
              <input
                id="pre-name"
                type="text"
                required
                disabled={loading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="FIRST LAST"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="pre-email" className="block text-[10px] font-bold text-text mb-1 uppercase tracking-wider">
                2. Primary Electronic Mail *
              </label>
              <input
                id="pre-email"
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL@DOMAIN.COM"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-text mb-2 uppercase tracking-wider">
              3. Evidence of Background (Attach Résumé or URL)
            </label>
            
            {/* Integrated Upload Area */}
            <div
              className={`border-2 border-dashed rounded-sm p-6 text-center transition-all cursor-pointer mb-4 ${
                dragActive
                  ? 'border-linkedin-blue bg-linkedin-blue/5'
                  : 'border-border hover:border-linkedin-blue/50 bg-bg/30'
              } ${loading ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const f = e.dataTransfer.files[0];
                if (f && (f.type === 'application/pdf' || f.type.includes('msword') || f.size < 10000000)) {
                    setResumeFile(f);
                    setValidationError('');
                }
              }}
              onClick={() => {
                document.getElementById('pre-file-input')?.click();
              }}
            >
              <input
                id="pre-file-input"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                disabled={loading}
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setResumeFile(f);
                }}
              />
              
              {resumeFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-linkedin-blue/10 rounded flex items-center justify-center">
                    <span className="text-lg">📄</span>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-text truncate max-w-[200px]">{resumeFile.name}</p>
                    <p className="text-[10px] text-muted uppercase tracking-tight">ATTACHED DOCKET</p>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
                    className="ml-4 text-xs font-bold text-red hover:underline"
                  >
                    REMOVE
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold text-text mb-1 uppercase tracking-tighter">DRAG &amp; DROP DOCKET HERE</p>
                  <p className="text-[10px] text-muted uppercase">PDF OR WORD (10MB MAX)</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-[10px] font-bold text-muted uppercase">OR</span>
                <div className="flex-1 h-px bg-border"></div>
            </div>

            <input
              id="pre-linkedin"
              type="text"
              disabled={loading}
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="www.linkedin.com/in/username/"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Part 1b: Shipping Address */}
      <div className="pb-2">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-muted mb-4 border-b border-border pb-2">
          Part 1b: Shipping Address
        </h3>
        <p className="text-[0.7rem] text-muted mb-4 italic leading-tight">
          Required for physical delivery of your credentials. P.O. Boxes not accepted. Our manufacturing facility requires precise geographic data.
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ship-line1" className="block text-[10px] font-bold text-text mb-1 uppercase tracking-wider">
                4. Primary Street Address *
              </label>
              <input
                id="ship-line1"
                type="text"
                required
                disabled={loading}
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="STREET ADDRESS"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="ship-line2" className="block text-[10px] font-bold text-text mb-1 uppercase tracking-wider">
                5. Suite / Unit / Level
              </label>
              <input
                id="ship-line2"
                type="text"
                disabled={loading}
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                placeholder="OPTIONAL"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label htmlFor="ship-city" className="block text-[10px] font-bold text-text mb-1 uppercase tracking-wider">
                6. City *
              </label>
              <input
                id="ship-city"
                type="text"
                required
                disabled={loading}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="CITY"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="ship-state" className="block text-[10px] font-bold text-text mb-1 uppercase tracking-wider">
                7. State *
              </label>
              <input
                id="ship-state"
                type="text"
                required
                disabled={loading}
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="STATE"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="ship-zip" className="block text-[10px] font-bold text-text mb-1 uppercase tracking-wider">
                8. Postal Code *
              </label>
              <input
                id="ship-zip"
                type="text"
                required
                disabled={loading}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="ZIP"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="ship-country" className="block text-[10px] font-bold text-text mb-1 uppercase tracking-wider">
              9. Jurisdictional Country *
            </label>
            <select
              id="ship-country"
              required
              disabled={loading}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClass}
            >
              <option value="US">UNITED STATES</option>
              <option value="CA">CANADA</option>
              <option value="GB">UNITED KINGDOM</option>
              <option value="AU">AUSTRALIA</option>
              <option value="DE">GERMANY</option>
              <option value="FR">FRANCE</option>
              <option value="NL">NETHERLANDS</option>
              <option value="SE">SWEDEN</option>
              <option value="NO">NORWAY</option>
              <option value="DK">DENMARK</option>
              <option value="JP">JAPAN</option>
              <option value="SG">SINGAPORE</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-border">
          <div className="flex items-start gap-2.5">
            <input
              id="pre-terms"
              type="checkbox"
              required
              disabled={loading}
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded-sm border-border text-linkedin-blue focus:ring-linkedin-blue cursor-pointer"
            />
            <label htmlFor="pre-terms" className="text-[0.7rem] text-muted leading-tight cursor-pointer hover:text-text transition-colors">
                I hereby acknowledge the <a href="/terms" className="text-linkedin-blue hover:underline" onClick={(e) => e.stopPropagation()}>Terms of Engagement</a> and authorize Netwearing™ to proceed with the legal materialization of my professional credentials.
            </label>
          </div>
      </div>

      {(error || validationError) && (
        <div className="bg-red/10 text-red text-sm px-4 py-3 rounded-lg font-bold border border-red/20 uppercase tracking-tight text-center">
            {error || validationError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-text text-bg py-4 rounded-sm font-mono text-xs font-bold tracking-widest uppercase hover:bg-linkedin-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-2 border-text hover:border-linkedin-blue mt-4"
      >
        {loading ? 'Transmitting Evidence...' : 'Submit Application & Proceed to Authorization →'}
      </button>
    </form>
  );
}

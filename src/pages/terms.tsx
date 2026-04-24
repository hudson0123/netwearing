import Head from 'next/head';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg py-16 px-6">
      <Head>
        <title>Terms of Service (NW-TERM-01) — Netwearing™</title>
      </Head>
      <div className="max-w-3xl mx-auto bg-surface border-2 border-border p-8 sm:p-12 shadow-sm font-sans">
        <div className="border-b-2 border-border pb-6 mb-8 text-center">
            <div className="text-[10px] font-mono text-muted uppercase tracking-widest mb-2">Internal Document — Restricted Access</div>
            <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">Terms of Candidate Engagement</h1>
            <p className="text-xs text-muted mt-2 italic">Revision 2026.4.23-B | Subject to change without prior notice or reason</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-6 text-text/80 leading-relaxed">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-text border-l-4 border-linkedin-blue pl-3 mb-3">1.0 Agreement to Terms</h2>
            <p>By accessing and utilizing this proprietary submission gateway, the user (hereinafter "the Candidate") agrees to be bound by these Terms of Engagement. Netwearing™ reserves the right to modify these terms at any time. Continued use of the portal constitutes acceptance of the revised protocol.</p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-text border-l-4 border-linkedin-blue pl-3 mb-3">2.0 Service Fees & Payment</h2>
            <p>Total dues include an Application Processing Fee, which is calculated based on current resource allocation requirements. Payments are processed via secure third-party gateway. All fees are final and non-refundable upon initiation of the materialization process.</p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-text border-l-4 border-linkedin-blue pl-3 mb-3">3.0 Production Specifications</h2>
            <p>Upon verification of payment, candidate data is formatted for application to 100% ring-spun cotton substrates. Netwearing™ warrants that the physical manifestation will conform to standard quality control guidelines. We are not liable for degradation resulting from improper maintenance or unauthorized laundering procedures.</p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-text border-l-4 border-linkedin-blue pl-3 mb-3">4.0 Limitation of Liability</h2>
            <p>Netwearing™ shall not be held liable for any indirect, incidental, or consequential outcomes resulting from the public display of candidate credentials. Candidates assume all risks associated with the physical dissemination of their professional history.</p>
          </section>

          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-[10px] font-mono text-muted">DOCUMENT END — END OF LINE</p>
          </div>
        </div>
      </div>
    </div>
  );
}

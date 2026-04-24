import Head from 'next/head';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg py-16 px-6">
      <Head>
        <title>Privacy & Data Retention (NW-PRIV-10) — Netwearing™</title>
      </Head>
      <div className="max-w-3xl mx-auto bg-surface border-2 border-border p-8 sm:p-12 shadow-sm font-sans">
        <div className="border-b-2 border-border pb-6 mb-8 text-center">
            <div className="text-[10px] font-mono text-muted uppercase tracking-widest mb-2">Confidential Archive — For External Review</div>
            <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">Data Sovereignty Protocol</h1>
            <p className="text-xs text-muted mt-2 italic">Standardized Compliance Directive 4.23 | Privacy is a Feature, not a Bug™</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-6 text-text/80 leading-relaxed">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-text border-l-4 border-linkedin-blue pl-3 mb-3">1.0 Data Collection</h2>
            <p>Netwearing™ collects specific candidate identifiers, including Legal Name, Electronic Mail Address, and Professional Network URLs. This data is utilized solely for the fulfillment of physical credentials and related administrative communications.</p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-text border-l-4 border-linkedin-blue pl-3 mb-3">2.0 Cookies & Identifiers</h2>
            <p>Our system utilizes standard session cookies to maintain the integrity of the candidate submission process and manage cart persistency. These identifiers are essential for the operation of the digital gateway.</p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-text border-l-4 border-linkedin-blue pl-3 mb-3">3.0 Storage & Security</h2>
            <p>Submitted credentials and curriculum vitae are stored securely within our localized cloud infrastructure for the duration of the production lifecycle. We implement industry-standard encryption protocols to protect candidate data from unauthorized access.</p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-text border-l-4 border-linkedin-blue pl-3 mb-3">4.0 Candidate Rights</h2>
            <p>Candidates maintain the right to request access to or deletion of their submitted data. To initiate a discovery or deletion request, please contact our administrative office at info@netwearing.com with the required identification credentials.</p>
          </section>

          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-[10px] font-mono text-muted">END OF PROTOCOL — SECURE TRANSMISSION COMPLETE</p>
          </div>
        </div>
      </div>
    </div>
  );
}

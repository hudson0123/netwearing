const steps = [
  {
    number: '01',
    title: 'Submit Your Application',
    desc: 'Choose your size. Upload your résumé. Pay upfront — just like the real job market, but with a better outcome.',
    quote: '"Taking the leap was the scariest and best decision I ever made. 🙏"',
  },
  {
    number: '02',
    title: "We'll Be In Touch",
    desc: "Within 48 hours, we send you a mockup of your shirt for approval. We actually respond. Unlike some companies we know.",
    quote: '"Communication is everything. That\'s what 14 years in enterprise SaaS taught me."',
  },
  {
    number: '03',
    title: "You're Hired",
    desc: 'Approve the design. We print it. We ship it. You wear your entire career on your body. Networking: automated.',
    quote: '"Excited to announce my next chapter. The best is yet to come. 🚀"',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-bg py-12 px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted mb-2">
          The Process
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-8">
          How it works.
          <br />
          A three-step journey.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-surface border border-border rounded p-6 relative"
            >
              <div className="font-serif text-4xl font-bold text-linkedin-light leading-none mb-3">
                {step.number}
              </div>
              <div className="font-bold text-base mb-1 text-text">{step.title}</div>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              <div className="text-xs text-linkedin-blue italic mt-3 pt-3 border-t border-border">
                {step.quote}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

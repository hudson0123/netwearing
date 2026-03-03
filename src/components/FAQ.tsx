import { useState } from 'react';

const faqs = [
  {
    question: 'Will my résumé actually be readable on the shirt?',
    answer:
      "Depends on how much you've accomplished. A lean, focused résumé? Very readable. A 3-page document listing every internship since 2009? You'll need people to lean in. We consider both outcomes features, not bugs.",
  },
  {
    question: 'Can I wear this to an actual job interview?',
    answer:
      'We cannot legally advise you to do this. We also cannot legally advise you not to. What we can tell you is that several customers have reported this "worked." We leave the definition of "worked" intentionally vague.',
  },
  {
    question: "What if I don't have a résumé?",
    answer:
      "Bold move. Extremely on brand. Submit a LinkedIn URL instead and we'll work with what you have. Or submit a list of your personality traits. We've seen worse résumés.",
  },
  {
    question: 'How long does it take?',
    answer:
      "Mockup within 48 hours of your order. Shipping in 5–7 business days after approval. That's faster than 94% of companies acknowledge a job application. We checked.",
  },
  {
    question: 'Is this a joke?',
    answer:
      'The brand is satirical. The shirt is real. Your résumé is real. The existential dread of modern professional culture that inspired all of this? Absolutely real. We just put it on a shirt.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section className="bg-bg py-12 px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted mb-2">
          Frequently Asked Questions
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-8">
          We anticipated your concerns.
          <br />
          That's called thought leadership.
        </h2>

        <div className="border border-border rounded overflow-hidden">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`bg-surface ${i < faqs.length - 1 ? 'border-b border-border' : ''}`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full px-5 py-4 text-left text-sm font-semibold text-text flex justify-between items-center hover:bg-bg transition-colors"
              >
                {faq.question}
                <span
                  className={`text-xs text-muted transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 text-sm text-muted leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    initials: 'BK',
    color: '#7b3f00',
    name: 'Brad K.',
    title: 'Former VP of Strategic Initiatives · Currently Pivoting',
    connection: '2nd • 500+ connections',
    body: "I wore this shirt to my company's rightsizing announcement. Three people from other departments scanned my résumé mid-meeting. I start my new role Monday. The shirt paid for itself.",
    reactions: ['👏', '💡', '❤️'],
    stats: '847 reactions · 213 comments',
  },
  {
    initials: 'SC',
    color: '#1a5276',
    name: 'Sarah C.',
    title: 'Thought Leader · Content Creator · Dog Mom · MBA',
    connection: '1st • 500+ connections',
    body: 'My résumé shirt sparked more meaningful conversations at a networking event than I\'ve had in 11 years. A recruiter cried. I think he was moved. Either that or my font was too small. Either way: results.',
    reactions: ['🎉', '💡', '👏'],
    stats: '1.2k reactions · 408 comments',
  },
  {
    initials: 'TM',
    color: '#1e8449',
    name: 'Tyler M.',
    title: 'Entry-Level Specialist at a Company That Will Not Be Named',
    connection: '3rd • 12 connections',
    body: "Wore this to my annual performance review. My manager asked if I was \"open to other opportunities.\" I said the shirt was ironic. He said he knew. He promoted me anyway. I don't know what happened.",
    reactions: ['😂', '👏', '💡'],
    stats: '3.4k reactions · 891 comments',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-surface border-t border-b border-border py-12 px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted mb-2">
          What Our Network Is Saying
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-8">
          Humbled by the response.
          <br />
          Truly.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.initials}
              className="border border-border rounded bg-bg p-5 transition-shadow hover:shadow-md"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-sm leading-tight">{t.name}</div>
                  <div className="text-xs text-muted leading-snug">{t.title}</div>
                  <div className="text-[0.7rem] text-muted">{t.connection}</div>
                </div>
              </div>

              {/* Body */}
              <p className="text-sm text-text leading-relaxed mb-3">{t.body}</p>

              {/* Reactions */}
              <div className="flex gap-1.5 items-center text-xs text-muted border-t border-border pt-2.5">
                {t.reactions.map((emoji, i) => (
                  <span key={i} className="text-base">{emoji}</span>
                ))}
                <span>{t.stats}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

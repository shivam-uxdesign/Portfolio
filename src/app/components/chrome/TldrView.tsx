import type { PageMeta } from '../../../lib/pages';

const SERIF = "'Playfair Display', Georgia, serif";

// The summary side of a project page. Placeholder rows until the real
// summaries come in: same rows on every project, so they read alike.
const ROWS = [
  ['Problem', 'One line on what was broken and for whom.'],
  ['My role', 'What I owned, with whom, for how long.'],
  ['What I did', 'The two or three moves that mattered.'],
  ['Outcome', 'The result, with a number if there is one.'],
] as const;

export function TldrView({ meta }: { meta: PageMeta }) {
  const t = meta.tldr!;
  const title = t.title ?? [`${meta.name}, in `, 'one', ' minute.'];
  return (
    <main className="pc-tldr">
      <p className="pc-tldr-label">{t.kind} · TL;DR</p>
      <h1 className="pc-tldr-title">
        {title[0]}<span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, color: 'var(--primary)' }}>{title[1]}</span>{title[2]}
      </h1>
      <dl className="pc-tldr-facts">
        {ROWS.map(([k, v]) => (
          <div key={k} className="pc-tldr-fact"><dt>{k}</dt><dd><span className="pc-ph">{v}</span></dd></div>
        ))}
      </dl>
      <p className="pc-tldr-note">Summary placeholder. Switch to Full for the whole story.</p>
    </main>
  );
}

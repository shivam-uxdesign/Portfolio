import './watching.css';

// Watching: films, series and anime from my own watchlist (Notion). Notes are mine, lightly tidied.
// Posters in public/watching/, from each title's Wikipedia page.
// whole: the image isn't poster-shaped (a logo or a wide still), so it sits whole on a dark card instead of being cropped.
interface Title { id: string; name: string; meta: string; note?: string; stars?: number; whole?: boolean }

const LOVED: Title[] = [
  { id: 'man-from-earth', name: 'The Man from Earth', meta: 'Film · 2007', stars: 4, note: 'Immortal guy, changes house every 10 years.' },
  { id: 'four-lions', name: 'Four Lions', meta: 'Film · 2010', whole: true, note: 'A terrorist group, very bad at it. Funny.' },
  { id: 'udaan', name: 'Udaan', meta: 'Film · 2010' },
  { id: 'gattaca', name: 'Gattaca', meta: 'Film · 1997' },
  { id: 'kevin-can', name: 'Kevin Can F**k Himself', meta: 'Series', stars: 4 },
  { id: 'boondocks', name: 'The Boondocks', meta: 'Animated series', whole: true },
  { id: 'devilman', name: 'Devilman Crybaby', meta: 'Anime' },
  { id: 'edgerunners', name: 'Cyberpunk: Edgerunners', meta: 'Anime' },
  { id: 'yona', name: 'Yona of the Dawn', meta: 'Anime', note: 'Spoiled princess, almost killed, goes off to find four dragons. Redemption arc.' },
  { id: 'dorohedoro', name: 'Dorohedoro', meta: 'Anime' },
];

const NEXT: Title[] = [
  { id: 'office-space', name: 'Office Space', meta: 'Film' },
  { id: 'project-almanac', name: 'Project Almanac', meta: 'Film' },
  { id: 'extraordinary', name: 'Extraordinary', meta: 'Series' },
  { id: 'akudama', name: 'Akudama Drive', meta: 'Anime' },
  { id: 'heavenly-delusion', name: 'Heavenly Delusion', meta: 'Anime' },
  { id: 'eureka', name: 'Eureka Seven', meta: 'Anime' },
];

const poster = (t: Title) => `/watching/${t.id}.webp`;
const hide = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.visibility = 'hidden'; };

export function MoviesPage() {
  return (
    <main className="wa">
      <p className="wa-label">Off Figma · Watching</p>
      <h1 className="wa-title">What I’ve been <em>watching</em>.</h1>
      <p className="wa-lede">Films, shows and a lot of anime. The notes are straight from my own watchlist.</p>

      <h2 className="wa-h2">Loved <em>these</em>.</h2>
      <ul className="wa-grid" role="list">
        {LOVED.map(t => (
          <li key={t.id}>
            <img className={`wa-poster${t.whole ? ' whole' : ''}`} src={poster(t)} alt={`Poster for ${t.name}`} loading="lazy" onError={hide} />
            <p className="wa-name">{t.name}</p>
            <p className="wa-meta">{t.meta}{t.stars ? <> · <span className="wa-stars" aria-label={`${t.stars} out of 5`}>{'★'.repeat(t.stars)}</span></> : null}</p>
            {t.note && <p className="wa-note">{t.note}</p>}
          </li>
        ))}
      </ul>

      <h2 className="wa-h2">Next <em>up</em>.</h2>
      <ul className="wa-next" role="list">
        {NEXT.map(t => (
          <li key={t.id}>
            <img src={poster(t)} alt="" loading="lazy" onError={hide} />
            <div><span>{t.name}</span><small>{t.meta}</small></div>
          </li>
        ))}
      </ul>
    </main>
  );
}

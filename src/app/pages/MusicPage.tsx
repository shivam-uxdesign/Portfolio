import './music.css';

// Music: ten songs I keep going back to, one per genre, each playable on the page through Spotify's own player
// (a preview for everyone, the full song when signed in).
const SONGS: { genre: string; id: string; name: string }[] = [
  { genre: 'Desi hip-hop', id: '1bcfGgCTDiIH2RYB2wL622', name: 'BUZZ, Seedhe Maut and KR$NA' },
  { genre: 'Hindi indie rock', id: '0rlLBWFFTQiOWi963SH9bb', name: 'Choo Lo, The Local Train' },
  { genre: 'Electronic', id: '5ZsAhuQ24mWHiduaxJqnhW', name: 'Udd Gaye, Ritviz' },
  { genre: 'Folk-pop from the Northeast', id: '5bCHdS1G42HA5OpEMXtrp9', name: 'Shaayad, Taba Chake' },
  { genre: 'Nepali pop', id: '4zdOY2zRsFjG2B8OMH17sJ', name: 'Parkha Na, Sushant KC' },
  { genre: 'Punjabi', id: '1SPuc7uit9YBlua4eaVz06', name: 'Gallan 4, Talwiinder' },
  { genre: 'Coke Studio Pakistan', id: '5FTDjvIGEkugdKPrhGaHTu', name: 'Diwanay Dil, Talha Anjum and others' },
  { genre: 'Sufi', id: '0o9PTTePV0ubuFtjk4nEnZ', name: 'Chaap Tilak, Abida Parveen and Rahat Fateh Ali Khan' },
  { genre: 'Old Bollywood', id: '1tp0WN8O2itD7WUa4lOoUU', name: 'Genda Phool, Rekha Bhardwaj' },
  { genre: 'Nepali folk, instrumental', id: '437VPJ6keS4jH7SslNv5gw', name: 'Asaar, Bipul Chettri' },
];

const embed = (id: string) => `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
const ALLOW = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';

export function MusicPage() {
  return (
    <main className="mu">
      <p className="mu-label">Off Figma · Music</p>
      <h1 className="mu-title">What I’m <em>listening</em> to.</h1>
      <p className="mu-lede">
        Ten songs, ten genres: Desi hip-hop to Sufi, Nepali pop to old Bollywood. Press play, they’re right here.
      </p>
      <ul className="mu-songs">
        {SONGS.map(s => (
          <li key={s.id}>
            <p className="mu-genre">{s.genre}</p>
            <div className="mu-slot">
              {/* Under the player: what shows if Spotify is blocked or still loading. */}
              <a className="mu-fallback" href={`https://open.spotify.com/track/${s.id}`} target="_blank" rel="noopener noreferrer">
                <b>{s.name}</b><span>Play on Spotify ↗</span>
              </a>
              <iframe src={embed(s.id)} title={`${s.name}, on Spotify`} allow={ALLOW} loading="lazy" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

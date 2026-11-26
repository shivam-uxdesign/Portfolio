import './books.css';

// Books: the honest reading list. Only books I actually own; covers in public/books/.
interface Book { cover: string; title: string; author: string; status: string; line: string }

const BOOKS: Book[] = [
  {
    cover: 'design-of-everyday-things',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    status: 'Unopened',
    line: 'Bought it in design school. Know the door handle chapter by heart. Have not read the door handle chapter.',
  },
];

export function BooksPage() {
  return (
    <main className="bk">
      <p className="bk-label">Off Figma · Books</p>
      <h1 className="bk-title">On my nightstand. <em>Unopened.</em></h1>
      <p className="bk-lede">The honest reading list. I’ll get to {BOOKS.length > 1 ? 'them' : 'it'}. Probably.</p>
      <ul className="bk-shelf" role="list">
        {BOOKS.map(b => (
          <li key={b.cover} className="bk-book">
            <img className="bk-cover" src={`/books/${b.cover}.webp`} alt={`Cover of ${b.title}`} loading="lazy" />
            <div>
              <p className="bk-name">{b.title}</p>
              <p className="bk-by">{b.author}</p>
              <span className="bk-status">{b.status}</span>
              <p className="bk-line">{b.line}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

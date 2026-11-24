import { useRef } from 'react';
import type { ProjectGroup, ProjectGroupId, ProjectItem } from './types';
import './projects.css';

function CardFace({ item }: { item: ProjectItem }) {
  return (
    <div className="ps-face" style={{ background: item.bg }}>
      {item.image
        ? <img src={item.image} alt="" loading="lazy" draggable={false} onError={e => { e.currentTarget.style.visibility = 'hidden'; }} />
        : item.thumbnail ? <div className="ps-thumb">{item.thumbnail}</div> : null}
    </div>
  );
}

/** Two fanned card stacks on Home. Tapping one opens its project overlay. */
export function ProjectStacks({
  groups,
  onOpen,
  layout = 'row',
}: {
  groups: ProjectGroup[];
  onOpen: (id: ProjectGroupId, from: DOMRect, trigger: HTMLElement) => void;
  /** 'column' stacks the decks vertically with wider cards (phone Work & Play). */
  layout?: 'row' | 'column';
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  return (
    <div className={`ps-row${layout === 'column' ? ' ps-col' : ''}`}>
      {groups.map(g => (
        <button
          key={g.id}
          ref={el => { refs.current[g.id] = el; }}
          type="button"
          className="ps-stack-btn"
          aria-haspopup="dialog"
          aria-label={`${g.label}: ${g.count}. Open`}
          onClick={() => {
            const el = refs.current[g.id];
            const deck = el?.querySelector('.ps-deck');
            if (el && deck) onOpen(g.id, deck.getBoundingClientRect(), el);
          }}
        >
          <span className="ps-deck" aria-hidden="true">
            {g.items.slice(0, 3).map((item, i) => (
              <span key={i} className={`ps-card ps-card-${i}`}><CardFace item={item} /></span>
            )).reverse()}
          </span>
          <span className="ps-label">
            <span className="ps-name">{g.label}</span>
            <span className="ps-count">{g.count} <span aria-hidden="true">→</span></span>
          </span>
        </button>
      ))}
    </div>
  );
}

export { CardFace };

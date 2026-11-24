import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { CardFace } from './ProjectStacks';
import type { ProjectGroup } from './types';
import './floating.css';

// A deck's projects fly out and float over the sheet: the page stays visible
// behind them (lightly washed), the three cards hang at slight angles and bob
// gently. Nothing under them moves. Tap the background, × or Esc and they fly
// back into the deck.

const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const BLOCKED = ['wheel', 'touchstart', 'touchmove', 'touchend', 'gesturestart', 'gesturechange', 'gestureend'] as const;
const FOCUSABLE = 'a[href],button:not([disabled])';
// Resting pose of each card: a little tilt and sideways offset so they read as floating, not listed.
const POSE = [{ r: -2.4, x: 0 }, { r: 1.8, x: 14 }, { r: -1.2, x: 4 }];
// Where each card sits in the deck (matches .ps-card-0/1/2), for the fly-out.
const DECK_TILT = [0, 4, -6];

export function FloatingDeck({ group, trigger, onClose }: { group: ProjectGroup; trigger: HTMLElement; onClose: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const [region, setRegion] = useState(() => sheetRegion());
  const [settled, setSettled] = useState(false);

  // The cards live in the deck while they're out: hide its own copies.
  const deckCards = () => Array.from(trigger.querySelectorAll<HTMLElement>('.ps-card'));

  const fly = (out: boolean) => {
    const root = rootRef.current;
    if (!root) return Promise.resolve();
    const deck = trigger.querySelector('.ps-deck')!.getBoundingClientRect();
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.fd-card'));
    const anims = cards.map((card, i) => {
      const r = card.getBoundingClientRect();
      const dx = deck.left + deck.width / 2 - (r.left + r.width / 2), dy = deck.top + deck.height / 2 - (r.top + r.height / 2);
      const s = Math.min(1, deck.width / r.width);
      const inDeck = `translate(${dx}px, ${dy}px) scale(${s}) rotate(${DECK_TILT[i]}deg) rotateX(55deg)`;
      const pose = `rotate(${POSE[i].r}deg)`;
      // Out: lift off the deck, unfurl flat (rotateX → 0), overshoot a touch past the pose, settle.
      const frames: Keyframe[] = out
        ? [{ transform: inDeck, opacity: 0.6 }, { transform: `translateY(-10px) rotate(${POSE[i].r * 1.8}deg)`, opacity: 1, offset: 0.7 }, { transform: pose, opacity: 1 }]
        : [{ transform: pose, opacity: 1 }, { transform: `translateY(-8px) rotate(${POSE[i].r * 1.6}deg)`, opacity: 1, offset: 0.25 }, { transform: inDeck, opacity: 0.5 }];
      return card.animate(frames, {
        duration: out ? 640 : 420,
        delay: out ? i * 95 : (cards.length - 1 - i) * 70,
        easing: out ? 'cubic-bezier(.2,.9,.25,1)' : 'cubic-bezier(.5,0,.75,.4)',
        fill: 'both',
      });
    });
    return Promise.all(anims.map(a => a.finished.catch(() => undefined))).then(() => undefined);
  };

  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setSettled(false);
    rootRef.current?.classList.add('fd-closing');
    const done = () => { deckCards().forEach(c => { c.style.visibility = ''; }); onClose(); };
    if (reduced()) { done(); return; }
    fly(false).then(done);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  useLayoutEffect(() => {
    deckCards().forEach(c => { c.style.visibility = 'hidden'; });
    if (reduced()) { setSettled(true); return; }
    fly(true).then(() => { if (!closing.current) setSettled(true); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Grid gestures stay out of it; Esc closes; Tab stays inside; follow resizes.
  useEffect(() => {
    const stop = (e: Event) => e.stopPropagation();
    const onKey = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Escape') { e.preventDefault(); requestClose(); return; }
      if (e.key === 'Tab' && rootRef.current) {
        const f = Array.from(rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    const onResize = () => setRegion(sheetRegion());
    BLOCKED.forEach(t => window.addEventListener(t, stop, { capture: true }));
    window.addEventListener('keydown', onKey, { capture: true });
    window.addEventListener('resize', onResize);
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      BLOCKED.forEach(t => window.removeEventListener(t, stop, { capture: true }));
      window.removeEventListener('keydown', onKey, { capture: true });
      window.removeEventListener('resize', onResize);
    };
  }, [requestClose]);

  const stopReact = (e: { stopPropagation(): void }) => e.stopPropagation();

  return createPortal(
    <div
      ref={rootRef}
      className={`fd-root${settled ? ' fd-settled' : ''}`}
      style={{ top: region.top, height: region.height }}
      role="dialog"
      aria-modal="true"
      aria-label={group.heading}
      onPointerDown={stopReact}
      onPointerMove={stopReact}
      onPointerUp={stopReact}
      onClick={stopReact}
    >
      <div className="fd-scrim" onClick={requestClose} />
      <div className="fd-head">
        <span className="fd-chip">{group.heading}</span>
        <button ref={closeRef} type="button" className="fd-close" onClick={requestClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>
      <ul className="fd-cards">
        {group.items.slice(0, 3).map((item, i) => {
          const body = (
            <span className="fd-bob" style={{ animationDelay: `${-i * 1.1}s`, animationDuration: `${3.2 + i * 0.45}s` }}>
              <span className="fd-lift">
                <span className="fd-thumb"><CardFace item={item} /></span>
                <span className="fd-meta">
                  <span className="fd-tag">{item.tag}</span>
                  <span className="fd-title">{item.title}</span>
                  <span className="fd-desc">{item.descriptor}</span>
                  <span className="fd-cta">{group.id === 'work' ? 'Read case study' : 'Try it'} <span aria-hidden="true">→</span></span>
                </span>
              </span>
            </span>
          );
          return (
            <li key={item.link} className="fd-card" style={{ transform: `rotate(${POSE[i].r}deg)`, marginLeft: POSE[i].x }}>
              {item.external
                ? <a href={item.link} target="_blank" rel="noopener noreferrer" className="fd-link">{body}</a>
                : <Link to={item.link} className="fd-link">{body}</Link>}
            </li>
          );
        })}
      </ul>
    </div>,
    document.body,
  );
}

// The open sheet's area (the 80% below his head); falls back to the bottom 80%.
function sheetRegion() {
  const el = document.querySelector('.sh-sheet');
  const h = window.innerHeight;
  const top = el ? Math.max(0, Math.min(h * 0.5, el.getBoundingClientRect().top)) : h * 0.2;
  return { top, height: h - top };
}

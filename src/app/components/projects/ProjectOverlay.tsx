import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { CardFace } from './ProjectStacks';
import type { ProjectGroup } from './types';
import './projects.css';

const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';
// Grid gestures that must not reach Home while the overlay is open.
const BLOCKED = ['wheel', 'touchstart', 'touchmove', 'touchend', 'gesturestart', 'gesturechange', 'gestureend'] as const;

/**
 * Full-screen project list that fans out of a Home stack. Desktop: centred
 * panel. Phone: bottom sheet. While open, the grid gets no wheel, key or
 * touch input.
 */
export function ProjectOverlay({
  group,
  from,
  onClose,
}: {
  group: ProjectGroup;
  from: DOMRect;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const isSheet = typeof window !== 'undefined' && window.innerWidth < 768;

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const root = rootRef.current, panel = panelRef.current;
    if (!root || !panel || reduced()) { onClose(); return; }
    root.classList.add('po-closing');
    panel.animate(
      isSheet ? [{ transform: 'none' }, { transform: 'translateY(100%)' }] : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(12px) scale(.98)' }],
      { duration: 200, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' },
    ).onfinish = onClose;
  }, [onClose, isSheet]);

  // Entrance: scrim + panel in, then each card flies out of the stack.
  useLayoutEffect(() => {
    const root = rootRef.current, panel = panelRef.current;
    if (!root || !panel) return;
    if (reduced()) return;
    panel.animate(
      isSheet ? [{ transform: 'translateY(100%)' }, { transform: 'none' }] : [{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }],
      { duration: isSheet ? 340 : 260, easing: 'cubic-bezier(.2,.9,.25,1)', fill: 'backwards' },
    );
    const fx = from.left + from.width / 2, fy = from.top + from.height / 2;
    root.querySelectorAll<HTMLElement>('.po-card').forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const dx = fx - (r.left + r.width / 2), dy = fy - (r.top + r.height / 2);
      const s = Math.min(1, from.width / r.width);
      card.animate([
        { transform: `translate(${dx}px,${dy}px) scale(${s}) rotate(${(i - 1) * 6}deg)`, opacity: 0.4 },
        { transform: 'none', opacity: 1 },
      ], { duration: 520, delay: 60 + i * 55, easing: 'cubic-bezier(.2,.9,.25,1)', fill: 'backwards' });
    });
  }, [from, isSheet]);

  // Keep the grid out of it; Esc closes; Tab stays inside.
  useEffect(() => {
    const stop = (e: Event) => e.stopPropagation();
    const onKey = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Escape') { e.preventDefault(); requestClose(); return; }
      if (e.key === 'Tab' && rootRef.current) {
        const f = Array.from(rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    BLOCKED.forEach(t => window.addEventListener(t, stop, { capture: true }));
    window.addEventListener('keydown', onKey, { capture: true });
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      BLOCKED.forEach(t => window.removeEventListener(t, stop, { capture: true }));
      window.removeEventListener('keydown', onKey, { capture: true });
    };
  }, [requestClose]);

  // React events bubble out of portals to their React parents — here, the
  // grid's drag handlers. Stop them at the overlay boundary.
  const stopReact = (e: { stopPropagation(): void }) => e.stopPropagation();

  return createPortal(
    <div
      ref={rootRef}
      className={`po-root${isSheet ? ' po-sheet' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="po-title"
      onPointerDown={stopReact}
      onPointerMove={stopReact}
      onPointerUp={stopReact}
      onClick={stopReact}
    >
      <div className="po-scrim" onClick={requestClose} />
      <div ref={panelRef} className="po-panel">
        <div className="po-head">
          <div>
            <h2 id="po-title" className="po-title">{group.heading}</h2>
            <p className="po-sub">{group.sub}</p>
          </div>
          <button ref={closeRef} type="button" className="po-close" onClick={requestClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="po-scroll">
          <ul className="po-grid">
            {group.items.map((item, i) => {
              const body = (
                <>
                  <span className="po-thumb"><CardFace item={item} /></span>
                  <span className="po-meta">
                    <span className="po-tag">{item.tag ?? String(i + 1).padStart(2, '0')}</span>
                    <span className="po-card-title">{item.title}</span>
                    <span className="po-desc">{item.descriptor}</span>
                    <span className="po-cta">{group.id === 'work' ? 'Read case study' : 'Open'} <span aria-hidden="true">→</span></span>
                  </span>
                </>
              );
              return (
                <li key={item.link} className="po-card">
                  {item.external
                    ? <a href={item.link} target="_blank" rel="noopener noreferrer" className="po-link">{body}</a>
                    : <Link to={item.link} className="po-link">{body}</Link>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}

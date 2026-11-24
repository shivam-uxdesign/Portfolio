import { useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

// The right side of an inner page's (invisible) top bar. Pages put their own
// controls there with <NavRight>; the bar renders the slot.
let slot: HTMLElement | null = null;
const subs = new Set<() => void>();
export function setNavSlot(el: HTMLElement | null) {
  if (slot === el) return;
  slot = el; subs.forEach(fn => fn());
}
const sub = (fn: () => void) => { subs.add(fn); return () => { subs.delete(fn); }; };

export function NavRight({ children }: { children: ReactNode }) {
  const el = useSyncExternalStore(sub, () => slot, () => null);
  return el ? createPortal(children, el) : null;
}

/** A pill button for the bar. */
export function NavPill({ children, onClick, active, label, className = '' }: {
  children: ReactNode; onClick: () => void; active?: boolean; label?: string; className?: string;
}) {
  return (
    <button type="button" className={`pc-pill${active ? ' on' : ''} ${className}`} onClick={onClick} aria-label={label} aria-pressed={active}>
      {children}
    </button>
  );
}

/** A small segmented switch for the bar. */
export function NavSegments<T extends string>({ options, value, onChange, label }: {
  options: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string;
}) {
  return (
    <div className="pc-seg" role="radiogroup" aria-label={label}>
      {options.map(o => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className={value === o.id ? 'on' : ''} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

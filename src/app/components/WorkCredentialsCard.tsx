// Education. (The download lives once, in the Resume header.)
const EDUCATION = ['B.FA — JJ School of Art, Mumbai', 'M.Des — NIFT Delhi'];

export function WorkCredentialsCard() {
  return (
    <div className="bg-background rounded-2xl border border-border p-3.5 w-full h-full flex flex-col gap-2.5">
      <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground">Education</p>
      <ul className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-1.5">
        {EDUCATION.map(item => (
          <li key={item} className="flex items-center text-[11px] leading-snug text-muted-foreground bg-foreground/5 border border-border/40 rounded-lg px-3 py-1.5">
            {item}
          </li>
        ))}
      </ul>
      <p className="hidden md:block border-l-2 border-border pl-2 text-[11px] italic text-muted-foreground leading-snug">
        Built on an art foundation, refined through systems thinking.
      </p>
    </div>
  );
}

import { Download } from 'lucide-react';

export function WorkCredentialsCard() {
  const education = [
    'B.FA — JJ School of Art, Mumbai',
    'M.Des — NIFT Delhi',
  ];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Shivam_Sehgal_Resume.pdf';
    link.click();
  };

  return (
    <div className="bg-background rounded-2xl border border-border p-3.5 w-full h-full flex-1 flex flex-col gap-2.5">
      {/* Education */}
      <div className="flex-1 flex flex-col">
        <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground mb-1.5">
          EDUCATION
        </p>
        <div className="flex flex-col gap-1.5 flex-1">
          {education.map((item, idx) => (
            <span
              key={idx}
              className="flex-1 flex items-center text-[11px] text-muted-foreground bg-foreground/5 border border-border/40 rounded-lg px-3 py-1.5"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div className="border-l-2 border-border pl-2">
        <p className="text-[11px] italic text-muted-foreground leading-snug">
          Built on an art foundation, refined through systems thinking.
        </p>
      </div>

      {/* CTA Button — pinned to bottom */}
      <button
        onClick={handleDownload}
        className="w-full bg-primary text-primary-foreground rounded-xl py-2 flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Download className="w-3 h-3" strokeWidth={1.5} />
        <span className="text-[12px] font-medium">Download Resume</span>
      </button>
    </div>
  );
}
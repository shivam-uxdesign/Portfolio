import { MapPin, Coffee } from 'lucide-react';
import { useEffect, useState } from 'react';

function getISTHour(): number {
  return parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      hour12: false,
    }).format(new Date()),
    10
  );
}

function getStatusByHour(hour: number): string {
  if (hour >= 23 || hour < 6)  return 'Probably dreaming about kerning and gradients right now.';
  if (hour < 7)                return 'Probably hitting snooze for the third time right now.';
  if (hour < 8)                return 'Probably rushing through morning chai right now.';
  if (hour < 9)                return 'Probably on the commute screaming Arijit Singh songs right now.';
  if (hour < 12)               return 'Probably deep in Figma with 47 tabs open right now.';
  if (hour < 13)               return 'Probably debating lunch options for the last 20 minutes right now.';
  if (hour < 15)               return 'Probably in a design review nodding enthusiastically right now.';
  if (hour < 17)               return 'Probably adjusting spacing by 2px right now.';
  if (hour < 18)               return 'Probably wrapping up and pretending the work is done right now.';
  if (hour < 19)               return 'Probably on the ride home screaming Bollywood songs right now.';
  if (hour < 21)               return 'Probably sketching random ideas on a napkin right now.';
  return                              'Probably down a rabbit hole of design inspiration right now.';
}

export function IdentityCard() {
  const [currentTime, setCurrentTime] = useState('');
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const istTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(now);
      setCurrentTime(istTime);
      setStatusText(getStatusByHour(getISTHour()));
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background rounded-2xl border border-border p-3.5 w-full flex flex-col">
      {/* Header — experience timeline */}
      <div className="mb-2.5">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-[8px] h-[8px] rounded-full bg-[#1D9E75] flex-shrink-0" />
            <h2 className="text-[13px] font-medium text-foreground">Rupyy — Product Designer</h2>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap ml-4">
            Oct 2023 – Present
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground ml-4 leading-snug mt-0.5">
          Design + PM-adjacent ownership: internal tooling, design systems, mobile UX
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mb-2.5" />

      {/* Content Sections */}
      <div className="flex flex-col space-y-2">
        {/* Current Focus */}
        <div>
          <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground mb-0.5">
            CURRENT FOCUS
          </p>
          <p className="text-[12px] text-foreground leading-snug">
            Scaling design systems & simplifying complex workflows
          </p>
        </div>

        {/* Desk Right Now */}
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Coffee className="w-[10px] h-[10px] text-muted-foreground" strokeWidth={1.5} />
            <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
              DESK RIGHT NOW
            </p>
          </div>
          <p className="text-[12px] text-foreground leading-snug">
            Coffee, Figma tabs, and too many sticky notes
          </p>
        </div>

        {/* Learning */}
        <div>
          <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground mb-0.5">
            LEARNING
          </p>
          <p className="text-[12px] text-foreground leading-snug">
            3D in Spline + cinematic UI transitions
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2">
        <div className="h-px bg-border my-2" />
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-[10px] h-[10px] text-muted-foreground" strokeWidth={1.5} />
              <p className="text-[11px] text-muted-foreground">Based in India</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground">IST ·</span>
              <span className="text-[12px] font-medium text-foreground">{currentTime}</span>
            </div>
          </div>
          <p className="text-[10px] italic text-muted-foreground/60 text-center leading-snug">
            {statusText}
          </p>
        </div>
    </div>
  );
}
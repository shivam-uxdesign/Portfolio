import { IdentityCard } from './IdentityCard';
import { WorkCredentialsCard } from './WorkCredentialsCard';
import { ExpertiseScroller } from './ExpertiseScroller';

export function ResumeCards() {
  return (
    <div className="flex flex-col gap-2 w-full flex-1 lg:h-full">
      <ExpertiseScroller />
      <IdentityCard />
      <WorkCredentialsCard />
    </div>
  );
}

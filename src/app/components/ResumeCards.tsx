import { IdentityCard } from './IdentityCard';
import { WorkCredentialsCard } from './WorkCredentialsCard';
import { ExpertiseScroller } from './ExpertiseScroller';
import './cells/cells.css';

// Phones: what I do best + the role card (education folded into it).
// md: one column. lg+: two columns — what I do best and education on the left,
// the role on the right. Cards size to their content.
export function ResumeCards() {
  return (
    <div className="rs-cards grid w-full gap-2 md:gap-3 lg:grid-cols-2 content-start">
      <div className="lg:col-start-1 lg:row-start-1"><ExpertiseScroller /></div>
      <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2"><IdentityCard /></div>
      <div className="hidden md:block lg:col-start-1 lg:row-start-2"><WorkCredentialsCard /></div>
    </div>
  );
}

import type { ReactNode } from 'react';

export interface ProjectItem {
  title: string;
  descriptor: string;
  link: string;
  external?: boolean;
  /** Overrides the default call to action. */
  cta?: string;
  /** Card background behind the thumbnail. */
  bg: string;
  /** Either a drawn thumbnail component or an image URL. */
  thumbnail?: ReactNode;
  image?: string;
  tag?: string;
}

export type ProjectGroupId = 'work' | 'fun';

export interface ProjectGroup {
  id: ProjectGroupId;
  /** Stack label on Home, e.g. "Work". */
  label: string;
  /** Small line under the label, e.g. "3 case studies". */
  count: string;
  /** Overlay heading + subheading. */
  heading: string;
  sub: string;
  items: ProjectItem[];
}

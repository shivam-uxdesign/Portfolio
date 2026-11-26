import type { ReactNode } from 'react';

/** short = [before, highlighted, after] */
export interface Impact { big: string; sub: string; note?: string; short?: [string, string, string] }

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
  /** The result, for the first glance: a big figure, what it measures, and a short line for small tiles. */
  impact?: Impact;
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

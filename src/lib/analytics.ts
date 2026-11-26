// No-ops safely if VITE_POSTHOG_KEY isn't set (e.g. local dev without a .env.local) —
// analytics only turns on once real keys are provided. PostHog is a large library, so it
// downloads only then, after the page is up, and events sent before it arrives wait in a queue.
type PostHog = typeof import('posthog-js').default;

const KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || 'https://us.i.posthog.com';

let ph: PostHog | null = null;
let loading = false;
const queue: [string, Record<string, unknown> | undefined][] = [];

export function initAnalytics() {
  if (!KEY || loading) return;
  loading = true;
  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(KEY, {
      api_host: HOST,
      capture_pageview: false, // pageviews/cell-views are captured manually — see trackPageview/trackEvent
      capture_pageleave: true,
      person_profiles: 'identified_only',
    });
    ph = posthog;
    queue.splice(0).forEach(([n, p]) => posthog.capture(n, p));
  }).catch(() => {});
}

function capture(name: string, props?: Record<string, unknown>) {
  if (!KEY) return;
  if (ph) ph.capture(name, props); else queue.push([name, props]);
}

export function trackPageview(path: string) {
  capture('$pageview', { $current_url: path });
}

export function trackEvent(name: string, props?: Record<string, unknown>) {
  capture(name, props);
}

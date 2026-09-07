import posthog from 'posthog-js';

// No-ops safely if VITE_POSTHOG_KEY isn't set (e.g. local dev without a .env.local) —
// analytics only turns on once real keys are provided.
const KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || 'https://us.i.posthog.com';

let initialized = false;

export function initAnalytics() {
  if (!KEY || initialized) return;
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: false, // pageviews/cell-views are captured manually — see trackPageview/trackEvent
    capture_pageleave: true,
    person_profiles: 'identified_only',
  });
  initialized = true;
}

export function trackPageview(path: string) {
  if (!KEY) return;
  posthog.capture('$pageview', { $current_url: path });
}

export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (!KEY) return;
  posthog.capture(name, props);
}

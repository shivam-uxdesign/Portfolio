import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { trackPageview } from '../../lib/analytics';

export function RootLayout() {
  const location = useLocation();

  useEffect(() => {
    trackPageview(location.pathname + location.search + location.hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, location.hash]);

  return <Outlet />;
}

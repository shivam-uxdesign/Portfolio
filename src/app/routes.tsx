import { createBrowserRouter } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { ErrorPage } from './pages/ErrorPage';
import { Home } from './pages/Home';
import { GridPanelPage } from './pages/GridPanelPage';
import { BMDashboardCaseStudy } from './pages/BMDashboardCaseStudy';
import { DesignSystemCaseStudy } from './pages/DesignSystemCaseStudy';
import { MobileAppCaseStudy } from './pages/MobileAppCaseStudy';
import { ComicsPage } from './pages/ComicsPage';
import { DrawingsPage } from './pages/DrawingsPage';
import { CoolStuffPage } from './pages/CoolStuffPage';
import { MusicPage } from './pages/MusicPage';
import { MoviesPage } from './pages/MoviesPage';
import { BooksPage } from './pages/BooksPage';
import { StackPage } from './pages/StackPage';
import { WhatiswrongwithinPage } from './pages/WhatiswrongwithinPage';
import { WhatshouldieatPage } from './pages/WhatshouldieatPage';
import { NightmareRiderPage } from './pages/NightmareRiderPage';

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        Component: Home,
      },
      {
        path: '/grid-panel',
        Component: GridPanelPage,
      },
      {
        path: '/case-study/bm-dashboard',
        Component: BMDashboardCaseStudy,
      },
      {
        path: '/case-study/design-system',
        Component: DesignSystemCaseStudy,
      },
      {
        path: '/case-study/mobile-app',
        Component: MobileAppCaseStudy,
      },
      {
        path: '/comics',
        Component: ComicsPage,
      },
      {
        path: '/drawings',
        Component: DrawingsPage,
      },
      {
        path: '/cool-stuff',
        Component: CoolStuffPage,
      },
      {
        path: '/music',
        Component: MusicPage,
      },
      {
        path: '/movies',
        Component: MoviesPage,
      },
      {
        path: '/books',
        Component: BooksPage,
      },
      {
        path: '/stack',
        Component: StackPage,
      },
      {
        path: '/play/whatiswrongwithin',
        Component: WhatiswrongwithinPage,
      },
      {
        path: '/play/whatshouldieat',
        Component: WhatshouldieatPage,
      },
      {
        path: '/play/nightmare-rider',
        Component: NightmareRiderPage,
      },
      {
        path: '*',
        Component: ErrorPage,
      },
    ],
  },
]);

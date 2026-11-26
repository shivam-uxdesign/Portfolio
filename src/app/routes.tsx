import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { ErrorPage } from './pages/ErrorPage';
import { SheetHome as Home } from './pages/SheetHome';

// Every page but Home loads on demand, so the first visit downloads only what Home needs.
type Mod = Record<string, React.ComponentType>;
const page = (load: () => Promise<unknown>, name: string) => async () => ({ Component: ((await load()) as Mod)[name] });

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
        // Placeholder case study, replaced by the real one.
        path: '/case-study/bm-dashboard',
        element: <Navigate to="/case-study/sales-case-card" replace />,
      },
      {
        // Placeholder case study, replaced by the real one.
        path: '/case-study/design-system',
        element: <Navigate to="/case-study/design-kit" replace />,
      },
      {
        // Placeholder case study, replaced by the real one.
        path: '/case-study/mobile-app',
        element: <Navigate to="/case-study/journey-studio" replace />,
      },
      { path: '/case-study/sales-case-card', lazy: page(() => import('./pages/WorkCaseStudies'), 'SalesCaseCardPage') },
      { path: '/case-study/rupyy-design-system', lazy: page(() => import('./pages/WorkCaseStudies'), 'RupyySystemPage') },
      { path: '/case-study/journey-studio', lazy: page(() => import('./pages/WorkCaseStudies'), 'JourneyStudioPage') },
      { path: '/case-study/design-kit', lazy: page(() => import('./pages/WorkCaseStudies'), 'DesignKitPage') },
      { path: '/case-study/illustration-studio', lazy: page(() => import('./pages/WorkCaseStudies'), 'IllustrationStudioPage') },
      { path: '/case-study/keppo-moto', lazy: page(() => import('./pages/WorkCaseStudies'), 'KeppoMotoPage') },
      { path: '/case-study/keppo-journal', lazy: page(() => import('./pages/WorkCaseStudies'), 'KeppoJournalPage') },
      {
        path: '/comics',
        lazy: page(() => import('./pages/ComicsPage'), 'ComicsPage'),
      },
      {
        path: '/drawings',
        lazy: page(() => import('./pages/DrawingsPage'), 'DrawingsPage'),
      },
      {
        path: '/cool-stuff',
        lazy: page(() => import('./pages/CoolStuffPage'), 'CoolStuffPage'),
      },
      {
        path: '/music',
        lazy: page(() => import('./pages/MusicPage'), 'MusicPage'),
      },
      {
        path: '/movies',
        lazy: page(() => import('./pages/MoviesPage'), 'MoviesPage'),
      },
      {
        path: '/books',
        lazy: page(() => import('./pages/BooksPage'), 'BooksPage'),
      },
      {
        path: '/stack',
        lazy: page(() => import('./pages/StackPage'), 'StackPage'),
      },
      {
        path: '/play/whatiswrongwithin',
        lazy: page(() => import('./pages/WhatiswrongwithinPage'), 'WhatiswrongwithinPage'),
      },
      {
        // Replaced by Keppo Journal.
        path: '/play/whatshouldieat',
        element: <Navigate to="/case-study/keppo-journal" replace />,
      },
      {
        path: '*',
        Component: ErrorPage,
      },
    ],
  },
]);

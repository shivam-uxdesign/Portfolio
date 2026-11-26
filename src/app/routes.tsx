import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { ErrorPage } from './pages/ErrorPage';
import { SheetHome as Home } from './pages/SheetHome';
import { SalesCaseCardPage, JourneyStudioPage, DesignKitPage, IllustrationStudioPage, KeppoMotoPage, KeppoJournalPage, RupyySystemPage } from './pages/WorkCaseStudies';
import { ComicsPage } from './pages/ComicsPage';
import { DrawingsPage } from './pages/DrawingsPage';
import { CoolStuffPage } from './pages/CoolStuffPage';
import { MusicPage } from './pages/MusicPage';
import { MoviesPage } from './pages/MoviesPage';
import { BooksPage } from './pages/BooksPage';
import { StackPage } from './pages/StackPage';
import { WhatiswrongwithinPage } from './pages/WhatiswrongwithinPage';

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
      { path: '/case-study/sales-case-card', Component: SalesCaseCardPage },
      { path: '/case-study/rupyy-design-system', Component: RupyySystemPage },
      { path: '/case-study/journey-studio', Component: JourneyStudioPage },
      { path: '/case-study/design-kit', Component: DesignKitPage },
      { path: '/case-study/illustration-studio', Component: IllustrationStudioPage },
      { path: '/case-study/keppo-moto', Component: KeppoMotoPage },
      { path: '/case-study/keppo-journal', Component: KeppoJournalPage },
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

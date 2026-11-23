import { RouterProvider } from 'react-router';
import { MotionConfig } from 'motion/react';
import { router } from './routes';

export default function App() {
  // reducedMotion="user" makes every motion component honour the OS-level
  // prefers-reduced-motion setting (transform/layout animations are disabled).
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  );
}

import { Link, isRouteErrorResponse, useRouteError } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export function ErrorPage() {
  const error = useRouteError();

  let code = '404';
  let title = 'Page not found';
  let message = "The page you're looking for doesn't exist or may have moved.";

  if (isRouteErrorResponse(error)) {
    code = String(error.status);
    if (error.status !== 404) {
      title = 'Something went wrong';
      message = error.statusText || 'An unexpected error occurred while loading this page.';
    }
  } else if (error instanceof Error) {
    code = '500';
    title = 'Something went wrong';
    message = error.message || 'An unexpected error occurred while loading this page.';
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-8 text-center gap-6">
      <p className="text-[13px] tracking-[0.1em] uppercase text-muted-foreground">{code}</p>
      <h1 className="text-[40px] md:text-[56px] leading-[1.05] text-foreground max-w-xl">{title}</h1>
      <p className="text-[16px] text-muted-foreground max-w-md">{message}</p>
      <Link
        to="/"
        className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-medium tracking-[0.06em] bg-foreground text-background hover:opacity-80 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>
    </div>
  );
}

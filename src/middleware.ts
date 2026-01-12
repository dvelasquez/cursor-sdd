import { clerkMiddleware } from '@clerk/astro/server';

// For this phase, no routes are protected
// Middleware redirects authenticated users away from sign-in/sign-up pages
export const onRequest = clerkMiddleware(async (auth, context, next) => {
  const { userId } = auth();
  const url = new URL(context.request.url);

  // If user is authenticated and trying to access sign-in/sign-up, redirect to profile
  if (userId && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up'))) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/profile',
      },
    });
  }
  return next();
});

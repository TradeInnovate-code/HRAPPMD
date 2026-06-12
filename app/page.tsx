import { redirect } from 'next/navigation';
import { isDevAuthMode, getDevSession } from '@/lib/auth/dev-auth';

export default async function RootPage() {
  let isLoggedIn = false;

  if (isDevAuthMode()) {
    isLoggedIn = !!(await getDevSession());
  } else {
    const { auth } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    isLoggedIn = !!userId;
  }

  if (isLoggedIn) {
    redirect('/dashboard');
  }

  // Render marketing page for unauthenticated users
  const { default: MarketingPage } = await import('./(marketing)/page');
  return <MarketingPage />;
}

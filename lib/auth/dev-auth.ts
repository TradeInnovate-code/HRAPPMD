import { cookies } from 'next/headers';

const DEV_AUTH_COOKIE = 'hri-dev-auth';
const DEV_USER = {
  clerkId: 'dev_admin',
  email: 'admin@hri.local',
  name: 'Admin',
};

/** True when Clerk keys are not configured */
export function isDevAuthMode(): boolean {
  return !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
}

/** Read the dev session cookie. Returns the dev clerkId or null. */
export async function getDevSession(): Promise<string | null> {
  if (!isDevAuthMode()) return null;
  const store = await cookies();
  const value = store.get(DEV_AUTH_COOKIE)?.value;
  return value === 'true' ? DEV_USER.clerkId : null;
}

/** Validate dev credentials. Only works in dev-auth mode. */
export function validateDevCredentials(username: string, password: string): boolean {
  if (!isDevAuthMode()) return false;
  return username === 'admin' && password === 'admin';
}

export { DEV_AUTH_COOKIE, DEV_USER };

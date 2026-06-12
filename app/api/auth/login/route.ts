import { NextRequest, NextResponse } from 'next/server';
import { validateDevCredentials, DEV_AUTH_COOKIE } from '@/lib/auth/dev-auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body ?? {};

  if (typeof username !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  if (!validateDevCredentials(username, password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(DEV_AUTH_COOKIE, 'true', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

import { NextResponse } from 'next/server';
import { DEV_AUTH_COOKIE } from '@/lib/auth/dev-auth';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(DEV_AUTH_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}

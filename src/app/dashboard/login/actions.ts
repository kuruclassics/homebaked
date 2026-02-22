'use server';

import { cookies } from 'next/headers';
import { verifyPassword, createSession, SESSION_COOKIE } from '@/lib/auth';

export async function login(password: string): Promise<{ error?: string }> {
  const valid = await verifyPassword(password);
  if (!valid) {
    return { error: 'Invalid password' };
  }

  const token = await createSession();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return {};
}

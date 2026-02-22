import { SignJWT, jwtVerify } from 'jose';
import { compare } from 'bcryptjs';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'dashboard_session';
const EXPIRY = '7d';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export async function verifyPassword(password: string): Promise<boolean> {
  const hash = process.env.DASHBOARD_PASSWORD_HASH;
  if (!hash) throw new Error('DASHBOARD_PASSWORD_HASH is not set');
  return compare(password, hash);
}

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecret());
  return token;
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySession(token);
}

export { SESSION_COOKIE };

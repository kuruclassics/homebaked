import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const result = await db.insert(leads).values({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
  }).returning();

  return NextResponse.json(result[0], { status: 201 });
}

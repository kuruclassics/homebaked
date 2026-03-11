import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { scopeMessages } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(scopeMessages)
    .where(eq(scopeMessages.proposalId, Number(id)))
    .orderBy(asc(scopeMessages.createdAt));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const messages = Array.isArray(body) ? body : [body];

  const results = [];
  for (const msg of messages) {
    const result = await db.insert(scopeMessages).values({
      proposalId: Number(id),
      role: msg.role,
      content: msg.content,
      metadata: msg.metadata ? JSON.stringify(msg.metadata) : null,
    }).returning();
    results.push(result[0]);
  }

  return NextResponse.json(results, { status: 201 });
}

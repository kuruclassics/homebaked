import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { proposals, leads } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

export async function GET() {
  const rows = await db
    .select({
      id: proposals.id,
      leadId: proposals.leadId,
      slug: proposals.slug,
      title: proposals.title,
      status: proposals.status,
      createdAt: proposals.createdAt,
      updatedAt: proposals.updatedAt,
      leadName: leads.name,
      leadEmail: leads.email,
    })
    .from(proposals)
    .leftJoin(leads, eq(proposals.leadId, leads.id))
    .orderBy(desc(proposals.createdAt));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { leadId, title } = body;
  if (!leadId || !title) {
    return NextResponse.json({ error: 'leadId and title are required' }, { status: 400 });
  }
  const slug = generateSlug(title);
  const result = await db.insert(proposals).values({
    leadId,
    title,
    slug,
    status: 'draft',
  }).returning();
  return NextResponse.json(result[0], { status: 201 });
}

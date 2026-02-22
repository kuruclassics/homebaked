import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, clients, timeEntries, financialEntries } from '@/lib/db/schema';
import { eq, sum } from 'drizzle-orm';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectId = Number(id);

  const rows = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      clientId: projects.clientId,
      clientName: clients.name,
      type: projects.type,
      stage: projects.stage,
      githubRepoUrl: projects.githubRepoUrl,
      hourlyRate: projects.hourlyRate,
      fixedPrice: projects.fixedPrice,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .where(eq(projects.id, projectId));

  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const [hoursResult] = await db
    .select({ total: sum(timeEntries.hours) })
    .from(timeEntries)
    .where(eq(timeEntries.projectId, projectId));

  const [revenueResult] = await db
    .select({ total: sum(financialEntries.amount) })
    .from(financialEntries)
    .where(eq(financialEntries.projectId, projectId));

  return NextResponse.json({
    ...rows[0],
    totalHours: Number(hoursResult?.total ?? 0),
    totalRevenue: Number(revenueResult?.total ?? 0),
  });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const result = await db.update(projects).set({
    name: body.name,
    description: body.description || null,
    clientId: body.clientId || null,
    type: body.type,
    stage: body.stage,
    githubRepoUrl: body.githubRepoUrl || null,
    hourlyRate: body.hourlyRate ?? null,
    fixedPrice: body.fixedPrice ?? null,
    updatedAt: new Date().toISOString(),
  }).where(eq(projects.id, Number(id))).returning();
  if (!result.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(result[0]);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(projects).where(eq(projects.id, Number(id)));
  return NextResponse.json({ ok: true });
}

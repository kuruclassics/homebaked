import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, clients } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
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
    .orderBy(desc(projects.createdAt));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await db.insert(projects).values({
    name: body.name,
    description: body.description || null,
    clientId: body.clientId || null,
    type: body.type || 'client_project',
    stage: body.stage || 'lead',
    githubRepoUrl: body.githubRepoUrl || null,
    hourlyRate: body.hourlyRate || null,
    fixedPrice: body.fixedPrice || null,
  }).returning();
  return NextResponse.json(result[0], { status: 201 });
}

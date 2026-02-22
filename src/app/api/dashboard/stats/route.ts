import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, clients, timeEntries, financialEntries } from '@/lib/db/schema';
import { eq, sql, and, gte } from 'drizzle-orm';

export async function GET() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

  // Active projects count
  const activeProjects = await db
    .select({ count: sql<number>`count(*)` })
    .from(projects)
    .where(eq(projects.stage, 'active'));

  // Total clients
  const totalClients = await db
    .select({ count: sql<number>`count(*)` })
    .from(clients);

  // Hours this month
  const hoursMTD = await db
    .select({ total: sql<number>`coalesce(sum(${timeEntries.hours}), 0)` })
    .from(timeEntries)
    .where(gte(timeEntries.date, monthStart));

  // Revenue this month (payments only)
  const revenueMTD = await db
    .select({ total: sql<number>`coalesce(sum(${financialEntries.amount}), 0)` })
    .from(financialEntries)
    .where(
      and(
        eq(financialEntries.type, 'payment'),
        gte(financialEntries.date, monthStart)
      )
    );

  // All-time totals
  const totalHours = await db
    .select({ total: sql<number>`coalesce(sum(${timeEntries.hours}), 0)` })
    .from(timeEntries);

  const totalRevenue = await db
    .select({ total: sql<number>`coalesce(sum(${financialEntries.amount}), 0)` })
    .from(financialEntries)
    .where(eq(financialEntries.type, 'payment'));

  // Per-project profitability
  const projectStats = await db
    .select({
      id: projects.id,
      name: projects.name,
      stage: projects.stage,
      hourlyRate: projects.hourlyRate,
      hours: sql<number>`coalesce(sum(${timeEntries.hours}), 0)`,
    })
    .from(projects)
    .leftJoin(timeEntries, eq(projects.id, timeEntries.projectId))
    .groupBy(projects.id);

  const projectRevenues = await db
    .select({
      projectId: financialEntries.projectId,
      revenue: sql<number>`coalesce(sum(${financialEntries.amount}), 0)`,
    })
    .from(financialEntries)
    .where(eq(financialEntries.type, 'payment'))
    .groupBy(financialEntries.projectId);

  const revenueMap = new Map(projectRevenues.map((r) => [r.projectId, Number(r.revenue)]));

  const profitability = projectStats.map((p) => ({
    id: p.id,
    name: p.name,
    stage: p.stage,
    hours: Number(p.hours),
    revenue: revenueMap.get(p.id) ?? 0,
    effectiveRate: Number(p.hours) > 0 ? (revenueMap.get(p.id) ?? 0) / Number(p.hours) : 0,
  }));

  // All projects for pipeline
  const allProjects = await db
    .select({
      id: projects.id,
      name: projects.name,
      clientName: clients.name,
      type: projects.type,
      stage: projects.stage,
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id));

  const effectiveRate = Number(totalHours[0].total) > 0
    ? Number(totalRevenue[0].total) / Number(totalHours[0].total)
    : 0;

  return NextResponse.json({
    activeProjects: Number(activeProjects[0].count),
    totalClients: Number(totalClients[0].count),
    hoursMTD: Number(hoursMTD[0].total),
    revenueMTD: Number(revenueMTD[0].total),
    totalHours: Number(totalHours[0].total),
    totalRevenue: Number(totalRevenue[0].total),
    effectiveRate,
    profitability,
    projects: allProjects,
  });
}

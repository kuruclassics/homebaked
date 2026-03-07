/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'leads.json');

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status, note } = await request.json();
  const leads: any[] = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  leads[idx].outreach_status = status;
  leads[idx].last_contact_date = new Date().toISOString().split('T')[0];
  leads[idx].activity_log.push({
    date: new Date().toISOString(),
    action: `Status changed to ${status}`,
    note: note || undefined,
  });

  fs.writeFileSync(DATA_PATH, JSON.stringify(leads, null, 2));
  return NextResponse.json(leads[idx]);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'leads.json');
const TMP_PATH = '/tmp/leads.json';

function getDataPath() {
  if (fs.existsSync(TMP_PATH)) return TMP_PATH;
  return DATA_PATH;
}

function getLeads(): any[] {
  return JSON.parse(fs.readFileSync(getDataPath(), 'utf-8'));
}

function saveLeads(leads: any[]) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(leads, null, 2));
  } catch {
    fs.writeFileSync(TMP_PATH, JSON.stringify(leads, null, 2));
  }
}

export async function GET() {
  return NextResponse.json(getLeads());
}

export async function PUT(request: Request) {
  const updated = await request.json();
  const leads = getLeads();
  const idx = leads.findIndex((l) => l.id === updated.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  leads[idx] = { ...leads[idx], ...updated };
  saveLeads(leads);
  return NextResponse.json(leads[idx]);
}

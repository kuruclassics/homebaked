import { NextRequest } from 'next/server';
import { convertToModelMessages, streamText, tool, UIMessage, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { db } from '@/lib/db';
import { proposals, leads, proposalFiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proposalId = Number(id);

  // Load proposal + lead + files for context
  const [proposal] = await db
    .select({
      title: proposals.title,
      status: proposals.status,
      internalPrd: proposals.internalPrd,
      clientPrd: proposals.clientPrd,
      timeline: proposals.timeline,
      quote: proposals.quote,
      leadId: proposals.leadId,
    })
    .from(proposals)
    .where(eq(proposals.id, proposalId));

  if (!proposal) {
    return new Response(JSON.stringify({ error: 'Proposal not found' }), { status: 404 });
  }

  const [lead] = await db
    .select({ name: leads.name, email: leads.email, message: leads.message })
    .from(leads)
    .where(eq(leads.id, proposal.leadId));

  const files = await db
    .select({ filename: proposalFiles.filename, textContent: proposalFiles.textContent, blobUrl: proposalFiles.blobUrl })
    .from(proposalFiles)
    .where(eq(proposalFiles.proposalId, proposalId));

  const systemPrompt = buildSystemPrompt(proposal, lead, files);

  let messages: UIMessage[];
  try {
    const body = await request.json();
    messages = body.messages;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools: {
      generateInternalPrd: tool({
        description: 'Generate or update the internal technical PRD document',
        inputSchema: z.object({
          content: z.string().describe('The full internal PRD content in markdown format'),
        }),
        execute: async ({ content }) => {
          await db.update(proposals).set({
            internalPrd: content,
            updatedAt: new Date().toISOString(),
          }).where(eq(proposals.id, proposalId));
          return { success: true, artifact: 'internalPrd' };
        },
      }),
      generateClientPrd: tool({
        description: 'Generate or update the client-facing overview PRD document',
        inputSchema: z.object({
          content: z.string().describe('The full client PRD content in markdown format'),
        }),
        execute: async ({ content }) => {
          await db.update(proposals).set({
            clientPrd: content,
            updatedAt: new Date().toISOString(),
          }).where(eq(proposals.id, proposalId));
          return { success: true, artifact: 'clientPrd' };
        },
      }),
      generateTimeline: tool({
        description: 'Generate or update the project timeline with phases and milestones',
        inputSchema: z.object({
          phases: z.array(z.object({
            phase: z.string(),
            description: z.string(),
            weeks: z.number(),
            milestones: z.array(z.string()),
          })).describe('Array of project phases'),
        }),
        execute: async ({ phases }) => {
          await db.update(proposals).set({
            timeline: JSON.stringify(phases),
            updatedAt: new Date().toISOString(),
          }).where(eq(proposals.id, proposalId));
          return { success: true, artifact: 'timeline' };
        },
      }),
      generateQuote: tool({
        description: 'Generate or update the project quote with line items',
        inputSchema: z.object({
          lineItems: z.array(z.object({
            name: z.string(),
            description: z.string(),
            amount: z.number(),
          })).describe('Line items for the quote'),
          notes: z.string().describe('Additional notes, assumptions, or caveats'),
        }),
        execute: async ({ lineItems, notes }) => {
          await db.update(proposals).set({
            quote: JSON.stringify({ lineItems, notes }),
            updatedAt: new Date().toISOString(),
          }).where(eq(proposals.id, proposalId));
          return { success: true, artifact: 'quote' };
        },
      }),
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}

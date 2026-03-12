'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ArrowLeft, Send, Paperclip, Copy, ExternalLink, Check, Pencil, X, FileText, Upload, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { upload } from '@vercel/blob/client';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import StatusBadge from '@/components/dashboard/StatusBadge';

interface Proposal {
  id: number;
  leadId: number;
  slug: string;
  title: string;
  status: string;
  internalPrd: string | null;
  clientPrd: string | null;
  timeline: string | null;
  quote: string | null;
  clientTimelineOverride: string | null;
  clientQuoteOverride: string | null;
  leadName: string;
  leadEmail: string;
  leadMessage: string;
}

interface UploadedFile {
  id: number;
  filename: string;
  sizeBytes: number;
  createdAt: string;
}

interface SavedMessage {
  id: number;
  role: string;
  content: string;
}

const STATUSES = ['draft', 'ready', 'sent', 'archived'];

const TOOL_LABELS: Record<string, string> = {
  generateInternalPrd: 'Internal PRD',
  generateClientPrd: 'Client PRD',
  generateTimeline: 'Timeline',
  generateQuote: 'Quote',
};

export default function ScopingPage() {
  const { id: leadId, proposalId } = useParams<{ id: string; proposalId: string }>();
  const router = useRouter();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState<'clientPrd' | 'internalPrd' | 'timeline' | 'quote'>('clientPrd');
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [initialMessages, setInitialMessages] = useState<SavedMessage[] | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProposal = useCallback(async () => {
    const res = await fetch(`/api/dashboard/proposals/${proposalId}`);
    if (res.ok) setProposal(await res.json());
  }, [proposalId]);

  const fetchFiles = useCallback(async () => {
    const res = await fetch(`/api/dashboard/proposals/${proposalId}/files`);
    if (res.ok) setFiles(await res.json());
  }, [proposalId]);

  // Load persisted messages
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/dashboard/proposals/${proposalId}/messages`);
      if (!res.ok) { setInitialMessages([]); return; }
      const saved = await res.json();
      setInitialMessages(saved);
    })();
  }, [proposalId]);

  useEffect(() => { fetchProposal(); fetchFiles(); }, [fetchProposal, fetchFiles]);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: `/api/dashboard/proposals/${proposalId}/chat` }),
    [proposalId],
  );

  // Merge consecutive same-role messages (tool-call persistence strips tool parts,
  // leaving consecutive assistant messages which breaks Anthropic's alternation rule)
  const mappedInitialMessages = useMemo(() => {
    if (!initialMessages) return undefined;
    const merged: { id: string; role: 'user' | 'assistant'; parts: { type: 'text'; text: string }[]; createdAt: Date }[] = [];
    for (const m of initialMessages) {
      const prev = merged[merged.length - 1];
      if (prev && prev.role === m.role) {
        // Merge into previous message
        prev.parts[0] = { type: 'text' as const, text: prev.parts[0].text + '\n\n' + m.content };
      } else {
        merged.push({
          id: String(m.id),
          role: m.role as 'user' | 'assistant',
          parts: [{ type: 'text' as const, text: m.content }],
          createdAt: new Date(),
        });
      }
    }
    return merged;
  }, [initialMessages]);

  const { messages, sendMessage, status, error } = useChat({
    transport,
    messages: mappedInitialMessages,
    onFinish: () => {
      fetchProposal();
    },
  });

  // Persist new messages
  const lastPersisted = useRef(0);
  useEffect(() => {
    if (status !== 'ready' || messages.length <= lastPersisted.current) return;
    const newMsgs = messages.slice(lastPersisted.current);
    const toSave = newMsgs
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({
        role: m.role,
        content: m.parts
          .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
          .map(p => p.text)
          .join(''),
      }))
      .filter(m => m.content.trim());

    if (toSave.length > 0) {
      fetch(`/api/dashboard/proposals/${proposalId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSave),
      });
    }
    lastPersisted.current = messages.length;
  }, [messages, status, proposalId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || status !== 'ready') return;
    sendMessage({ text: input });
    setInput('');
  }

  async function updateTitle() {
    if (!proposal || !titleDraft.trim()) return;
    await fetch(`/api/dashboard/proposals/${proposalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titleDraft }),
    });
    setEditingTitle(false);
    fetchProposal();
  }

  async function changeStatus(s: string) {
    await fetch(`/api/dashboard/proposals/${proposalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: s }),
    });
    setStatusOpen(false);
    fetchProposal();
  }

  function copyPublicUrl() {
    if (!proposal) return;
    navigator.clipboard.writeText(`${window.location.origin}/proposal/${proposal.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    setUploading(true);
    setUploadError(null);
    try {
      const uploaded: { blobUrl: string; filename: string; contentType: string; sizeBytes: number }[] = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const blob = await upload(`proposals/${proposalId}/${file.name}`, file, {
          access: 'public',
          handleUploadUrl: `/api/dashboard/proposals/${proposalId}/files/upload`,
        });
        uploaded.push({
          blobUrl: blob.url,
          filename: file.name,
          contentType: file.type || 'application/octet-stream',
          sizeBytes: file.size,
        });
      }
      // Save metadata to DB
      const res = await fetch(`/api/dashboard/proposals/${proposalId}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploaded),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Save failed (${res.status})`);
      }
      await fetchFiles();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function deleteFile(fileId: number) {
    await fetch(`/api/dashboard/proposals/${proposalId}/files/${fileId}`, { method: 'DELETE' });
    fetchFiles();
  }

  if (!proposal || initialMessages === null) return <div className="animate-pulse text-warm-gray p-8">Loading...</div>;

  const tabs = [
    { key: 'clientPrd' as const, label: 'Client PRD' },
    { key: 'internalPrd' as const, label: 'Internal PRD' },
    { key: 'timeline' as const, label: 'Timeline' },
    { key: 'quote' as const, label: 'Quote' },
  ];

  const busy = status === 'submitted' || status === 'streaming';

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] -m-6">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-cream-dark bg-white shrink-0">
        <Link href={`/dashboard/leads/${leadId}`} className="text-warm-gray hover:text-charcoal transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {editingTitle ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && updateTitle()}
              className="flex-1 px-2 py-1 rounded-lg border border-cream-dark text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-honey/30"
              autoFocus
            />
            <button onClick={updateTitle} className="p-1 text-green-600 hover:bg-green-50 rounded">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={() => setEditingTitle(false)} className="p-1 text-warm-gray hover:bg-cream rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setEditingTitle(true); setTitleDraft(proposal.title); }}
            className="flex items-center gap-1.5 text-sm font-semibold text-charcoal hover:text-honey transition-colors"
          >
            {proposal.title}
            <Pencil className="w-3 h-3 opacity-50" />
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <button onClick={() => setStatusOpen(!statusOpen)} className="flex items-center gap-1">
              <StatusBadge status={proposal.status} />
            </button>
            {statusOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
                <div className="absolute top-full right-0 mt-1 z-20 bg-white rounded-xl border border-cream-dark shadow-lg py-1 min-w-[120px]">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => changeStatus(s)}
                      className={`w-full text-left px-3 py-1.5 text-sm hover:bg-cream/50 transition-colors ${
                        s === proposal.status ? 'font-semibold text-charcoal' : 'text-warm-gray'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={copyPublicUrl}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-cream-dark hover:border-honey/30 text-warm-gray hover:text-honey transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>

          <button
            onClick={() => window.open(`/dashboard/leads/${leadId}/scope/${proposalId}/print`, '_blank')}
            disabled={!proposal.clientPrd && !proposal.timeline && !proposal.quote}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-honey text-white hover:bg-honey-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileText className="w-3.5 h-3.5" />
            Generate PDF
          </button>

          {(proposal.status === 'ready' || proposal.status === 'sent') && (
            <Link
              href={`/proposal/${proposal.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-cream-dark hover:border-honey/30 text-warm-gray hover:text-honey transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View
            </Link>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Chat */}
        <div className="w-[60%] flex flex-col border-r border-cream-dark">
          {/* Attached Files Section */}
          <div className="border-b border-cream-dark bg-cream/20 shrink-0">
            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5 text-warm-gray-light" />
                <span className="text-xs font-semibold text-warm-gray uppercase tracking-wide">
                  Attached Files
                </span>
                {files.length > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-honey/10 text-honey">
                    {files.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-honey hover:bg-honey/5 transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                {uploading ? 'Uploading...' : 'Add Files'}
              </button>
            </div>

            {uploadError && (
              <div className="mx-4 mb-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {uploadError}
                <button onClick={() => setUploadError(null)} className="ml-auto hover:text-red-900">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {files.length > 0 ? (
              <div className="px-4 pb-3 flex flex-col gap-1.5">
                {files.map(f => (
                  <div key={f.id} className="flex items-center gap-3 px-3 py-2 bg-white rounded-lg border border-cream-dark group">
                    <div className="w-7 h-7 rounded-md bg-honey/10 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5 text-honey" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">{f.filename}</p>
                      <p className="text-[11px] text-warm-gray-light">
                        {f.sizeBytes < 1024
                          ? `${f.sizeBytes} B`
                          : f.sizeBytes < 1048576
                            ? `${(f.sizeBytes / 1024).toFixed(1)} KB`
                            : `${(f.sizeBytes / 1048576).toFixed(1)} MB`}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteFile(f.id)}
                      className="p-1.5 rounded-md text-warm-gray-light opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 pb-3">
                <div className="flex items-center gap-3 px-3 py-3 rounded-lg border border-dashed border-cream-dark text-center">
                  <FileText className="w-4 h-4 text-warm-gray-light shrink-0" />
                  <p className="text-xs text-warm-gray-light">
                    No files attached. Upload reference docs so the AI can review them.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-warm-gray text-sm">Start a conversation to scope this project.</p>
                <p className="text-warm-gray-light text-xs mt-1">The AI has context about the lead and any uploaded files.</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-honey text-white'
                    : 'bg-cream/50 text-charcoal border border-cream-dark'
                }`}>
                  {msg.parts.map((part, i) => {
                    if (part.type === 'text' && part.text) {
                      if (msg.role === 'assistant') {
                        return (
                          <div key={i} className="prose prose-sm max-w-none prose-headings:text-charcoal prose-p:text-charcoal prose-li:text-charcoal">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{part.text}</ReactMarkdown>
                          </div>
                        );
                      }
                      return <p key={i} className="whitespace-pre-wrap">{part.text}</p>;
                    }
                    // Handle tool-specific parts (tool-generateInternalPrd etc.)
                    if (part.type.startsWith('tool-')) {
                      const toolKey = part.type.replace('tool-', '');
                      return (
                        <div key={i} className="mt-2 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700">
                          <Check className="w-3.5 h-3.5" />
                          Generated {TOOL_LABELS[toolKey] || toolKey}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="bg-cream/50 border border-cream-dark rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-warm-gray/40 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-warm-gray/40 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 bg-warm-gray/40 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-sm text-red-700">
              Error: {error.message}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-cream-dark bg-white">
            <div className="flex items-end gap-2">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.json,.rtf,text/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Discuss project scope..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-cream-dark bg-white text-sm text-charcoal placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-honey/30 focus:border-honey transition-all"
                disabled={busy}
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="p-2.5 rounded-xl bg-honey text-white hover:bg-honey-dark transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right panel - Artifacts */}
        <div className="w-[40%] flex flex-col bg-cream/20">
          {/* Tabs */}
          <div className="flex border-b border-cream-dark bg-white px-2">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-3 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                  activeTab === t.key
                    ? 'border-honey text-honey'
                    : 'border-transparent text-warm-gray hover:text-charcoal'
                }`}
              >
                {t.label}
              </button>
            ))}
            <div className="ml-auto flex items-center pr-2">
              <button
                onClick={() => router.push(`/dashboard/leads/${leadId}/scope/${proposalId}/edit`)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-warm-gray hover:text-honey hover:bg-honey/5 transition-colors"
              >
                <Pencil className="w-3 h-3" />
                Edit
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'clientPrd' && (
              proposal.clientPrd ? (
                <div className="prose prose-sm max-w-none prose-headings:text-charcoal">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{proposal.clientPrd}</ReactMarkdown>
                </div>
              ) : (
                <EmptyArtifact label="Client PRD" />
              )
            )}
            {activeTab === 'internalPrd' && (
              proposal.internalPrd ? (
                <div className="prose prose-sm max-w-none prose-headings:text-charcoal">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{proposal.internalPrd}</ReactMarkdown>
                </div>
              ) : (
                <EmptyArtifact label="Internal PRD" />
              )
            )}
            {activeTab === 'timeline' && (
              proposal.timeline ? (
                <TimelineView data={proposal.clientTimelineOverride || proposal.timeline} />
              ) : (
                <EmptyArtifact label="Timeline" />
              )
            )}
            {activeTab === 'quote' && (
              proposal.quote ? (
                <QuoteView data={proposal.clientQuoteOverride || proposal.quote} />
              ) : (
                <EmptyArtifact label="Quote" />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyArtifact({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileText className="w-8 h-8 text-warm-gray-light mb-2" />
      <p className="text-sm text-warm-gray">Not generated yet</p>
      <p className="text-xs text-warm-gray-light mt-1">Ask the AI to generate the {label}.</p>
    </div>
  );
}

function TimelineView({ data }: { data: string }) {
  try {
    const phases = JSON.parse(data) as { phase: string; description: string; weeks: number; milestones: string[] }[];
    const totalWeeks = phases.reduce((sum, p) => sum + p.weeks, 0);
    return (
      <div className="space-y-4">
        <div className="text-xs text-warm-gray mb-2">Total: {totalWeeks} weeks</div>
        {phases.map((p, i) => (
          <div key={i} className="bg-white rounded-xl border border-cream-dark p-4">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-charcoal">{p.phase}</h4>
              <span className="text-xs text-honey font-medium">{p.weeks}w</span>
            </div>
            <p className="text-xs text-warm-gray mb-2">{p.description}</p>
            {p.milestones.length > 0 && (
              <ul className="space-y-1">
                {p.milestones.map((m, j) => (
                  <li key={j} className="flex items-center gap-1.5 text-xs text-warm-gray">
                    <Check className="w-3 h-3 text-green-500 shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  } catch {
    return <pre className="text-xs text-warm-gray whitespace-pre-wrap">{data}</pre>;
  }
}

function QuoteView({ data }: { data: string }) {
  try {
    const quote = JSON.parse(data) as {
      lineItems: { name: string; description: string; amount: number }[];
      notes: string;
      ongoingSupport?: { monthlyRetainerAmount: number; hourlyRate: number };
    };
    const total = quote.lineItems.reduce((sum, item) => sum + item.amount, 0);
    return (
      <div>
        <div className="bg-white rounded-xl border border-cream-dark overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-dark bg-cream/30">
                <th className="text-left px-4 py-2 text-xs font-semibold text-warm-gray">Item</th>
                <th className="text-right px-4 py-2 text-xs font-semibold text-warm-gray">Amount</th>
              </tr>
            </thead>
            <tbody>
              {quote.lineItems.map((item, i) => (
                <tr key={i} className="border-b border-cream-dark last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-charcoal">{item.name}</div>
                    <div className="text-xs text-warm-gray mt-0.5">{item.description}</div>
                  </td>
                  <td className="px-4 py-3 text-right text-charcoal font-medium">
                    ${item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-cream/30">
                <td className="px-4 py-3 font-semibold text-charcoal">Total</td>
                <td className="px-4 py-3 text-right font-bold text-honey text-lg">
                  ${total.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        {quote.notes && (
          <p className="text-xs text-warm-gray mt-3 italic">{quote.notes}</p>
        )}
        {quote.ongoingSupport && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-2">Ongoing Support</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-cream/50 rounded-lg border border-cream-dark p-3">
                <p className="text-xs text-warm-gray mb-1">Monthly Retainer</p>
                <p className="text-sm font-bold text-honey">${quote.ongoingSupport.monthlyRetainerAmount.toLocaleString()}/mo</p>
              </div>
              <div className="bg-cream/50 rounded-lg border border-cream-dark p-3">
                <p className="text-xs text-warm-gray mb-1">Self-Hosted Rate</p>
                <p className="text-sm font-bold text-charcoal">${quote.ongoingSupport.hourlyRate.toLocaleString()}/hr</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch {
    return <pre className="text-xs text-warm-gray whitespace-pre-wrap">{data}</pre>;
  }
}

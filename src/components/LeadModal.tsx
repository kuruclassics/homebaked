'use client';

import { useState } from 'react';
import { Lead } from '@/types';

const statusOptions = [
  { value: 'not_sent', label: 'Not Sent', color: 'bg-gray-200' },
  { value: 'sent', label: 'Sent', color: 'bg-blue-500 text-white' },
  { value: 'opened', label: 'Opened', color: 'bg-purple-500 text-white' },
  { value: 'replied', label: 'Replied', color: 'bg-emerald-500 text-white' },
  { value: 'won', label: 'Won', color: 'bg-green-600 text-white' },
  { value: 'not_interested', label: 'Not Interested', color: 'bg-red-500 text-white' },
];

export default function LeadModal({ lead, onClose, onUpdate }: { lead: Lead; onClose: () => void; onUpdate: () => void }) {
  const [notes, setNotes] = useState(lead.notes || '');
  const [saving, setSaving] = useState(false);

  const updateStatus = async (status: string) => {
    await fetch(`/api/autopilot/leads/${lead.id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    onUpdate();
  };

  const saveNotes = async () => {
    setSaving(true);
    await fetch('/api/autopilot/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lead.id, notes }),
    });
    setSaving(false);
    onUpdate();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
            <p className="text-sm text-gray-500 capitalize">{lead.trade} · {lead.city}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 font-medium">Phone</p>
              <p className="text-gray-900">{lead.phone}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Email</p>
              <p className="text-gray-900">{lead.emails.length > 0 ? lead.emails.join(', ') : '—'}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Address</p>
              <p className="text-gray-900">{lead.address}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Rating</p>
              <p className="text-gray-900">⭐ {lead.rating} ({lead.review_count} reviews)</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Website</p>
              {lead.website ? <a href={lead.website} target="_blank" rel="noopener" className="text-indigo-600 hover:underline break-all">{new URL(lead.website).hostname}</a> : <span className="text-gray-300">—</span>}
            </div>
            <div>
              <p className="text-gray-500 font-medium">Preview Site</p>
              {lead.preview_slug && !['A','B'].includes(lead.grade) ? <a href={`/preview/${lead.preview_slug}/index.html`} target="_blank" rel="noopener" className="text-purple-600 hover:underline">View Preview →</a> : <span className="text-gray-300">{['A','B'].includes(lead.grade) ? 'Site already good' : 'Not generated'}</span>}
            </div>
          </div>

          {/* Audit Results */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Audit Results</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Grade</span><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${lead.grade === 'A' ? 'bg-green-100 text-green-800' : lead.grade === 'B' ? 'bg-blue-100 text-blue-800' : lead.grade === 'C' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>{lead.grade}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">SSL</span><span>{lead.audit.ssl ? '✅ Yes' : '❌ No'}</span></div>
              {lead.audit.reason && <div className="flex justify-between"><span className="text-gray-500">Note</span><span className="text-gray-600 text-right max-w-[300px]">{lead.audit.reason}</span></div>}
              {lead.audit.performance_score !== undefined && <div className="flex justify-between"><span className="text-gray-500">Performance</span><span>{lead.audit.performance_score}</span></div>}
              {lead.audit.seo_score !== undefined && <div className="flex justify-between"><span className="text-gray-500">SEO</span><span>{lead.audit.seo_score}</span></div>}
            </div>
          </div>

          {/* Outreach Status */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Outreach Status</h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateStatus(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${lead.outreach_status === opt.value ? opt.color + ' ring-2 ring-offset-1 ring-indigo-400' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Activity Log</h3>
            {(lead.activity_log || []).length > 0 ? (
              <div className="space-y-2">
                {(lead.activity_log || []).map((entry, i) => (
                  <div key={i} className="text-sm flex gap-3">
                    <span className="text-gray-400 whitespace-nowrap">{new Date(entry.date).toLocaleDateString()}</span>
                    <span className="text-gray-700">{entry.action}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No activity yet</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Add notes about this lead..."
            />
            <button onClick={saveNotes} disabled={saving} className="mt-2 px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

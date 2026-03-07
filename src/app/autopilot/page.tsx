'use client';

import { useState, useEffect, useMemo } from 'react';
import { Lead } from '@/types';
import LeadModal from '@/components/LeadModal';
import Link from 'next/link';

const gradeColors: Record<string, string> = {
  A: 'bg-green-100 text-green-800',
  B: 'bg-blue-100 text-blue-800',
  C: 'bg-amber-100 text-amber-800',
  D: 'bg-red-100 text-red-800',
};

const statusColors: Record<string, string> = {
  not_sent: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-100 text-blue-700',
  opened: 'bg-purple-100 text-purple-700',
  replied: 'bg-emerald-100 text-emerald-700',
  won: 'bg-green-100 text-green-800 font-semibold',
  not_interested: 'bg-red-100 text-red-600',
};

const statusLabels: Record<string, string> = {
  not_sent: 'Not Sent',
  sent: 'Sent',
  opened: 'Opened',
  replied: 'Replied',
  won: 'Won',
  not_interested: 'Not Interested',
};

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tradeFilter, setTradeFilter] = useState('');
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetch('/api/autopilot/leads').then(r => r.json()).then(setLeads);
  }, []);

  const filtered = useMemo(() => {
    const result = leads.filter(l => {
      if (search && !l.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (gradeFilter && l.grade !== gradeFilter) return false;
      if (statusFilter && l.outreach_status !== statusFilter) return false;
      if (tradeFilter && l.trade !== tradeFilter) return false;
      return true;
    });
    result.sort((a: Lead, b: Lead) => {
      const av = String(a[sortKey as keyof Lead] ?? '');
      const bv = String(b[sortKey as keyof Lead] ?? '');
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [leads, search, gradeFilter, statusFilter, tradeFilter, sortKey, sortDir]);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const stats = useMemo(() => {
    const total = leads.length;
    const audited = leads.filter(l => l.grade).length;
    const grades = { A: 0, B: 0, C: 0, D: 0 };
    leads.forEach(l => { if (l.grade in grades) grades[l.grade as keyof typeof grades]++; });
    const sitesGenerated = leads.filter(l => l.preview_slug).length;
    const sent = leads.filter(l => l.outreach_status !== 'not_sent').length;
    const replies = leads.filter(l => ['replied', 'won'].includes(l.outreach_status)).length;
    const won = leads.filter(l => l.outreach_status === 'won').length;
    return { total, audited, grades, sitesGenerated, sent, replies, won };
  }, [leads]);

  const trades = useMemo(() => Array.from(new Set(leads.map(l => l.trade))), [leads]);

  const refreshLeads = () => fetch('/api/autopilot/leads').then(r => r.json()).then(setLeads);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HB</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HomeBaked Autopilot</h1>
              <p className="text-xs text-gray-500">Automated Website Agency Pipeline</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-800">← Dashboard</Link>
            <span className="text-sm text-gray-400">{leads.length} leads</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { label: 'Scouted', value: stats.total, color: 'text-indigo-600' },
            { label: 'Audited', value: stats.audited, sub: `A:${stats.grades.A} B:${stats.grades.B} C:${stats.grades.C} D:${stats.grades.D}`, color: 'text-gray-900' },
            { label: 'Sites Built', value: stats.sitesGenerated, color: 'text-purple-600' },
            { label: 'Outreach Sent', value: stats.sent, color: 'text-blue-600' },
            { label: 'Responses', value: stats.replies, color: 'text-emerald-600' },
            { label: 'Won', value: stats.won, color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              {s.sub && <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
          <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option value="">All Grades</option>
            {['A','B','C','D'].map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option value="">All Statuses</option>
            {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={tradeFilter} onChange={e => setTradeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option value="">All Trades</option>
            {trades.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {(search || gradeFilter || statusFilter || tradeFilter) && (
            <button onClick={() => { setSearch(''); setGradeFilter(''); setStatusFilter(''); setTradeFilter(''); }} className="px-3 py-2 text-sm text-indigo-600 hover:text-indigo-800">
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {[
                  { key: 'name', label: 'Business' },
                  { key: 'trade', label: 'Trade' },
                  { key: 'city', label: 'City' },
                  { key: 'grade', label: 'Grade' },
                  { key: 'rating', label: 'Rating' },
                  { key: 'website', label: 'Website' },
                  { key: 'emails', label: 'Email' },
                  { key: 'phone', label: 'Phone' },
                  { key: 'preview_slug', label: 'Preview' },
                  { key: 'outreach_status', label: 'Status' },
                ].map(col => (
                  <th key={col.key} className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:text-indigo-600 whitespace-nowrap" onClick={() => toggleSort(col.key)}>
                    {col.label} {sortKey === col.key && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-indigo-50/30 cursor-pointer transition-colors" onClick={() => setSelectedLead(lead)}>
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{lead.name}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{lead.trade}</td>
                  <td className="px-4 py-3 text-gray-600">{lead.city}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${gradeColors[lead.grade] || 'bg-gray-100'}`}>{lead.grade}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">⭐ {lead.rating} <span className="text-gray-400">({lead.review_count})</span></td>
                  <td className="px-4 py-3">
                    {lead.website ? <a href={lead.website} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} className="text-indigo-600 hover:underline text-xs truncate block max-w-[120px]">Visit</a> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[160px] truncate">{lead.emails[0] || <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{lead.phone}</td>
                  <td className="px-4 py-3">
                    {lead.preview_slug && !['A','B'].includes(lead.grade) ? <a href={`/preview/${lead.preview_slug}/index.html`} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} className="text-purple-600 hover:underline text-xs">View</a> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[lead.outreach_status]}`}>{statusLabels[lead.outreach_status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No leads match your filters</div>}
        </div>
      </main>

      {selectedLead && (
        <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdate={refreshLeads} />
      )}
    </div>
  );
}

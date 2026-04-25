'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, CheckCircle, XCircle, ArrowLeft, Sparkles, ExternalLink, X, RotateCcw } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { generateCategoryColorsMap } from '../lib/categoryColors';
import { Source, CATEGORIES } from '../lib/sources';

const FF = 'Montserrat, var(--font-montserrat, sans-serif)';

// Derive colors from all known categories
const catColorMap = generateCategoryColorsMap(CATEGORIES);
const getColor = (cat: string) => catColorMap[cat] || '#6366f1';

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ category: '', name: '', url: '', notes: '', active: true });
  const [filterCat, setFilterCat] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => { fetchSources(); }, []);

  const fetchSources = async () => {
    try {
      const res = await fetch('/api/sources');
      setSources(await res.json());
    } catch (e) { console.error(e); }
  };

  const openAdd = () => {
    setEditingSource(null);
    setFormData({ category: '', name: '', url: '', notes: '', active: true });
    setShowModal(true);
  };

  const openEdit = (s: Source) => {
    setEditingSource(s);
    setFormData({ category: s.category, name: s.name, url: s.url, notes: s.notes, active: s.active });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingSource ? 'PUT' : 'POST';
      const url = editingSource ? `/api/sources/${editingSource.id}` : '/api/sources';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (res.ok) { fetchSources(); setShowModal(false); }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this source?')) return;
    try { await fetch(`/api/sources/${id}`, { method: 'DELETE' }); fetchSources(); }
    catch (e) { console.error(e); }
  };

  const handleToggleActive = async (s: Source) => {
    try {
      await fetch(`/api/sources/${s.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...s, active: !s.active }),
      });
      fetchSources();
    } catch (e) { console.error(e); }
  };

  const handleInitialize = async () => {
    try { await fetch('/api/init', { method: 'POST' }); fetchSources(); }
    catch (e) { console.error(e); }
  };

  // Derived stats
  const activeCount = sources.filter(s => s.active).length;
  const pct = sources.length > 0 ? Math.round((activeCount / sources.length) * 100) : 0;

  // Filtered + sorted list
  const existingCats = [...new Set(sources.map(s => s.category))].sort();
  const filtered = sources
    .filter(s => !filterCat || s.category === filterCat)
    .filter(s => filterActive === 'all' ? true : filterActive === 'active' ? s.active : !s.active)
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <AnimatedBackground />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm font-semibold shrink-0 group"
                style={{ fontFamily: FF }}
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Back to Events</span>
              </Link>
              <div className="h-5 w-px bg-gray-200 hidden sm:block" />
              <div className="min-w-0">
                <h1
                  className="text-xl sm:text-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent font-extrabold truncate"
                  style={{ fontFamily: FF }}
                >
                  Manage Sources
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInitialize}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-gray-600 border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all"
                style={{ fontFamily: FF }}
                title="Re-initialize default sources"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
              <motion.button
                onClick={openAdd}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 sm:px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all relative overflow-hidden group"
                style={{ fontFamily: FF }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.4 }} />
                <Plus className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Add Source</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 relative z-10 space-y-5">

        {/* Active sources progress bar */}
        {sources.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 text-sm" style={{ fontFamily: FF }}>Active Sources</h3>
              <span className="text-xl font-extrabold text-green-500" style={{ fontFamily: FF }}>
                {activeCount} <span className="text-sm font-semibold text-gray-400">/ {sources.length}</span>
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-gray-400" style={{ fontFamily: FF }}>0</span>
              <span className="text-xs text-gray-400" style={{ fontFamily: FF }}>{sources.length} total</span>
            </div>
          </div>
        )}

        {/* Filters row */}
        {sources.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
              style={{ fontFamily: FF }}
            >
              <option value="">All Categories</option>
              {existingCats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {(['all', 'active', 'inactive'] as const).map(v => (
              <button
                key={v}
                onClick={() => setFilterActive(v)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                  filterActive === v
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-500 hover:border-blue-300'
                }`}
                style={{ fontFamily: FF }}
              >
                {v}
              </button>
            ))}
            <span className="text-xs text-gray-400 ml-1" style={{ fontFamily: FF }}>{filtered.length} shown</span>
          </div>
        )}

        {/* Sources list */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((source) => {
              const color = getColor(source.category);
              return (
                <motion.div
                  key={source.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-px transition-all relative group"
                >
                  {/* Category accent strip */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: color }} />

                  <div className="pl-5 pr-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      {/* Left: name + category + url + notes */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-sm font-bold text-gray-900" style={{ fontFamily: FF }}>{source.name}</h3>
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                            style={{ backgroundColor: `${color}18`, color, fontFamily: FF }}
                          >
                            {source.category}
                          </span>
                          <span className={`flex items-center gap-1 text-[10px] font-semibold ${source.active ? 'text-green-600' : 'text-red-500'}`} style={{ fontFamily: FF }}>
                            {source.active
                              ? <CheckCircle className="w-3 h-3" />
                              : <XCircle className="w-3 h-3" />}
                            {source.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <p className="text-xs text-gray-400 truncate mb-1" style={{ fontFamily: FF }}>{source.url}</p>
                        {source.notes && (
                          <p className="text-xs text-gray-500" style={{ fontFamily: FF }}>{source.notes}</p>
                        )}
                      </div>

                      {/* Right: action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleToggleActive(source)}
                          title={source.active ? 'Deactivate' : 'Activate'}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            source.active
                              ? 'bg-green-50 text-green-600 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {source.active ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openEdit(source)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors text-xs font-semibold"
                          style={{ fontFamily: FF }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(source.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                          style={{ backgroundColor: `${color}15`, color, fontFamily: FF }}
                        >
                          <span className="hidden sm:inline">Original Site</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && sources.length > 0 && (
            <div className="text-center py-12 text-gray-400" style={{ fontFamily: FF }}>
              No sources match the current filters.
            </div>
          )}

          {sources.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 mb-4" style={{ fontFamily: FF }}>No sources yet.</p>
              <button
                onClick={handleInitialize}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold shadow-md"
                style={{ fontFamily: FF }}
              >
                Initialize Default Sources
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ── Add / Edit modal ── */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                className="bg-white rounded-3xl p-7 w-full max-w-md shadow-2xl"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', duration: 0.4 }}
                onClick={e => e.stopPropagation()}
              >
                {/* Modal header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: FF }}>
                      {editingSource ? 'Edit Source' : 'Add New Source'}
                    </h2>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { label: 'Source Name', key: 'name', type: 'text', placeholder: 'e.g. Engineering Events' },
                    { label: 'URL', key: 'url', type: 'url', placeholder: 'https://example.com/events' },
                    { label: 'Notes', key: 'notes', type: 'text', placeholder: 'Optional description or notes' },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide" style={{ fontFamily: FF }}>{label}</label>
                      <input
                        type={type}
                        value={(formData as any)[key]}
                        onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                        placeholder={placeholder}
                        required={key !== 'notes'}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-sm transition-colors"
                        style={{ fontFamily: FF }}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide" style={{ fontFamily: FF }}>Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-sm transition-colors bg-white"
                      style={{ fontFamily: FF }}
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={e => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700" style={{ fontFamily: FF }}>Active (include in scraping)</span>
                  </label>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2.5 rounded-full border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                      style={{ fontFamily: FF }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:opacity-90 transition-all"
                      style={{ fontFamily: FF }}
                    >
                      {editingSource ? 'Save Changes' : 'Add Source'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

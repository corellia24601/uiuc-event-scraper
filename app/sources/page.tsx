'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Source, CATEGORIES, COLORS } from '../lib/sources';

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    url: '',
    notes: '',
    active: true,
  });

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await fetch('/api/sources');
      const data = await response.json();
      setSources(data);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingSource ? 'PUT' : 'POST';
      const url = editingSource ? `/api/sources/${editingSource.id}` : '/api/sources';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchSources();
        setShowForm(false);
        setEditingSource(null);
        setFormData({ category: '', name: '', url: '', notes: '', active: true });
      }
    } catch (error) {
      console.error('Error saving source:', error);
    }
  };

  const handleEdit = (source: Source) => {
    setEditingSource(source);
    setFormData({
      category: source.category,
      name: source.name,
      url: source.url,
      notes: source.notes,
      active: source.active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this source?')) {
      try {
        await fetch(`/api/sources/${id}`, { method: 'DELETE' });
        fetchSources();
      } catch (error) {
        console.error('Error deleting source:', error);
      }
    }
  };

  const initializeSources = async () => {
    try {
      await fetch('/api/init', { method: 'POST' });
      fetchSources();
    } catch (error) {
      console.error('Error initializing sources:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Manage Event Sources</h1>
            <div className="flex space-x-4">
              <Link
                href="/"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Back to Search
              </Link>
              <button
                onClick={initializeSources}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Initialize Sources
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Source
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active / Total summary */}
        {sources.length > 0 && (() => {
          const activeCount = sources.filter(s => s.active).length;
          const total = sources.length;
          const pct = Math.round((activeCount / total) * 100);
          return (
            <div className="flex items-center gap-4 bg-white rounded-lg shadow-sm px-6 py-4 mb-6 border border-gray-100">
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-gray-900">{activeCount}</span>
                  <span className="text-gray-500">/ {total} sources active</span>
                  <span className="ml-auto text-sm text-gray-400">{pct}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })()}

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingSource ? 'Edit Source' : 'Add New Source'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 text-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {editingSource ? 'Update' : 'Add'} Source
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSource(null);
                    setFormData({ category: '', name: '', url: '', notes: '', active: true });
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {sources.map((source) => (
            <div key={source.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{source.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${COLORS[source.category] || 'bg-gray-100 text-gray-800'}`}>
                    {source.category}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(source)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(source.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{source.url}</p>
              {source.notes && <p className="text-sm text-gray-500 mb-2">{source.notes}</p>}
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${source.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm text-gray-500">{source.active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          ))}
          {sources.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No sources found. Click "Initialize Sources" to add default sources or "Add Source" to create your own.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
import React, { useState } from 'react';
import { Eye, EyeOff, ListFilter, Plus, Trash2 } from 'lucide-react';
import { Category } from '../types';

interface CategoryManagerViewProps {
  categories: Category[];
  onSaveCategories: (updated: Category[]) => void;
}

export const CategoryManagerView: React.FC<CategoryManagerViewProps> = ({
  categories,
  onSaveCategories,
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'live' | 'vod' | 'series'>('live');

  const toggleHide = (id: string) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, hidden: !c.hidden } : c));
    onSaveCategories(updated);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: Category = {
      id: `custom_cat_${Date.now()}`,
      name: newCatName.trim(),
      type: newCatType,
      hidden: false,
      order: categories.length + 1,
      custom: true,
    };

    onSaveCategories([...categories, newCat]);
    setNewCatName('');
  };

  const handleDeleteCustom = (id: string) => {
    onSaveCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ListFilter className="w-5 h-5 text-cyan-400" /> Channel Category Customizer
        </h2>
        <p className="text-xs text-slate-400">Hide unwanted IPTV channel groups, reorder categories, or create custom folders.</p>
      </div>

      {/* Create Custom Category Form */}
      <form onSubmit={handleCreateCategory} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Create custom category (e.g., Weekend Sports 4K)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>

        <select
          value={newCatType}
          onChange={(e) => setNewCatType(e.target.value as any)}
          className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none"
        >
          <option value="live">Live TV Group</option>
          <option value="vod">VOD Movies Group</option>
          <option value="series">TV Series Group</option>
        </select>

        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950/50"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </form>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
              cat.hidden
                ? 'bg-slate-950/40 border-slate-900 text-slate-600'
                : 'bg-slate-900/80 border-slate-800 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                {cat.type}
              </span>
              <span className={`font-semibold text-sm ${cat.hidden ? 'line-through text-slate-600' : 'text-white'}`}>
                {cat.name}
              </span>
              {cat.custom && (
                <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Custom
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleHide(cat.id)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  cat.hidden
                    ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                }`}
                title={cat.hidden ? 'Unhide Category' : 'Hide Category'}
              >
                {cat.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="hidden sm:inline">{cat.hidden ? 'Hidden' : 'Visible'}</span>
              </button>

              {cat.custom && (
                <button
                  onClick={() => handleDeleteCustom(cat.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

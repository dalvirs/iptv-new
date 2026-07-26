import React, { useState } from 'react';
import { Calendar, Disc, Grid, Heart, List, Play, Radio, Search, Star, Zap } from 'lucide-react';
import { Category, Channel, EPGProgram } from '../types';

interface LiveTVViewProps {
  channels: Channel[];
  categories: Category[];
  epgPrograms: EPGProgram[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onPlayChannel: (channel: Channel) => void;
  onStartRecordChannel: (channel: Channel) => void;
  searchQuery: string;
}

export const LiveTVView: React.FC<LiveTVViewProps> = ({
  channels,
  categories,
  epgPrograms,
  favorites,
  onToggleFavorite,
  onPlayChannel,
  onStartRecordChannel,
  searchQuery,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'compact' | 'epg'>('grid');

  // Filter channels
  const activeCategories = categories.filter((c) => !c.hidden && c.type === 'live');

  const filteredChannels = channels.filter((ch) => {
    const matchesSearch =
      !searchQuery ||
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ch.category_name && ch.category_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCatId === 'all' || ch.category_id === selectedCatId;
    return matchesSearch && matchesCat;
  });

  // Get current EPG program for a channel
  const getCurrentProgram = (channelId: string) => {
    const now = new Date();
    return epgPrograms.find((prog) => {
      if (prog.channel_id !== channelId) return false;
      const start = new Date(prog.start);
      const end = new Date(prog.end);
      return now >= start && now <= end;
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 p-4 md:p-6 space-y-4">
      {/* Category Pills Bar & View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 pb-2 border-b border-slate-800/80">
        {/* Horizontal Category Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full pb-1">
          <button
            onClick={() => setSelectedCatId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCatId === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            📺 All Channels ({channels.length})
          </button>

          {activeCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCatId === cat.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Layout Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setLayoutMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              layoutMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayoutMode('compact')}
            className={`p-1.5 rounded-lg transition-colors ${
              layoutMode === 'compact' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Compact List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Channel Grid / List View */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredChannels.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-center space-y-2">
            <Radio className="w-12 h-12 text-slate-600 animate-pulse" />
            <p className="text-base font-semibold text-slate-300">No IPTV Channels Found</p>
            <p className="text-xs">Try selecting a different category or clearing search filters.</p>
          </div>
        ) : layoutMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredChannels.map((ch) => {
              const currentProg = getCurrentProgram(ch.id);
              const isFav = favorites.includes(ch.id);

              return (
                <div
                  key={ch.id}
                  className="group relative bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 transition-all duration-300 shadow-xl flex flex-col justify-between overflow-hidden"
                >
                  {/* Card Header: Channel Logo & Favorite */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0 p-1">
                        {ch.stream_icon ? (
                          <img
                            src={ch.stream_icon}
                            alt={ch.name}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <Radio className="w-6 h-6 text-cyan-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            CH #{ch.num || ch.stream_id}
                          </span>
                          {ch.resolution && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {ch.resolution}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mt-0.5">
                          {ch.name}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleFavorite(ch.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isFav
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* EPG Live Program Banner */}
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 mb-3 text-xs">
                    <p className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Now:
                    </p>
                    <p className="font-medium text-slate-200 line-clamp-1 mt-0.5">
                      {currentProg ? currentProg.title : 'Live TV Broadcast Stream'}
                    </p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onPlayChannel(ch)}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950/50 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" /> Watch Live
                    </button>

                    <button
                      onClick={() => onStartRecordChannel(ch)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-rose-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      title="Record Live Stream"
                    >
                      <Disc className="w-3.5 h-3.5 text-rose-500" /> Record
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Compact List View */
          <div className="space-y-2">
            {filteredChannels.map((ch) => {
              const currentProg = getCurrentProgram(ch.id);
              const isFav = favorites.includes(ch.id);

              return (
                <div
                  key={ch.id}
                  className="bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0 p-1">
                      {ch.stream_icon ? (
                        <img src={ch.stream_icon} alt={ch.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        <Radio className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          #{ch.num || ch.stream_id}
                        </span>
                        <h4 className="font-bold text-sm text-white truncate">{ch.name}</h4>
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {currentProg ? currentProg.title : 'Live TV Transmission'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onToggleFavorite(ch.id)}
                      className={`p-2 rounded-lg border text-xs ${
                        isFav ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => onStartRecordChannel(ch)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs"
                      title="Record Live"
                    >
                      <Disc className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onPlayChannel(ch)}
                      className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" /> Play
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

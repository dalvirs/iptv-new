import React, { useState } from 'react';
import { Download, Film, Heart, Play, Star, Tv, X } from 'lucide-react';
import { Category, DownloadItem, Episode, VODSeries } from '../types';

interface SeriesViewProps {
  series: VODSeries[];
  categories: Category[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onPlayEpisode: (seriesName: string, ep: Episode) => void;
  onDownloadEpisode: (download: Omit<DownloadItem, 'progress' | 'status' | 'addedAt'>) => void;
  searchQuery: string;
}

export const SeriesView: React.FC<SeriesViewProps> = ({
  series,
  categories,
  favorites,
  onToggleFavorite,
  onPlayEpisode,
  onDownloadEpisode,
  searchQuery,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [selectedSeries, setSelectedSeries] = useState<VODSeries | null>(null);
  const [activeSeasonIdx, setActiveSeasonIdx] = useState<number>(0);

  const seriesCategories = categories.filter((c) => !c.hidden && c.type === 'series');

  const filteredSeries = series.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.genre && s.genre.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCatId === 'all' || s.category_id === selectedCatId;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 p-4 md:p-6 space-y-4">
      {/* Category Pills Header */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-slate-800">
        <button
          onClick={() => setSelectedCatId('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCatId === 'all'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          📺 All TV Boxsets ({series.length})
        </button>

        {seriesCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCatId(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCatId === cat.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Series Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredSeries.map((s) => {
            const isFav = favorites.includes(s.id);

            return (
              <div
                key={s.id}
                onClick={() => {
                  setSelectedSeries(s);
                  setActiveSeasonIdx(0);
                }}
                className="group relative bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl flex flex-col"
              >
                {/* Cover Poster */}
                <div className="aspect-[2/3] bg-slate-950 relative overflow-hidden">
                  {s.cover ? (
                    <img
                      src={s.cover}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                      <Tv className="w-12 h-12" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                  {/* Rating Badge */}
                  {s.rating && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-amber-500/90 text-slate-950 font-extrabold text-[10px] flex items-center gap-1">
                      <Star className="w-3 h-3 fill-slate-950" /> {s.rating}
                    </span>
                  )}

                  {/* Favorite Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(s.id);
                    }}
                    className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg border transition-colors ${
                      isFav
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="p-3">
                  <p className="font-bold text-xs text-white group-hover:text-cyan-300 truncate">{s.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.seasons.length} Seasons • {s.genre || 'Drama'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Series Detail & Season Episodes Modal */}
      {selectedSeries && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedSeries(null)}
              className="absolute right-4 top-4 p-2.5 text-slate-400 hover:text-white rounded-full bg-slate-950/60 border border-slate-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner */}
            <div className="relative h-56 bg-slate-950">
              <img src={selectedSeries.cover} alt={selectedSeries.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase">
                  {selectedSeries.genre || 'TV Boxset'}
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">{selectedSeries.name}</h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                {selectedSeries.plot || 'Full multi-season television drama series.'}
              </p>

              {/* Seasons Selector Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
                {selectedSeries.seasons.map((season, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => setActiveSeasonIdx(sIdx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeSeasonIdx === sIdx
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {season.name} ({season.episodes.length} Episodes)
                  </button>
                ))}
              </div>

              {/* Episodes List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedSeries.seasons[activeSeasonIdx]?.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-white truncate">{ep.title}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{ep.info?.plot || 'Episode broadcast'}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          onDownloadEpisode({
                            id: `ep_dl_${ep.id}`,
                            title: `${selectedSeries.name} - ${ep.title}`,
                            type: 'episode',
                            poster: selectedSeries.cover,
                            streamUrl: ep.stream_url,
                            sizeMB: 120,
                          })
                        }
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs border border-slate-700"
                        title="Download Episode for Offline"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                      </button>

                      <button
                        onClick={() => {
                          onPlayEpisode(selectedSeries.name, ep);
                          setSelectedSeries(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" /> Play
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

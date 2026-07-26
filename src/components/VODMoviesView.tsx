import React, { useState } from 'react';
import { Download, Film, Heart, Play, Star, X } from 'lucide-react';
import { Category, DownloadItem, VODMovie } from '../types';

interface VODMoviesViewProps {
  movies: VODMovie[];
  categories: Category[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onPlayMovie: (movie: VODMovie) => void;
  onDownloadMovie: (download: Omit<DownloadItem, 'progress' | 'status' | 'addedAt'>) => void;
  searchQuery: string;
}

export const VODMoviesView: React.FC<VODMoviesViewProps> = ({
  movies,
  categories,
  favorites,
  onToggleFavorite,
  onPlayMovie,
  onDownloadMovie,
  searchQuery,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [selectedMovie, setSelectedMovie] = useState<VODMovie | null>(null);

  const vodCategories = categories.filter((c) => !c.hidden && c.type === 'vod');

  const filteredMovies = movies.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.genre && m.genre.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCatId === 'all' || m.category_id === selectedCatId;
    return matchesSearch && matchesCat;
  });

  const handleDownload = (movie: VODMovie) => {
    onDownloadMovie({
      id: `vod_dl_${movie.id}`,
      title: movie.name,
      type: 'movie',
      poster: movie.stream_icon,
      streamUrl: movie.stream_url,
      sizeMB: 180,
    });
    setSelectedMovie(null);
  };

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
          🎬 All Blockbusters ({movies.length})
        </button>

        {vodCategories.map((cat) => (
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

      {/* Movies Poster Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMovies.map((movie) => {
            const isFav = favorites.includes(movie.id);

            return (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                className="group relative bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl flex flex-col"
              >
                {/* Poster Container */}
                <div className="aspect-[2/3] bg-slate-950 relative overflow-hidden">
                  {movie.stream_icon ? (
                    <img
                      src={movie.stream_icon}
                      alt={movie.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                      <Film className="w-12 h-12" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Rating Badge */}
                  {movie.rating && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-amber-500/90 text-slate-950 font-extrabold text-[10px] flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-slate-950" /> {movie.rating}
                    </span>
                  )}

                  {/* Favorite Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(movie.id);
                    }}
                    className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg border transition-colors ${
                      isFav
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
                  </button>

                  {/* Hover Quick Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-950/40 backdrop-blur-xs">
                    <div className="w-12 h-12 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/50 scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Movie Titles */}
                <div className="p-3">
                  <p className="font-bold text-xs text-white group-hover:text-cyan-300 truncate">{movie.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{movie.year} • {movie.genre || 'Action / Drama'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute right-4 top-4 p-2.5 text-slate-400 hover:text-white rounded-full bg-slate-950/60 border border-slate-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Poster Header */}
            <div className="relative h-64 bg-slate-950">
              <img
                src={selectedMovie.stream_icon}
                alt={selectedMovie.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase">
                  {selectedMovie.genre || 'VOD Feature Film'}
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">{selectedMovie.name}</h2>
              </div>
            </div>

            {/* Movie Info & Actions */}
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
                {selectedMovie.rating && (
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" /> {selectedMovie.rating}
                  </span>
                )}
                <span>Year: {selectedMovie.year}</span>
                <span>Duration: {selectedMovie.duration || '01h 45m'}</span>
                <span>Format: 1080p Ultra HD</span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                {selectedMovie.description || 'Full-length high-definition video-on-demand blockbuster.'}
              </p>

              {selectedMovie.cast && (
                <p className="text-xs text-slate-400">
                  <span className="text-slate-200 font-semibold">Starring:</span> {selectedMovie.cast}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleDownload(selectedMovie)}
                  className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4 text-amber-400" /> Download for Offline Viewing
                </button>

                <button
                  onClick={() => {
                    onPlayMovie(selectedMovie);
                    setSelectedMovie(null);
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/50"
                >
                  <Play className="w-4 h-4 fill-slate-950" /> Play Movie Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

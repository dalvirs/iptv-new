import React from 'react';
import { Calendar, Disc, Film, Heart, ListFilter, Radio, Tv } from 'lucide-react';

export type NavTab = 'live' | 'epg' | 'vod' | 'series' | 'recordings' | 'favorites' | 'categories';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  favoritesCount: number;
  recordingsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  recordingsCount,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'live', label: 'Live TV', icon: Radio },
    { id: 'epg', label: 'EPG Guide', icon: Calendar },
    { id: 'vod', label: 'Movies', icon: Film },
    { id: 'series', label: 'TV Series', icon: Tv },
    { id: 'recordings', label: 'Recordings', icon: Disc, badge: recordingsCount },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favoritesCount },
    { id: 'categories', label: 'Categories', icon: ListFilter },
  ];

  return (
    <aside id="app-sidebar" className="w-16 md:w-56 bg-slate-950/80 backdrop-blur-lg border-r border-slate-800/80 flex flex-col justify-between py-4 shrink-0 select-none z-10">
      <nav className="flex flex-col gap-1 px-2 md:px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all relative group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-white border border-cyan-500/40 shadow-lg shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              <span className="hidden md:inline truncate">{item.label}</span>

              {/* Badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="hidden md:inline-flex ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {item.badge}
                </span>
              )}

              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full shadow-glow" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="px-3 pt-4 border-t border-slate-800/60 hidden md:block">
        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-300">Xtream IPTV Engine</p>
          <p className="text-slate-500 mt-0.5">EPG Sync • HLS 4K</p>
        </div>
      </div>
    </aside>
  );
};

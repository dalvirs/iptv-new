import React from 'react';
import { Download, HardDrive, Radio, Search, Server, Settings, ShieldCheck, User } from 'lucide-react';
import { DownloadItem, Recording, XtreamServerProfile } from '../types';

interface HeaderProps {
  activeProfile: XtreamServerProfile;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenLogin: () => void;
  onOpenSettings: () => void;
  isRecordingLive: boolean;
  recordingDuration: number;
  onStopRecording: () => void;
  downloads: DownloadItem[];
  recordings: Recording[];
  onNavigateToRecordings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeProfile,
  searchQuery,
  setSearchQuery,
  onOpenLogin,
  onOpenSettings,
  isRecordingLive,
  recordingDuration,
  onStopRecording,
  downloads,
  onNavigateToRecordings,
}) => {
  const activeDownloads = downloads.filter((d) => d.status === 'downloading').length;

  const formatSec = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header id="app-header" className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between gap-4 z-20 shrink-0">
      {/* Brand & Server Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                IB PRO
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 tracking-wider">
                IPTV 4K
              </span>
            </div>
          </div>
        </div>

        {/* Server Profile Badge */}
        <button
          onClick={onOpenLogin}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 text-xs text-slate-300 transition-colors group"
          title="Switch Playlist / Server Account"
        >
          <Server className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="max-w-[140px] truncate font-medium text-slate-200">{activeProfile.name}</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />
        </button>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Live Channels, Movies, Series, EPG..."
            className="w-full bg-slate-950/60 border border-slate-800/90 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Live Recording Indicator */}
        {isRecordingLive && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-600/50 text-rose-300 text-xs font-medium animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>REC {formatSec(recordingDuration)}</span>
            <button
              onClick={onStopRecording}
              className="ml-1 px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] uppercase font-bold"
            >
              Stop
            </button>
          </div>
        )}

        {/* Active Downloads Pill */}
        <button
          onClick={onNavigateToRecordings}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            activeDownloads > 0
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
              : 'bg-slate-800/60 hover:bg-slate-700/80 border-slate-700/60 text-slate-300'
          }`}
          title="Downloads & Recordings Storage"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span className="hidden md:inline">Downloads</span>
          {activeDownloads > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
              {activeDownloads}
            </span>
          )}
        </button>

        {/* Accounts / Server Config Button */}
        <button
          onClick={onOpenLogin}
          className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
          title="Account / Server Profiles"
        >
          <User className="w-4 h-4" />
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
          title="Player & App Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

import React, { useEffect, useState } from 'react';
import { Clock, Disc, Download, HardDrive, Play, Trash2, CheckCircle, Pause, AlertCircle, RefreshCw } from 'lucide-react';
import { getStorageUsage } from '../services/db';
import { DownloadItem, Recording, ScheduledProgram } from '../types';

interface RecordingsViewProps {
  recordings: Recording[];
  onDeleteRecording: (id: string) => void;
  onPlayRecording: (rec: Recording) => void;
  scheduledPrograms: ScheduledProgram[];
  onDeleteSchedule: (id: string) => void;
  downloads: DownloadItem[];
  onDeleteDownload: (id: string) => void;
  onPlayDownload: (dl: DownloadItem) => void;
}

export const RecordingsView: React.FC<RecordingsViewProps> = ({
  recordings,
  onDeleteRecording,
  onPlayRecording,
  scheduledPrograms,
  onDeleteSchedule,
  downloads,
  onDeleteDownload,
  onPlayDownload,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'recordings' | 'scheduled' | 'downloads'>('recordings');
  const [storageStats, setStorageStats] = useState<{ usedMB: number; fileCount: number }>({ usedMB: 0, fileCount: 0 });

  useEffect(() => {
    getStorageUsage().then(setStorageStats);
  }, [recordings, downloads]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 p-4 md:p-6 space-y-4">
      {/* Top Storage Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Offline Storage & DVR Center</h2>
            <p className="text-xs text-slate-400">
              {storageStats.usedMB} MB Used ({storageStats.fileCount} Media Files saved offline)
            </p>
          </div>
        </div>

        {/* Storage Bar Gauge */}
        <div className="w-full sm:w-64 space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>IndexedDB Quota</span>
            <span className="text-amber-400 font-bold">{storageStats.usedMB} MB</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, (storageStats.usedMB / 2000) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 pb-2 gap-2">
        <button
          onClick={() => setActiveSubTab('recordings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'recordings'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Disc className="w-4 h-4 text-rose-500" /> Recorded Live TV ({recordings.length})
        </button>

        <button
          onClick={() => setActiveSubTab('scheduled')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'scheduled'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 text-cyan-400" /> Scheduled DVR ({scheduledPrograms.length})
        </button>

        <button
          onClick={() => setActiveSubTab('downloads')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'downloads'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Download className="w-4 h-4 text-amber-400" /> Offline Downloads ({downloads.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pr-1">
        {activeSubTab === 'recordings' && (
          <div className="space-y-3">
            {recordings.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-slate-500 text-center space-y-2">
                <Disc className="w-12 h-12 text-slate-700" />
                <p className="text-sm font-semibold text-slate-300">No Recorded TV Clips</p>
                <p className="text-xs">Press the 'Record' button while watching any live channel to record video clips.</p>
              </div>
            ) : (
              recordings.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                      <Disc className="w-6 h-6 animate-spin" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{rec.title}</h4>
                      <p className="text-xs text-slate-400">
                        {rec.channelName} • Recorded on {new Date(rec.recordedDate).toLocaleDateString()} • {rec.durationSeconds}s ({rec.fileSizeMB || 15} MB)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPlayRecording(rec)}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" /> Play Recorded Clip
                    </button>

                    <button
                      onClick={() => onDeleteRecording(rec.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs"
                      title="Delete Recording"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeSubTab === 'scheduled' && (
          <div className="space-y-3">
            {scheduledPrograms.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-slate-500 text-center space-y-2">
                <Clock className="w-12 h-12 text-slate-700" />
                <p className="text-sm font-semibold text-slate-300">No Scheduled Recordings</p>
                <p className="text-xs">Schedule future TV recordings directly from the EPG guide.</p>
              </div>
            ) : (
              scheduledPrograms.map((prog) => (
                <div
                  key={prog.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {prog.status.toUpperCase()}
                      </span>
                      <h4 className="font-bold text-sm text-white">{prog.programTitle}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {prog.channelName} • Starts: {new Date(prog.startTime).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => onDeleteSchedule(prog.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs"
                    title="Cancel Scheduled Recording"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeSubTab === 'downloads' && (
          <div className="space-y-3">
            {downloads.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-slate-500 text-center space-y-2">
                <Download className="w-12 h-12 text-slate-700" />
                <p className="text-sm font-semibold text-slate-300">No Offline Downloads</p>
                <p className="text-xs">Download Movies and TV Series for offline viewing without an internet connection.</p>
              </div>
            ) : (
              downloads.map((dl) => (
                <div
                  key={dl.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                        {dl.poster ? (
                          <img src={dl.poster} alt={dl.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <Download className="w-5 h-5 text-amber-400 m-auto mt-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{dl.title}</h4>
                        <p className="text-xs text-slate-400">
                          {dl.status === 'completed'
                            ? `Downloaded (${dl.sizeMB} MB)`
                            : `Downloading • ${dl.downloadedMB || 0} / ${dl.sizeMB} MB (${dl.speedMbps || 18} Mbps)`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {dl.status === 'completed' && (
                        <button
                          onClick={() => onPlayDownload(dl)}
                          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-slate-950" /> Play Offline
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteDownload(dl.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Download Progress Bar */}
                  {dl.status === 'downloading' && (
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${dl.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

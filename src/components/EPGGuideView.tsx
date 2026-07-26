import React, { useState } from 'react';
import { Calendar, Clock, Disc, Play, Radio, Star, Tv, X } from 'lucide-react';
import { Channel, EPGProgram, ScheduledProgram } from '../types';

interface EPGGuideViewProps {
  channels: Channel[];
  epgPrograms: EPGProgram[];
  onPlayChannel: (channel: Channel) => void;
  onScheduleProgram: (prog: ScheduledProgram) => void;
  scheduledPrograms: ScheduledProgram[];
}

export const EPGGuideView: React.FC<EPGGuideViewProps> = ({
  channels,
  epgPrograms,
  onPlayChannel,
  onScheduleProgram,
  scheduledPrograms,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<{ prog: EPGProgram; channel: Channel } | null>(null);

  const now = new Date();

  // Generate 8 hour slots around current time
  const timeSlots: Date[] = [];
  const baseHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1, 0, 0);

  for (let i = 0; i < 8; i++) {
    timeSlots.push(new Date(baseHour.getTime() + i * 60 * 60000));
  }

  const formatHour = (d: Date) => {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isProgramScheduled = (epgId: string) => {
    return scheduledPrograms.some((sp) => sp.id === `sched_${epgId}`);
  };

  const handleCreateSchedule = () => {
    if (!selectedProgram) return;

    const { prog, channel } = selectedProgram;

    const newSchedule: ScheduledProgram = {
      id: `sched_${prog.id}`,
      channelId: channel.id,
      channelName: channel.name,
      channelLogo: channel.stream_icon,
      programTitle: prog.title,
      programDescription: prog.description,
      startTime: prog.start,
      endTime: prog.end,
      streamUrl: channel.url,
      recordAutomatically: true,
      autoDownload: true,
      repeat: 'once',
      status: 'upcoming',
    };

    onScheduleProgram(newSchedule);
    setSelectedProgram(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 p-4 md:p-6 space-y-4">
      {/* Top EPG Bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" /> Electronic Program Guide (EPG)
          </h2>
          <p className="text-xs text-slate-400">Live TV schedule grid. Click any show to watch or schedule auto-recording.</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
          <Clock className="w-4 h-4 animate-spin" /> {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Grid Guide Table Container */}
      <div className="flex-1 overflow-x-auto overflow-y-auto border border-slate-800 rounded-2xl bg-slate-900/60">
        <div className="min-w-[900px]">
          {/* Time Header Row */}
          <div className="flex border-b border-slate-800 bg-slate-950/90 sticky top-0 z-10">
            <div className="w-56 p-3 text-xs font-bold text-slate-400 border-r border-slate-800 shrink-0 bg-slate-950">
              CHANNELS
            </div>
            <div className="flex-1 flex">
              {timeSlots.map((ts, idx) => (
                <div key={idx} className="flex-1 min-w-[120px] p-3 text-center text-xs font-mono font-bold text-cyan-400 border-r border-slate-800/60">
                  {formatHour(ts)}
                </div>
              ))}
            </div>
          </div>

          {/* Channel Program Rows */}
          {channels.map((channel) => {
            const chProgs = epgPrograms.filter((p) => p.channel_id === channel.id);

            return (
              <div key={channel.id} className="flex border-b border-slate-800/60 hover:bg-slate-900/40 transition-colors">
                {/* Channel Meta Cell */}
                <div
                  onClick={() => onPlayChannel(channel)}
                  className="w-56 p-3 border-r border-slate-800 shrink-0 flex items-center gap-3 cursor-pointer group bg-slate-950/40"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 p-0.5 overflow-hidden flex items-center justify-center shrink-0">
                    {channel.stream_icon ? (
                      <img src={channel.stream_icon} alt={channel.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <Radio className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">{channel.name}</p>
                    <p className="text-[10px] font-mono text-slate-500">CH #{channel.num || channel.stream_id}</p>
                  </div>
                </div>

                {/* Timeline Programs Row */}
                <div className="flex-1 flex p-1.5 gap-1.5 overflow-x-hidden">
                  {chProgs.map((prog) => {
                    const startD = new Date(prog.start);
                    const endD = new Date(prog.end);
                    const isLive = now >= startD && now <= endD;
                    const scheduled = isProgramScheduled(prog.id);

                    return (
                      <div
                        key={prog.id}
                        onClick={() => setSelectedProgram({ prog, channel })}
                        className={`flex-1 min-w-[140px] p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                          isLive
                            ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-cyan-500/60 text-white shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/30'
                            : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-mono font-semibold text-slate-400">
                              {formatHour(startD)} - {formatHour(endD)}
                            </span>
                            {isLive && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> LIVE
                              </span>
                            )}
                            {scheduled && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                REC SCHED
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-xs line-clamp-1">{prog.title}</p>
                        </div>

                        {prog.category && (
                          <span className="text-[10px] text-cyan-400/80 font-medium">{prog.category}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedProgram(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center">
                {selectedProgram.channel.stream_icon ? (
                  <img
                    src={selectedProgram.channel.stream_icon}
                    alt={selectedProgram.channel.name}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Tv className="w-6 h-6 text-cyan-400" />
                )}
              </div>
              <div>
                <p className="text-xs text-cyan-400 font-semibold">{selectedProgram.channel.name}</p>
                <h3 className="text-lg font-bold text-white">{selectedProgram.prog.title}</h3>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
              <p className="text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-cyan-400" />
                {new Date(selectedProgram.prog.start).toLocaleString()} - {new Date(selectedProgram.prog.end).toLocaleTimeString()}
              </p>
              {selectedProgram.prog.category && (
                <p className="text-slate-300">
                  Genre: <span className="text-cyan-300 font-semibold">{selectedProgram.prog.category}</span>
                </p>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
              {selectedProgram.prog.description || 'Live television broadcast program metadata provided by Xtream EPG.'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleCreateSchedule}
                className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Disc className="w-4 h-4 text-rose-400" /> Schedule TV Recording
              </button>

              <button
                onClick={() => {
                  onPlayChannel(selectedProgram.channel);
                  setSelectedProgram(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/50"
              >
                <Play className="w-4 h-4 fill-slate-950" /> Watch Live Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

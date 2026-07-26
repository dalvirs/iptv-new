import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  AlertCircle,
  Monitor,
  Check,
  Disc,
  Maximize2,
  Minimize2,
  MoreVertical,
  Volume2,
  VolumeX,
  X,
  Zap,
  Lock,
  Unlock,
  Radio,
  Subtitles,
  Layers,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Channel, PlayerSettings, Recording } from '../types';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  streamUrl: string;
  channel?: Channel;
  channelsList?: Channel[];
  onSelectChannel?: (channel: Channel) => void;
  settings: PlayerSettings;
  isLiveRecording: boolean;
  recordingDuration: number;
  recordingSizeMB: number;
  onStartRecording: (videoElem: HTMLVideoElement | null) => void;
  onStopRecording: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  title,
  streamUrl,
  channel,
  channelsList = [],
  onSelectChannel,
  settings,
  isLiveRecording,
  recordingDuration,
  recordingSizeMB,
  onStartRecording,
  onStopRecording,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | 'fit' | 'fill'>(settings.aspectRatio || '16:9');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showZappingDrawer, setShowZappingDrawer] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [qualityLevels, setQualityLevels] = useState<{ id: number; height: number }[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = Auto
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);

  // Setup HLS Stream Player
  useEffect(() => {
    if (!isOpen || !streamUrl) return;

    setErrorMessage('');
    const video = videoRef.current;
    if (!video) return;

    // Use Express CORS proxy if required
    let finalUrl = streamUrl;
    if (settings.useProxy || (!streamUrl.includes(window.location.hostname) && !streamUrl.startsWith('blob:'))) {
      finalUrl = `/api/proxy?url=${encodeURIComponent(streamUrl)}`;
    }

    if (Hls.isSupported() && (streamUrl.endsWith('.m3u8') || streamUrl.includes('m3u8') || streamUrl.includes('/live/'))) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hlsRef.current = hls;
      hls.loadSource(finalUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const levels = data.levels.map((lvl, index) => ({ id: index, height: lvl.height }));
        setQualityLevels(levels);
        video.play().catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setErrorMessage('Failed to decode IPTV stream format.');
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Apple HLS support
      video.src = finalUrl;
      video.play().catch(() => setIsPlaying(false));
    } else {
      // Direct MP4 / Blob / Fallback playback
      video.src = finalUrl;
      video.play().catch(() => setIsPlaying(false));
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [isOpen, streamUrl, settings.useProxy]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleQualityChange = (levelIdx: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIdx;
      setCurrentQuality(levelIdx);
    }
    setShowQualityMenu(false);
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else if (videoRef.current.requestPictureInPicture) {
      await videoRef.current.requestPictureInPicture();
    }
  };

  const cycleAspectRatio = () => {
    const modes: ('16:9' | '4:3' | 'fit' | 'fill')[] = ['16:9', '4:3', 'fit', 'fill'];
    const nextIdx = (modes.indexOf(aspectRatio) + 1) % modes.length;
    setAspectRatio(modes[nextIdx]);
  };

  const formatSec = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '4:3':
        return 'aspect-[4/3] object-contain max-h-full mx-auto';
      case 'fit':
        return 'object-contain w-full h-full';
      case 'fill':
        return 'object-cover w-full h-full';
      default:
        return 'aspect-video object-contain w-full h-full';
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden select-none">
      {/* Main Video View */}
      <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
        <video
          ref={videoRef}
          className={`${getAspectClass()} transition-all duration-300`}
          playsInline
          autoPlay
          onClick={togglePlay}
        />

        {/* Error Overlay */}
        {errorMessage && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center p-6 space-y-3 z-20">
            <AlertCircle className="w-12 h-12 text-rose-500 animate-pulse" />
            <p className="text-lg font-bold text-white">Stream Playback Failed</p>
            <p className="text-xs text-slate-400 max-w-md">{errorMessage}</p>
            <button
              onClick={() => {
                setErrorMessage('');
                if (videoRef.current) videoRef.current.load();
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Live Recording HUD Badge */}
        {isLiveRecording && (
          <div className="absolute top-6 left-6 z-30 flex items-center gap-3 px-4 py-2 rounded-2xl bg-rose-950/90 border border-rose-500/60 text-white shadow-2xl backdrop-blur-md animate-pulse">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-rose-300">Live Recording</p>
              <p className="text-[11px] font-mono text-slate-200">
                {formatSec(recordingDuration)} • {recordingSizeMB} MB Saved
              </p>
            </div>
            <button
              onClick={onStopRecording}
              className="ml-2 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
            >
              Stop & Save
            </button>
          </div>
        )}

        {/* Top Floating Player Bar */}
        {!isLocked && (
          <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between z-30 opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3">
              {channel?.stream_icon && (
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 p-1 overflow-hidden shrink-0">
                  <img src={channel.stream_icon} alt={title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-base text-white">{title}</h3>
                <p className="text-xs text-cyan-400 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Stream 4K • HLS Protocol
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowZappingDrawer(!showZappingDrawer)}
                className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 backdrop-blur-md"
              >
                <Layers className="w-4 h-4 text-cyan-400" /> Channels Zapper
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Side Channel Zapping Drawer */}
        {showZappingDrawer && !isLocked && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-slate-950/90 backdrop-blur-xl border-l border-slate-800/80 p-4 z-40 flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" /> Quick Zapping List
              </span>
              <button onClick={() => setShowZappingDrawer(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {channelsList.map((ch) => {
                const isActive = channel?.id === ch.id;
                return (
                  <div
                    key={ch.id}
                    onClick={() => {
                      if (onSelectChannel) onSelectChannel(ch);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      isActive
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-white font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center border border-slate-800 p-0.5">
                      {ch.stream_icon ? (
                        <img src={ch.stream_icon} alt={ch.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        <Radio className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs truncate">{ch.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">CH #{ch.num || ch.stream_id}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Player Controls Bar */}
        {!isLocked && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-30 flex items-center justify-between gap-4 opacity-90 hover:opacity-100 transition-opacity">
            {/* Left Controls: Play / Mute / Record */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/60"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
              </button>

              {/* Record Button */}
              {!isLiveRecording ? (
                <button
                  onClick={() => onStartRecording(videoRef.current)}
                  className="px-4 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 border border-rose-500/50 shadow-lg shadow-rose-950/50"
                >
                  <Disc className="w-4 h-4 text-white" /> Record Stream
                </button>
              ) : (
                <button
                  onClick={onStopRecording}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold border border-rose-500/50"
                >
                  Stop Recording
                </button>
              )}
            </div>

            {/* Right Controls: Aspect Ratio / PiP / Quality / Lock */}
            <div className="flex items-center gap-2">
              <button
                onClick={cycleAspectRatio}
                className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
                title="Aspect Ratio"
              >
                <Monitor className="w-4 h-4 text-cyan-400" /> {aspectRatio.toUpperCase()}
              </button>

              <button
                onClick={togglePiP}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200"
                title="Picture in Picture"
              >
                <Minimize2 className="w-4 h-4" />
              </button>

              {/* Quality Switcher Button */}
              {qualityLevels.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-cyan-300"
                  >
                    Quality: {currentQuality === -1 ? 'Auto' : `${qualityLevels[currentQuality]?.height}p`}
                  </button>

                  {showQualityMenu && (
                    <div className="absolute bottom-12 right-0 bg-slate-900 border border-slate-800 rounded-xl p-2 w-36 shadow-2xl space-y-1">
                      <button
                        onClick={() => handleQualityChange(-1)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                          currentQuality === -1 ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        Auto (Best)
                      </button>
                      {qualityLevels.map((lvl) => (
                        <button
                          key={lvl.id}
                          onClick={() => handleQualityChange(lvl.id)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                            currentQuality === lvl.id ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {lvl.height}p HD
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Lock Screen Toggle */}
              <button
                onClick={() => setIsLocked(true)}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200"
                title="Lock Screen Controls"
              >
                <Lock className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Lock Indicator when controls hidden */}
        {isLocked && (
          <button
            onClick={() => setIsLocked(false)}
            className="absolute top-6 right-6 z-50 p-3 rounded-full bg-slate-900/90 border border-cyan-500 text-cyan-400 shadow-2xl"
            title="Unlock Controls"
          >
            <Unlock className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

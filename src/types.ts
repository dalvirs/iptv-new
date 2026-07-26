export type PlaylistType = 'xtream' | 'm3u' | 'demo';

export interface XtreamServerProfile {
  id: string;
  name: string;
  type: PlaylistType;
  host?: string;
  username?: string;
  password?: string;
  m3uUrl?: string;
  m3uContent?: string;
  active: boolean;
  createdAt: string;
  lastSyncedAt?: string;
  userInfo?: {
    username: string;
    status: string;
    expDate: string;
    isTrial: boolean;
    activeCons: number;
    maxCons: number;
    allowedOutputFormats: string[];
  };
}

export interface Category {
  id: string;
  name: string;
  type: 'live' | 'vod' | 'series';
  hidden: boolean;
  order: number;
  icon?: string;
  custom?: boolean;
}

export interface Channel {
  id: string;
  stream_id: number | string;
  name: string;
  num?: number;
  stream_icon?: string;
  epg_channel_id?: string;
  category_id: string;
  category_name?: string;
  stream_type?: string;
  url: string;
  favorite?: boolean;
  customCategory?: string;
  addedAt?: string;
  resolution?: string;
  fps?: number;
}

export interface EPGProgram {
  id: string;
  channel_id: string;
  title: string;
  start: string; // ISO string or timestamp
  end: string;   // ISO string or timestamp
  description: string;
  category?: string;
  rating?: string;
  poster?: string;
}

export interface VODMovie {
  id: string;
  stream_id: number | string;
  name: string;
  stream_icon?: string;
  rating?: string;
  added?: string;
  category_id: string;
  category_name?: string;
  container_extension?: string;
  year?: string;
  description?: string;
  cast?: string;
  director?: string;
  genre?: string;
  duration?: string;
  durationSeconds?: number;
  stream_url: string;
  favorite?: boolean;
  downloaded?: boolean;
}

export interface Episode {
  id: string;
  episode_num: number;
  title: string;
  container_extension: string;
  info?: {
    duration?: string;
    rating?: string;
    plot?: string;
    releasedate?: string;
  };
  stream_url: string;
}

export interface Season {
  season_number: number;
  name: string;
  cover?: string;
  episodes: Episode[];
}

export interface VODSeries {
  id: string;
  series_id: number | string;
  name: string;
  cover?: string;
  rating?: string;
  category_id: string;
  category_name?: string;
  releaseDate?: string;
  genre?: string;
  plot?: string;
  cast?: string;
  director?: string;
  seasons: Season[];
  favorite?: boolean;
}

export interface Recording {
  id: string;
  channelId: string;
  channelName: string;
  channelLogo?: string;
  title: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  status: 'recording' | 'completed' | 'scheduled' | 'failed';
  streamUrl: string;
  blobKey?: string; // stored in IndexedDB
  fileSizeMB?: number;
  recordedDate: string;
}

export interface ScheduledProgram {
  id: string;
  channelId: string;
  channelName: string;
  channelLogo?: string;
  programTitle: string;
  programDescription?: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  streamUrl: string;
  recordAutomatically: boolean;
  autoDownload: boolean;
  repeat: 'once' | 'daily' | 'weekly';
  status: 'upcoming' | 'recording' | 'completed' | 'cancelled';
}

export interface DownloadItem {
  id: string;
  title: string;
  type: 'movie' | 'episode' | 'recording';
  poster?: string;
  streamUrl: string;
  blobKey?: string; // IndexedDB key
  progress: number; // 0-100
  speedMbps?: number;
  status: 'queued' | 'downloading' | 'completed' | 'paused' | 'error';
  sizeMB?: number;
  downloadedMB?: number;
  addedAt: string;
  errorMessage?: string;
}

export interface PlayerSettings {
  aspectRatio: '16:9' | '4:3' | 'fit' | 'fill';
  defaultQuality: 'auto' | '1080p' | '720p' | '480p';
  hardwareAcceleration: boolean;
  autoPlayNextEpisode: boolean;
  useProxy: boolean;
  bufferSizeSeconds: number;
  subtitlesEnabled: boolean;
  subtitleLanguage: string;
}

import {
  Category,
  Channel,
  DownloadItem,
  EPGProgram,
  PlayerSettings,
  Recording,
  ScheduledProgram,
  VODMovie,
  VODSeries,
  XtreamServerProfile,
} from '../types';
import { DEMO_CATEGORIES, DEMO_CHANNELS, DEMO_PROFILE, DEMO_VOD_MOVIES, DEMO_VOD_SERIES, getDemoEPGPrograms } from '../data/demoData';

const STORAGE_KEYS = {
  PROFILES: 'ibpro_profiles',
  ACTIVE_PROFILE_ID: 'ibpro_active_profile_id',
  CATEGORIES: 'ibpro_categories',
  CHANNELS: 'ibpro_channels',
  FAVORITES: 'ibpro_favorites',
  RECORDINGS: 'ibpro_recordings',
  SCHEDULED: 'ibpro_scheduled',
  DOWNLOADS: 'ibpro_downloads',
  SETTINGS: 'ibpro_settings',
  RECENT_CHANNELS: 'ibpro_recent_channels',
};

export const DEFAULT_SETTINGS: PlayerSettings = {
  aspectRatio: '16:9',
  defaultQuality: 'auto',
  hardwareAcceleration: true,
  autoPlayNextEpisode: true,
  useProxy: false,
  bufferSizeSeconds: 30,
  subtitlesEnabled: true,
  subtitleLanguage: 'English',
};

// Profiles Management
export function getProfiles(): XtreamServerProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!raw) {
      const initial = [DEMO_PROFILE];
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [DEMO_PROFILE];
  }
}

export function saveProfiles(profiles: XtreamServerProfile[]): void {
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
}

export function getActiveProfile(): XtreamServerProfile {
  const profiles = getProfiles();
  const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
  const found = profiles.find((p) => p.id === activeId && p.active);
  if (found) return found;

  const demo = profiles.find((p) => p.type === 'demo') || profiles[0] || DEMO_PROFILE;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, demo.id);
  return demo;
}

export function setActiveProfile(id: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
}

// Categories Management
export function getCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEMO_CATEGORIES));
      return DEMO_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch {
    return DEMO_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

// Favorites & Channels
export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : ['chan-1', 'chan-2', 'chan-4', 'chan-7', 'vod-1', 'vod-3'];
  } catch {
    return ['chan-1', 'chan-2', 'chan-4', 'chan-7', 'vod-1', 'vod-3'];
  }
}

export function toggleFavorite(itemId: string): string[] {
  const current = getFavorites();
  let updated: string[];
  if (current.includes(itemId)) {
    updated = current.filter((id) => id !== itemId);
  } else {
    updated = [...current, itemId];
  }
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  return updated;
}

// Recordings Storage
export function getRecordings(): Recording[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDINGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecording(recording: Recording): void {
  const current = getRecordings();
  const index = current.findIndex((r) => r.id === recording.id);
  let updated: Recording[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = recording;
  } else {
    updated = [recording, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(updated));
}

export function deleteRecording(id: string): void {
  const current = getRecordings();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(updated));
}

// Scheduled Programs
export function getScheduledPrograms(): ScheduledProgram[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveScheduledProgram(program: ScheduledProgram): void {
  const current = getScheduledPrograms();
  const index = current.findIndex((p) => p.id === program.id);
  let updated: ScheduledProgram[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = program;
  } else {
    updated = [program, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.SCHEDULED, JSON.stringify(updated));
}

export function deleteScheduledProgram(id: string): void {
  const current = getScheduledPrograms();
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.SCHEDULED, JSON.stringify(updated));
}

// Offline Downloads
export function getDownloads(): DownloadItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOWNLOADS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDownload(download: DownloadItem): void {
  const current = getDownloads();
  const index = current.findIndex((d) => d.id === download.id);
  let updated: DownloadItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = download;
  } else {
    updated = [download, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(updated));
}

export function deleteDownload(id: string): void {
  const current = getDownloads();
  const updated = current.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(updated));
}

// Settings
export function getSettings(): PlayerSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: PlayerSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// Recent Zapped Channels
export function getRecentChannels(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT_CHANNELS);
    return raw ? JSON.parse(raw) : ['chan-1', 'chan-2', 'chan-4'];
  } catch {
    return ['chan-1', 'chan-2', 'chan-4'];
  }
}

export function addRecentChannel(channelId: string): void {
  const current = getRecentChannels();
  const updated = [channelId, ...current.filter((id) => id !== channelId)].slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.RECENT_CHANNELS, JSON.stringify(updated));
}

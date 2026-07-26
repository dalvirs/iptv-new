/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { CategoryManagerView } from './components/CategoryManagerView';
import { EPGGuideView } from './components/EPGGuideView';
import { Header } from './components/Header';
import { LiveTVView } from './components/LiveTVView';
import { LoginModal } from './components/LoginModal';
import { RecordingsView } from './components/RecordingsView';
import { SeriesView } from './components/SeriesView';
import { SettingsModal } from './components/SettingsModal';
import { NavTab, Sidebar } from './components/Sidebar';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { VODMoviesView } from './components/VODMoviesView';
import { DEMO_CATEGORIES, DEMO_CHANNELS, DEMO_PROFILE, DEMO_VOD_MOVIES, DEMO_VOD_SERIES, getDemoEPGPrograms } from './data/demoData';
import { getMediaBlob } from './services/db';
import { startDownload } from './services/downloader';
import { globalLiveRecorder, initRecordingScheduler } from './services/recorder';
import {
  deleteDownload,
  deleteRecording,
  deleteScheduledProgram,
  getActiveProfile,
  getCategories,
  getDownloads,
  getFavorites,
  getProfiles,
  getRecordings,
  getScheduledPrograms,
  getSettings,
  saveCategories,
  saveProfiles,
  saveScheduledProgram,
  saveSettings,
  setActiveProfile,
  toggleFavorite,
} from './services/storage';
import {
  Category,
  Channel,
  DownloadItem,
  EPGProgram,
  Episode,
  PlayerSettings,
  Recording,
  ScheduledProgram,
  VODMovie,
  VODSeries,
  XtreamServerProfile,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('live');
  const [searchQuery, setSearchQuery] = useState('');

  // Profiles & Settings
  const [profiles, setProfiles] = useState<XtreamServerProfile[]>(getProfiles());
  const [activeProfile, setActiveProfileState] = useState<XtreamServerProfile>(getActiveProfile());
  const [categories, setCategories] = useState<Category[]>(getCategories());
  const [settings, setSettingsState] = useState<PlayerSettings>(getSettings());

  // Channels & EPG
  const [channels, setChannels] = useState<Channel[]>(DEMO_CHANNELS);
  const [epgPrograms, setEpgPrograms] = useState<EPGProgram[]>(getDemoEPGPrograms());
  const [movies, setMovies] = useState<VODMovie[]>(DEMO_VOD_MOVIES);
  const [series, setSeries] = useState<VODSeries[]>(DEMO_VOD_SERIES);

  // User Lists
  const [favorites, setFavorites] = useState<string[]>(getFavorites());
  const [recordings, setRecordings] = useState<Recording[]>(getRecordings());
  const [scheduledPrograms, setScheduledPrograms] = useState<ScheduledProgram[]>(getScheduledPrograms());
  const [downloads, setDownloads] = useState<DownloadItem[]>(getDownloads());

  // Modals
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Video Player Modal
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [playerStream, setPlayerStream] = useState<{
    title: string;
    url: string;
    channel?: Channel;
  }>({ title: '', url: '' });

  // Live Recording State
  const [isLiveRecording, setIsLiveRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingSizeMB, setRecordingSizeMB] = useState(0);

  // Init Background Recording Scheduler
  useEffect(() => {
    initRecordingScheduler(() => {
      setScheduledPrograms(getScheduledPrograms());
      setRecordings(getRecordings());
    });
  }, []);

  // Sync Favorites Toggle
  const handleToggleFav = (id: string) => {
    const updated = toggleFavorite(id);
    setFavorites(updated);
  };

  // Switch / Save Profiles
  const handleSelectProfile = (profile: XtreamServerProfile) => {
    setActiveProfile(profile.id);
    setActiveProfileState(profile);
  };

  const handleSaveProfile = (newProfile: XtreamServerProfile) => {
    const updated = [newProfile, ...profiles.filter((p) => p.id !== newProfile.id)];
    saveProfiles(updated);
    setProfiles(updated);
  };

  // Save Settings
  const handleSaveSettings = (newSettings: PlayerSettings) => {
    saveSettings(newSettings);
    setSettingsState(newSettings);
  };

  // Play Channel
  const handlePlayChannel = (channel: Channel) => {
    setPlayerStream({
      title: channel.name,
      url: channel.url,
      channel,
    });
    setPlayerModalOpen(true);
  };

  // Play Movie
  const handlePlayMovie = (movie: VODMovie) => {
    setPlayerStream({
      title: movie.name,
      url: movie.stream_url,
    });
    setPlayerModalOpen(true);
  };

  // Play Series Episode
  const handlePlayEpisode = (seriesName: string, ep: Episode) => {
    setPlayerStream({
      title: `${seriesName} - ${ep.title}`,
      url: ep.stream_url,
    });
    setPlayerModalOpen(true);
  };

  // Play Recorded Clip (From IndexedDB Blob or URL)
  const handlePlayRecording = async (rec: Recording) => {
    let playUrl = rec.streamUrl;
    if (rec.blobKey) {
      const blob = await getMediaBlob(rec.blobKey);
      if (blob) {
        playUrl = URL.createObjectURL(blob);
      }
    }

    setPlayerStream({
      title: rec.title,
      url: playUrl || rec.streamUrl,
    });
    setPlayerModalOpen(true);
  };

  // Play Downloaded VOD File (From IndexedDB Blob or URL)
  const handlePlayDownload = async (dl: DownloadItem) => {
    let playUrl = dl.streamUrl;
    if (dl.blobKey) {
      const blob = await getMediaBlob(dl.blobKey);
      if (blob) {
        playUrl = URL.createObjectURL(blob);
      }
    }

    setPlayerStream({
      title: dl.title,
      url: playUrl || dl.streamUrl,
    });
    setPlayerModalOpen(true);
  };

  // Live TV Recording Controls
  const handleStartRecordChannel = (channel: Channel) => {
    globalLiveRecorder.startLiveRecording(
      channel.id,
      channel.name,
      channel.stream_icon,
      channel.url,
      null,
      (sec, mb) => {
        setRecordingDuration(sec);
        setRecordingSizeMB(mb);
      }
    );
    setIsLiveRecording(true);
  };

  const handleStartRecordFromPlayer = (videoElem: HTMLVideoElement | null) => {
    const name = playerStream.title || 'Live TV Stream';
    globalLiveRecorder.startLiveRecording('live', name, undefined, playerStream.url, videoElem, (sec, mb) => {
      setRecordingDuration(sec);
      setRecordingSizeMB(mb);
    });
    setIsLiveRecording(true);
  };

  const handleStopRecording = async () => {
    const completed = await globalLiveRecorder.stopLiveRecording(playerStream.title || 'Live Stream');
    setIsLiveRecording(false);
    setRecordings(getRecordings());
  };

  // Download VOD Item
  const handleStartDownload = (dl: Omit<DownloadItem, 'progress' | 'status' | 'addedAt'>) => {
    startDownload(dl, () => {
      setDownloads(getDownloads());
    });
    setDownloads(getDownloads());
  };

  // Schedule Program
  const handleScheduleProgram = (prog: ScheduledProgram) => {
    saveScheduledProgram(prog);
    setScheduledPrograms(getScheduledPrograms());
  };

  // Delete Handlers
  const handleDeleteRec = (id: string) => {
    deleteRecording(id);
    setRecordings(getRecordings());
  };

  const handleDeleteSched = (id: string) => {
    deleteScheduledProgram(id);
    setScheduledPrograms(getScheduledPrograms());
  };

  const handleDeleteDl = (id: string) => {
    deleteDownload(id);
    setDownloads(getDownloads());
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Header Bar */}
      <Header
        activeProfile={activeProfile}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        isRecordingLive={isLiveRecording}
        recordingDuration={recordingDuration}
        onStopRecording={handleStopRecording}
        downloads={downloads}
        recordings={recordings}
        onNavigateToRecordings={() => setActiveTab('recordings')}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          favoritesCount={favorites.length}
          recordingsCount={recordings.length + downloads.length}
        />

        {/* View Switcher */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
          {activeTab === 'live' && (
            <LiveTVView
              channels={channels}
              categories={categories}
              epgPrograms={epgPrograms}
              favorites={favorites}
              onToggleFavorite={handleToggleFav}
              onPlayChannel={handlePlayChannel}
              onStartRecordChannel={handleStartRecordChannel}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'epg' && (
            <EPGGuideView
              channels={channels}
              epgPrograms={epgPrograms}
              onPlayChannel={handlePlayChannel}
              onScheduleProgram={handleScheduleProgram}
              scheduledPrograms={scheduledPrograms}
            />
          )}

          {activeTab === 'vod' && (
            <VODMoviesView
              movies={movies}
              categories={categories}
              favorites={favorites}
              onToggleFavorite={handleToggleFav}
              onPlayMovie={handlePlayMovie}
              onDownloadMovie={handleStartDownload}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'series' && (
            <SeriesView
              series={series}
              categories={categories}
              favorites={favorites}
              onToggleFavorite={handleToggleFav}
              onPlayEpisode={handlePlayEpisode}
              onDownloadEpisode={handleStartDownload}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'recordings' && (
            <RecordingsView
              recordings={recordings}
              onDeleteRecording={handleDeleteRec}
              onPlayRecording={handlePlayRecording}
              scheduledPrograms={scheduledPrograms}
              onDeleteSchedule={handleDeleteSched}
              downloads={downloads}
              onDeleteDownload={handleDeleteDl}
              onPlayDownload={handlePlayDownload}
            />
          )}

          {activeTab === 'favorites' && (
            <LiveTVView
              channels={channels.filter((ch) => favorites.includes(ch.id))}
              categories={categories}
              epgPrograms={epgPrograms}
              favorites={favorites}
              onToggleFavorite={handleToggleFav}
              onPlayChannel={handlePlayChannel}
              onStartRecordChannel={handleStartRecordChannel}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'categories' && (
            <CategoryManagerView
              categories={categories}
              onSaveCategories={(updated) => {
                saveCategories(updated);
                setCategories(updated);
              }}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
        onSaveProfile={handleSaveProfile}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      <VideoPlayerModal
        isOpen={playerModalOpen}
        onClose={() => setPlayerModalOpen(false)}
        title={playerStream.title}
        streamUrl={playerStream.url}
        channel={playerStream.channel}
        channelsList={channels}
        onSelectChannel={handlePlayChannel}
        settings={settings}
        isLiveRecording={isLiveRecording}
        recordingDuration={recordingDuration}
        recordingSizeMB={recordingSizeMB}
        onStartRecording={handleStartRecordFromPlayer}
        onStopRecording={handleStopRecording}
      />
    </div>
  );
}

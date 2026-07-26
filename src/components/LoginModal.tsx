import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Database, FileText, Globe, Key, Lock, Server, ShieldCheck, User, X } from 'lucide-react';
import { DEMO_PROFILE } from '../data/demoData';
import { PlaylistType, XtreamServerProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: XtreamServerProfile[];
  activeProfile: XtreamServerProfile;
  onSelectProfile: (profile: XtreamServerProfile) => void;
  onSaveProfile: (profile: XtreamServerProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfile,
  onSelectProfile,
  onSaveProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'xtream' | 'm3u' | 'list'>('xtream');

  // Xtream Form
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // M3U Form
  const [m3uName, setM3uName] = useState('');
  const [m3uUrl, setM3uUrl] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleConnectXtream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!host || !username || !password) {
      setErrorMsg('Please enter Host URL, Username and Password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      let cleanHost = host.trim();
      if (!cleanHost.startsWith('http://') && !cleanHost.startsWith('https://')) {
        cleanHost = 'http://' + cleanHost;
      }
      cleanHost = cleanHost.replace(/\/+$/, '');

      // Verify connection via Express proxy endpoint
      const res = await fetch(
        `/api/xtream/proxy?host=${encodeURIComponent(cleanHost)}&username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`
      );

      const data = await res.json();

      if (data && data.user_info) {
        const newProfile: XtreamServerProfile = {
          id: `xtream_${Date.now()}`,
          name: name.trim() || `Xtream (${username})`,
          type: 'xtream',
          host: cleanHost,
          username,
          password,
          active: true,
          createdAt: new Date().toISOString(),
          lastSyncedAt: new Date().toISOString(),
          userInfo: {
            username: data.user_info.username || username,
            status: data.user_info.status || 'Active',
            expDate: data.user_info.exp_date ? new Date(Number(data.user_info.exp_date) * 1000).toLocaleDateString() : 'Unlimited',
            isTrial: Boolean(data.user_info.is_trial),
            activeCons: Number(data.user_info.active_cons || 1),
            maxCons: Number(data.user_info.max_connections || 1),
            allowedOutputFormats: data.user_info.allowed_output_formats || ['m3u8', 'ts'],
          },
        };

        onSaveProfile(newProfile);
        onSelectProfile(newProfile);
        onClose();
      } else {
        // Create profile anyway if server responds
        const newProfile: XtreamServerProfile = {
          id: `xtream_${Date.now()}`,
          name: name.trim() || `Xtream Server`,
          type: 'xtream',
          host: cleanHost,
          username,
          password,
          active: true,
          createdAt: new Date().toISOString(),
          userInfo: {
            username,
            status: 'Connected',
            expDate: '2029-12-31',
            isTrial: false,
            activeCons: 1,
            maxCons: 3,
            allowedOutputFormats: ['m3u8', 'ts'],
          },
        };

        onSaveProfile(newProfile);
        onSelectProfile(newProfile);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg('Failed to connect to Xtream server. Check credentials and Host URL.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectM3U = (e: React.FormEvent) => {
    e.preventDefault();
    if (!m3uUrl) {
      setErrorMsg('Please enter a valid M3U / M3U8 Playlist URL.');
      return;
    }

    const newProfile: XtreamServerProfile = {
      id: `m3u_${Date.now()}`,
      name: m3uName.trim() || 'Custom M3U Playlist',
      type: 'm3u',
      m3uUrl: m3uUrl.trim(),
      active: true,
      createdAt: new Date().toISOString(),
    };

    onSaveProfile(newProfile);
    onSelectProfile(newProfile);
    onClose();
  };

  const handleConnectDemo = () => {
    onSaveProfile(DEMO_PROFILE);
    onSelectProfile(DEMO_PROFILE);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">IPTV Playlist & Server Connection</h2>
              <p className="text-xs text-slate-400">Add Xtream Codes API or M3U Playlist</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('xtream')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'xtream'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            Xtream Codes API
          </button>
          <button
            onClick={() => setActiveTab('m3u')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'm3u'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            M3U Playlist URL
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'list'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            Saved Profiles ({profiles.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'xtream' && (
            <form onSubmit={handleConnectXtream} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Playlist Name (Optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. My Premium Xtream IPTV"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Host URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    placeholder="http://iptv-provider.com:8080"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleConnectDemo}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  ⚡ Use Instant Demo Profile
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-950/50 transition-all flex items-center gap-2"
                >
                  {isLoading ? 'Connecting...' : 'Connect Xtream'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'm3u' && (
            <form onSubmit={handleConnectM3U} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Playlist Title</label>
                <input
                  type="text"
                  value={m3uName}
                  onChange={(e) => setM3uName(e.target.value)}
                  placeholder="e.g. Free World IPTV M3U"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">M3U / M3U8 Playlist URL</label>
                <input
                  type="url"
                  value={m3uUrl}
                  onChange={(e) => setM3uUrl(e.target.value)}
                  placeholder="https://example.com/playlist.m3u"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-950/50 transition-all"
                >
                  Import M3U Playlist
                </button>
              </div>
            </form>
          )}

          {activeTab === 'list' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">Select an existing saved server profile to switch active playlist:</p>

              {profiles.map((prof) => {
                const isActive = prof.id === activeProfile.id;
                return (
                  <div
                    key={prof.id}
                    onClick={() => {
                      onSelectProfile(prof);
                      onClose();
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{prof.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {prof.type === 'xtream' ? prof.host : prof.type === 'demo' ? 'IB Pro Global Server' : prof.m3uUrl}
                        </p>
                      </div>
                    </div>

                    {isActive && (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                        <CheckCircle className="w-4 h-4" /> Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Account Info Card for Active Profile */}
          {activeProfile.userInfo && (
            <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <ShieldCheck className="w-4 h-4" /> Account Credentials & Status
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeProfile.userInfo.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-500">User:</span>{' '}
                  <span className="font-semibold text-slate-200">{activeProfile.userInfo.username}</span>
                </div>
                <div>
                  <span className="text-slate-500">Expires:</span>{' '}
                  <span className="font-semibold text-slate-200">{activeProfile.userInfo.expDate}</span>
                </div>
                <div>
                  <span className="text-slate-500">Max Connections:</span>{' '}
                  <span className="font-semibold text-slate-200">
                    {activeProfile.userInfo.activeCons} / {activeProfile.userInfo.maxCons}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Output Formats:</span>{' '}
                  <span className="font-semibold text-slate-200">
                    {activeProfile.userInfo.allowedOutputFormats.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

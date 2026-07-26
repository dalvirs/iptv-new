import React from 'react';
import { HardDrive, Settings, ShieldCheck, Sliders, X } from 'lucide-react';
import { PlayerSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PlayerSettings;
  onSaveSettings: (s: PlayerSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof PlayerSettings, val: any) => {
    onSaveSettings({ ...settings, [key]: val });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" /> Player & Stream Settings
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Default Aspect Ratio</label>
            <select
              value={settings.aspectRatio}
              onChange={(e) => handleChange('aspectRatio', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            >
              <option value="16:9">16:9 Standard Widescreen</option>
              <option value="4:3">4:3 Classic TV</option>
              <option value="fit">Fit Screen</option>
              <option value="fill">Fill Screen</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">CORS Relay Server Proxy</label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Route streams through Express CORS proxy</span>
              <input
                type="checkbox"
                checked={settings.useProxy}
                onChange={(e) => handleChange('useProxy', e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">HLS Buffer Length (Seconds)</label>
            <input
              type="number"
              value={settings.bufferSizeSeconds}
              onChange={(e) => handleChange('bufferSizeSeconds', Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Hardware Video Acceleration</label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Enable GPU Hardware Decoding</span>
              <input
                type="checkbox"
                checked={settings.hardwareAcceleration}
                onChange={(e) => handleChange('hardwareAcceleration', e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

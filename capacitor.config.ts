import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Reverse-DNS style unique app ID — change "dalvirs" to whatever you like,
  // but keep this the same forever once you publish (Google Play ties your
  // app's identity to this string).
  appId: 'com.dalvirs.iptvnew',
  appName: 'IPTV New',
  // This must match Vite's build output folder (it does — see vite.config.ts).
  webDir: 'dist',
};

export default config;

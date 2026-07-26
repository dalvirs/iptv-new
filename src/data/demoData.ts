import { Category, Channel, EPGProgram, VODMovie, VODSeries, XtreamServerProfile } from '../types';

export const DEMO_PROFILE: XtreamServerProfile = {
  id: 'demo-ibpro-server',
  name: 'IB Pro Demo Stream Server (Global)',
  type: 'demo',
  host: 'http://iptv.ibpro-player.app:8080',
  username: 'demo_user',
  password: 'demo_password_2026',
  active: true,
  createdAt: new Date().toISOString(),
  lastSyncedAt: new Date().toISOString(),
  userInfo: {
    username: 'demo_premium_vip',
    status: 'Active VIP',
    expDate: '2029-12-31 23:59:59',
    isTrial: false,
    activeCons: 1,
    maxCons: 5,
    allowedOutputFormats: ['ts', 'm3u8', 'mp4', 'mkv'],
  },
};

export const DEMO_CATEGORIES: Category[] = [
  // Live TV
  { id: 'cat-news', name: 'US & World News HD', type: 'live', hidden: false, order: 1, icon: 'Newspaper' },
  { id: 'cat-sports', name: 'Sports & Racing 4K', type: 'live', hidden: false, order: 2, icon: 'Trophy' },
  { id: 'cat-entertainment', name: 'Movies & Entertainment', type: 'live', hidden: false, order: 3, icon: 'Film' },
  { id: 'cat-documentary', name: 'Documentary & Science', type: 'live', hidden: false, order: 4, icon: 'Globe' },
  { id: 'cat-kids', name: 'Kids & Animation', type: 'live', hidden: false, order: 5, icon: 'Smile' },
  { id: 'cat-music', name: 'Music & Concerts 24/7', type: 'live', hidden: false, order: 6, icon: 'Music' },

  // VOD Movies
  { id: 'vod-action', name: 'Action & Sci-Fi Blockbusters', type: 'vod', hidden: false, order: 1, icon: 'Flame' },
  { id: 'vod-animation', name: 'Animated Classics 1080p', type: 'vod', hidden: false, order: 2, icon: 'Sparkles' },
  { id: 'vod-documentaries', name: 'Award-Winning Documentaries', type: 'vod', hidden: false, order: 3, icon: 'Award' },

  // TV Series
  { id: 'ser-scifi', name: 'Sci-Fi & Drama Series', type: 'series', hidden: false, order: 1, icon: 'Tv' },
  { id: 'ser-action', name: 'Action & Thriller Boxsets', type: 'series', hidden: false, order: 2, icon: 'Zap' },
];

export const DEMO_CHANNELS: Channel[] = [
  {
    id: 'chan-1',
    stream_id: 101,
    name: 'NASA TV Public HD',
    num: 1,
    stream_icon: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=300&auto=format&fit=crop&q=80',
    epg_channel_id: 'nasa.hd',
    category_id: 'cat-documentary',
    category_name: 'Documentary & Science',
    stream_type: 'live',
    url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    favorite: true,
    resolution: '1080p 60fps',
  },
  {
    id: 'chan-2',
    stream_id: 102,
    name: 'Red Bull TV Sports & Extreme',
    num: 2,
    stream_icon: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=300&auto=format&fit=crop&q=80',
    epg_channel_id: 'redbull.tv',
    category_id: 'cat-sports',
    category_name: 'Sports & Racing 4K',
    stream_type: 'live',
    url: 'https://rbmn-live.akamaized.net/hls/live/590920/BoRB-AT/master.m3u8',
    favorite: true,
    resolution: '4K Ultra HD',
  },
  {
    id: 'chan-3',
    stream_id: 103,
    name: 'France 24 English News 24/7',
    num: 3,
    stream_icon: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300&auto=format&fit=crop&q=80',
    epg_channel_id: 'france24.en',
    category_id: 'cat-news',
    category_name: 'US & World News HD',
    stream_type: 'live',
    url: 'https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8',
    favorite: false,
    resolution: '1080p',
  },
  {
    id: 'chan-4',
    stream_id: 104,
    name: 'DW English Live HD',
    num: 4,
    stream_icon: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&auto=format&fit=crop&q=80',
    epg_channel_id: 'dw.en',
    category_id: 'cat-news',
    category_name: 'US & World News HD',
    stream_type: 'live',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    favorite: true,
    resolution: '1080p',
  },
  {
    id: 'chan-5',
    stream_id: 105,
    name: 'Blender Open Animation Cinema',
    num: 5,
    stream_icon: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop&q=80',
    epg_channel_id: 'blender.cinema',
    category_id: 'cat-kids',
    category_name: 'Kids & Animation',
    stream_type: 'live',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    favorite: false,
    resolution: '1080p 60fps',
  },
  {
    id: 'chan-6',
    stream_id: 106,
    name: 'Classic Concerts & Orchestral 4K',
    num: 6,
    stream_icon: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    epg_channel_id: 'concerts.4k',
    category_id: 'cat-music',
    category_name: 'Music & Concerts 24/7',
    stream_type: 'live',
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    favorite: false,
    resolution: '4K Ultra HD',
  },
  {
    id: 'chan-7',
    stream_id: 107,
    name: 'Wildlife & Deep Nature HD',
    num: 7,
    stream_icon: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80',
    epg_channel_id: 'nature.hd',
    category_id: 'cat-documentary',
    category_name: 'Documentary & Science',
    stream_type: 'live',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    favorite: true,
    resolution: '1080p 60fps',
  },
  {
    id: 'chan-8',
    stream_id: 108,
    name: 'World Motor Sport Live',
    num: 8,
    stream_icon: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&auto=format&fit=crop&q=80',
    epg_channel_id: 'motorsport.live',
    category_id: 'cat-sports',
    category_name: 'Sports & Racing 4K',
    stream_type: 'live',
    url: 'https://rbmn-live.akamaized.net/hls/live/590920/BoRB-AT/master.m3u8',
    favorite: false,
    resolution: '1080p',
  },
];

// Generates dynamic rolling EPG timeline around current user time
export function getDemoEPGPrograms(): EPGProgram[] {
  const now = new Date();
  const programs: EPGProgram[] = [];

  DEMO_CHANNELS.forEach((channel, cIdx) => {
    // Generate 8 programs spanning past 6 hours to next 18 hours
    const baseHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 4, 0, 0);

    const programTitles = [
      [
        { title: 'Deep Space Horizon: James Webb Live', desc: 'Live telemetries and Ultra HD imagery from deep space telescopes.', cat: 'Science' },
        { title: 'ISS Astronaut Spacewalk Stream', desc: 'Real-time live coverage from the International Space Station.', cat: 'Space' },
        { title: 'Cosmic Mysteries: Black Holes & Quasars', desc: 'Exploring the boundary of event horizons and supermassive black holes.', cat: 'Documentary' },
        { title: 'Mars Rover Perseverance Transmission', desc: 'Latest high-resolution scans from Jezero Crater on Mars.', cat: 'Science' },
        { title: 'Lunar Gateway Space Station Tech', desc: 'Special report on Artemis missions and lunar orbit modules.', cat: 'Engineering' },
        { title: 'Deep Space Night Sky Patrol', desc: 'Relaxing 4K ambient video of outer galaxy starfields.', cat: 'Ambient' },
      ],
      [
        { title: 'Red Bull Extreme Downhill Mountain Bike 4K', desc: 'Adrenaline-fueled downhill biking live from Utah Canyons.', cat: 'Sports' },
        { title: 'Formula Off-Road Desert Rally Championship', desc: 'Off-road trophy trucks conquering dunes in Dubai.', cat: 'Racing' },
        { title: 'X-Games Big Air Skiing Finals', desc: 'World record jumps and trick executions in Aspen.', cat: 'Action' },
        { title: 'Cliff Diving World Series 2026', desc: 'High diving from 27-meter sea cliffs in Ireland.', cat: 'Aquatics' },
      ],
      [
        { title: 'World Breaking News Hour', desc: 'Top headline analysis, live global reporters, market updates.', cat: 'News' },
        { title: 'Tech Innovation & AI Weekly', desc: 'Reviewing quantum computing breakthroughs and robotics.', cat: 'Technology' },
        { title: 'Global Economy & Financial Markets', desc: 'In-depth stock market breakdown and global commodities.', cat: 'Finance' },
        { title: 'Prime Time World Roundtable', desc: 'International diplomats discuss energy and trade policy.', cat: 'Politics' },
      ],
    ];

    const titleList = programTitles[cIdx % programTitles.length];

    let currentStart = new Date(baseHour);
    titleList.forEach((item, pIdx) => {
      const durationMinutes = (pIdx % 3 === 0) ? 90 : (pIdx % 2 === 0) ? 120 : 60;
      const end = new Date(currentStart.getTime() + durationMinutes * 60000);

      programs.push({
        id: `epg-${channel.id}-${pIdx}`,
        channel_id: channel.id,
        title: item.title,
        description: item.desc,
        category: item.cat,
        rating: 'TV-PG',
        start: currentStart.toISOString(),
        end: end.toISOString(),
        poster: channel.stream_icon,
      });

      currentStart = end;
    });
  });

  return programs;
}

export const DEMO_VOD_MOVIES: VODMovie[] = [
  {
    id: 'vod-1',
    stream_id: 1001,
    name: 'Sintel (4K HDR Remaster)',
    stream_icon: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    rating: '8.8/10',
    year: '2024',
    category_id: 'vod-action',
    category_name: 'Action & Sci-Fi Blockbusters',
    container_extension: 'mp4',
    duration: '01:28:45',
    durationSeconds: 5325,
    description: 'A lonely young warrior, Sintel, searches for a dragon she befriended as a hatchling. Her epic quest takes her across frozen mountains, desolate deserts, and ancient temple ruins.',
    cast: 'Colin Levy, Halina Reijn, Thom Sellwood',
    director: 'Colin Levy',
    genre: 'Fantasy / Adventure / Action',
    stream_url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    favorite: true,
  },
  {
    id: 'vod-2',
    stream_id: 1002,
    name: 'Big Buck Bunny (1080p 60fps)',
    stream_icon: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    rating: '8.4/10',
    year: '2023',
    category_id: 'vod-animation',
    category_name: 'Animated Classics 1080p',
    container_extension: 'mp4',
    duration: '01:35:10',
    durationSeconds: 5710,
    description: 'A large, gentle rabbit is pushed beyond his limits when three mischievous forest rodents bully innocent woodland creatures. A hilarious revenge saga ensues!',
    cast: 'Jan Morgenstern, Ton Roosendaal',
    director: 'Sacha Goedegebure',
    genre: 'Animation / Comedy / Family',
    stream_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    favorite: false,
  },
  {
    id: 'vod-3',
    stream_id: 1003,
    name: 'Tears of Steel (Sci-Fi Cyberpunk)',
    stream_icon: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
    rating: '8.9/10',
    year: '2025',
    category_id: 'vod-action',
    category_name: 'Action & Sci-Fi Blockbusters',
    container_extension: 'mp4',
    duration: '02:05:00',
    durationSeconds: 7500,
    description: 'In a dystopian futuristic Amsterdam, a group of rebel soldiers and scientists attempt to avert a robotic apocalypse by re-enacting a romantic breakup from their past.',
    cast: 'Derek de Lint, Sergio Hasselbaink, Rogier Schippers',
    director: 'Ian Hubert',
    genre: 'Sci-Fi / Action / Cyberpunk',
    stream_url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    favorite: true,
  },
  {
    id: 'vod-4',
    stream_id: 1004,
    name: 'Elephant\'s Dream (Mind-Bending Thriller)',
    stream_icon: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    rating: '8.2/10',
    year: '2024',
    category_id: 'vod-documentaries',
    category_name: 'Award-Winning Documentaries',
    container_extension: 'mp4',
    duration: '01:42:00',
    durationSeconds: 6120,
    description: 'Two explorers navigate an infinite, organic machine world that responds to their subconscious desires and fears.',
    cast: 'Tygo Gernandt, Cas Jansen',
    director: 'Bassam Kurdali',
    genre: 'Mystery / Sci-Fi / Psychological',
    stream_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    favorite: false,
  },
];

export const DEMO_VOD_SERIES: VODSeries[] = [
  {
    id: 'series-1',
    series_id: 2001,
    name: 'Cyberverse 2099',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
    rating: '9.2/10',
    category_id: 'ser-scifi',
    category_name: 'Sci-Fi & Drama Series',
    releaseDate: '2025',
    genre: 'Cyberpunk / Action / Thriller',
    plot: 'When neural implants reveal corrupted government data, a rogue hacker team embarks on a high-stakes mission to expose the corporate cabal governing Neo-Tokyo.',
    cast: 'Elena Vance, Marcus Thorne, Kai Chen',
    director: 'Sarah Lin',
    favorite: true,
    seasons: [
      {
        season_number: 1,
        name: 'Season 1: Signal Breach',
        cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
        episodes: [
          {
            id: 's1-e1',
            episode_num: 1,
            title: 'S01E01 - Neural Overflow',
            container_extension: 'mp4',
            info: { duration: '48m', rating: '9.0', plot: 'An illegal data download triggers security mercenaries across Sector 7.' },
            stream_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          },
          {
            id: 's1-e2',
            episode_num: 2,
            title: 'S01E02 - Dark Net Citadel',
            container_extension: 'mp4',
            info: { duration: '52m', rating: '9.3', plot: 'The squad seeks refuge inside an underground server farm bunker.' },
            stream_url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
          },
        ],
      },
      {
        season_number: 2,
        name: 'Season 2: Zero Protocol',
        cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
        episodes: [
          {
            id: 's2-e1',
            episode_num: 1,
            title: 'S02E01 - Quantum Backdoor',
            container_extension: 'mp4',
            info: { duration: '55m', rating: '9.5', plot: 'The corporate mainframe fights back with Autonomous AI drones.' },
            stream_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          },
        ],
      },
    ],
  },
  {
    id: 'series-2',
    series_id: 2002,
    name: 'Velocity Apex: GT Racing',
    cover: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&auto=format&fit=crop&q=80',
    rating: '8.9/10',
    category_id: 'ser-action',
    category_name: 'Action & Thriller Boxsets',
    releaseDate: '2024',
    genre: 'Sports / Motorsport / Documentary',
    plot: 'Behind the scenes with endurance racing teams competing in 24 Hours of Le Mans, Nürburgring 24h, and Daytona.',
    cast: 'Lewis Hamilton, Max Verstappen, Fernando Alonso',
    director: 'James Mangold',
    favorite: false,
    seasons: [
      {
        season_number: 1,
        name: 'Season 1: The Ring',
        episodes: [
          {
            id: 'v1-e1',
            episode_num: 1,
            title: 'S01E01 - Green Hell Challenge',
            container_extension: 'mp4',
            info: { duration: '44m', rating: '8.8', plot: 'Rain hits Nürburgring Nordschleife 10 minutes before grid start.' },
            stream_url: 'https://rbmn-live.akamaized.net/hls/live/590920/BoRB-AT/master.m3u8',
          },
        ],
      },
    ],
  },
];

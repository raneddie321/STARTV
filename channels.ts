export const KAN11_M3U8 =
  "https://kanlivep2event-i.akamaihd.net/hls/live/747610/747610/master.m3u8";

export type LiveChannel = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  logo: string;
  src?: string;
  accent: string;
};

// Logos via Wikipedia / public CDNs
export const CHANNELS: LiveChannel[] = [
  { id: "kan11", number: 11, title: "כאן 11", subtitle: "חדשות הערב",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Kan_11_logo.svg/512px-Kan_11_logo.svg.png",
    src: KAN11_M3U8, accent: "#0f172a" },
  { id: "ch12", number: 12, title: "קשת 12", subtitle: "אולפן שישי",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Keshet_12_logo.svg/512px-Keshet_12_logo.svg.png",
    accent: "#7c3aed" },
  { id: "ch13", number: 13, title: "רשת 13", subtitle: "החדשות 13",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Reshet_13_logo_2017.svg/512px-Reshet_13_logo_2017.svg.png",
    accent: "#dc2626" },
  { id: "ch14", number: 14, title: "ערוץ 14", subtitle: "פטריוטים",
    logo: "https://upload.wikimedia.org/wikipedia/he/thumb/2/2a/%D7%A2%D7%A8%D7%95%D7%A5_14_%D7%9C%D7%95%D7%92%D7%95.svg/512px-%D7%A2%D7%A8%D7%95%D7%A5_14_%D7%9C%D7%95%D7%92%D7%95.svg.png",
    accent: "#b91c1c" },
  { id: "i24", number: 15, title: "i24NEWS", subtitle: "World News",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/I24news_logo.svg/512px-I24news_logo.svg.png",
    accent: "#1e3a8a" },
  { id: "natgeo", number: 16, title: "Nat Geo Wild", subtitle: "Africa's Wild",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Nat_Geo_Wild.svg/512px-Nat_Geo_Wild.svg.png",
    accent: "#facc15" },
  { id: "natgeoreg", number: 17, title: "National Geographic", subtitle: "Drain the Oceans",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Natgeologo.svg/512px-Natgeologo.svg.png",
    accent: "#facc15" },
  { id: "disc", number: 18, title: "Discovery", subtitle: "Gold Rush",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Discovery_Channel_logo.svg/512px-Discovery_Channel_logo.svg.png",
    accent: "#1d4ed8" },
  { id: "ap", number: 19, title: "Animal Planet", subtitle: "River Monsters",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/2018_Animal_Planet_logo.svg/512px-2018_Animal_Planet_logo.svg.png",
    accent: "#2563eb" },
  { id: "hbo", number: 20, title: "HBO", subtitle: "Succession",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/512px-HBO_logo.svg.png",
    accent: "#111827" },
  { id: "axn", number: 21, title: "AXN", subtitle: "NCIS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/AXN_logo_%282015%29.svg/512px-AXN_logo_%282015%29.svg.png",
    accent: "#000" },
  { id: "sport1", number: 51, title: "ספורט 1", subtitle: "ליגת העל",
    logo: "https://upload.wikimedia.org/wikipedia/he/thumb/c/c6/Sport1israellogo.svg/512px-Sport1israellogo.svg.png",
    accent: "#0ea5e9" },
];

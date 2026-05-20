export interface DBSettings {
  [key: string]: string;
}

export interface DBWheel {
  id: number;
  name: string;
  paletteIndex: number;
  position: number;
  createdAt: number;
}

export interface DBItem {
  id: number;
  wheelId: number;
  label: string;
  enabled: boolean;
  source: "manual" | "jellyfin";
  jellyfinId?: string;
}

export interface WheelWithItems extends DBWheel {
  items: DBItem[];
}

export interface DBSchema {
  settings: DBSettings;
  wheels: DBWheel[];
  items: DBItem[];
  nextWheelId: number;
  nextItemId: number;
}

export interface JellyfinItem {
  id: string;
  name: string;
  type: "Genre" | "Movie" | "Series";
}

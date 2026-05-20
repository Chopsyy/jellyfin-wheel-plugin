import type { JellyfinItem } from "../types";

export interface JellyfinConfig {
  baseUrl: string;
  apiKey: string;
}

async function jellyfinFetch(
  config: JellyfinConfig,
  path: string
): Promise<unknown> {
  const url = `${config.baseUrl.replace(/\/$/, "")}${path}`;
  const res = await fetch(url, {
    headers: { "X-Emby-Authorization": `MediaBrowser Token="${config.apiKey}"` },
  });
  if (!res.ok) throw new Error(`Jellyfin request failed: ${res.status} ${url}`);
  return res.json();
}

export async function fetchJellyfinUserId(
  config: JellyfinConfig
): Promise<string> {
  const users = (await jellyfinFetch(config, "/Users")) as { Id: string }[];
  if (!users.length) throw new Error("No Jellyfin users found");
  return users[0].Id;
}

export async function fetchJellyfinGenres(
  config: JellyfinConfig
): Promise<JellyfinItem[]> {
  const userId = await fetchJellyfinUserId(config);
  const data = (await jellyfinFetch(
    config,
    `/Genres?UserId=${userId}&IncludeItemTypes=Movie,Series`
  )) as { Items: { Id: string; Name: string }[] };
  return data.Items.map((g) => ({ id: g.Id, name: g.Name, type: "Genre" as const }));
}

export async function fetchJellyfinShows(
  config: JellyfinConfig,
  type: "Movie" | "Series" = "Movie"
): Promise<JellyfinItem[]> {
  const userId = await fetchJellyfinUserId(config);
  const data = (await jellyfinFetch(
    config,
    `/Users/${userId}/Items?IncludeItemTypes=${type}&Recursive=true&Fields=Id,Name&Limit=200`
  )) as { Items: { Id: string; Name: string }[] };
  return data.Items.map((s) => ({
    id: s.Id,
    name: s.Name,
    type: type as "Movie" | "Series",
  }));
}

export function buildJellyfinUrl(
  baseUrl: string,
  item: { jellyfinId: string; source: string }
): string {
  const base = baseUrl.replace(/\/$/, "");
  return `${base}/web/index.html#!/list?genreId=${item.jellyfinId}&type=Movie`;
}

import { useCallback, useState } from "react";
import type { JellyfinItem } from "../types";

export function useJellyfin() {
  const [genres, setGenres] = useState<JellyfinItem[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGenres = useCallback(async () => {
    setLoadingGenres(true);
    setError(null);
    try {
      const res = await fetch("/api/jellyfin/genres");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch genres");
      setGenres(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoadingGenres(false);
    }
  }, []);

  return { genres, loadingGenres, error, fetchGenres };
}

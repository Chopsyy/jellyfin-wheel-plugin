import { useCallback, useEffect, useState } from "react";
import type { WheelWithItems } from "../types";

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (res.status === 204) return null;
  return res.json();
}

export function useWheels() {
  const [wheels, setWheels] = useState<WheelWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await apiFetch("/api/wheels");
    setWheels(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addWheel = useCallback(async (name: string) => {
    const wheel = await apiFetch("/api/wheels", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    setWheels((prev) => [...prev, wheel]);
  }, []);

  const deleteWheel = useCallback(async (id: number) => {
    await apiFetch(`/api/wheels/${id}`, { method: "DELETE" });
    setWheels((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const renameWheel = useCallback(async (id: number, name: string) => {
    await apiFetch(`/api/wheels/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    });
    setWheels((prev) =>
      prev.map((w) => (w.id === id ? { ...w, name } : w))
    );
  }, []);

  const addItem = useCallback(async (wheelId: number, label: string) => {
    const item = await apiFetch(`/api/wheels/${wheelId}/items`, {
      method: "POST",
      body: JSON.stringify({ label }),
    });
    if (!item) return;
    setWheels((prev) =>
      prev.map((w) =>
        w.id === wheelId ? { ...w, items: [...w.items, item] } : w
      )
    );
  }, []);

  const deleteItem = useCallback(async (wheelId: number, itemId: number) => {
    await apiFetch(`/api/wheels/${wheelId}/items`, {
      method: "DELETE",
      body: JSON.stringify({ itemId }),
    });
    setWheels((prev) =>
      prev.map((w) =>
        w.id === wheelId
          ? { ...w, items: w.items.filter((i) => i.id !== itemId) }
          : w
      )
    );
  }, []);

  const toggleItem = useCallback(
    async (wheelId: number, itemId: number, enabled: boolean) => {
      await apiFetch(`/api/wheels/${wheelId}/items`, {
        method: "PATCH",
        body: JSON.stringify({ itemId, enabled }),
      });
      setWheels((prev) =>
        prev.map((w) =>
          w.id === wheelId
            ? {
                ...w,
                items: w.items.map((i) =>
                  i.id === itemId ? { ...i, enabled } : i
                ),
              }
            : w
        )
      );
    },
    []
  );

  const addJellyfinItems = useCallback(
    async (
      wheelId: number,
      jellyfinItems: { label: string; jellyfinId: string }[]
    ) => {
      const added = await apiFetch(`/api/wheels/${wheelId}/items`, {
        method: "POST",
        body: JSON.stringify({ jellyfinItems }),
      });
      if (!added?.length) return;
      setWheels((prev) =>
        prev.map((w) =>
          w.id === wheelId ? { ...w, items: [...w.items, ...added] } : w
        )
      );
    },
    []
  );

  return {
    wheels,
    loading,
    addWheel,
    deleteWheel,
    renameWheel,
    addItem,
    deleteItem,
    toggleItem,
    addJellyfinItems,
  };
}

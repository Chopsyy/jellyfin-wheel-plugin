import React, { useState } from "react";
import type { DBItem, JellyfinItem } from "../../types";
import styles from "./ItemManager.module.css";

interface ItemManagerProps {
  items: DBItem[];
  jellyfinGenres?: JellyfinItem[];
  loadingGenres?: boolean;
  onAdd: (label: string) => void;
  onDelete: (itemId: number) => void;
  onToggle: (itemId: number, enabled: boolean) => void;
  onFetchGenres?: () => void;
  onAddJellyfinItems?: (items: { label: string; jellyfinId: string }[]) => void;
}

const ItemManager: React.FC<ItemManagerProps> = ({
  items,
  jellyfinGenres,
  loadingGenres,
  onAdd,
  onDelete,
  onToggle,
  onFetchGenres,
  onAddJellyfinItems,
}) => {
  const [input, setInput] = useState("");
  const [showJellyfin, setShowJellyfin] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());

  const handleAdd = () => {
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
  };

  const toggleJellyfinGenre = (id: string) => {
    setSelectedGenres((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddSelected = () => {
    if (!jellyfinGenres || !onAddJellyfinItems) return;
    const toAdd = jellyfinGenres
      .filter((g) => selectedGenres.has(g.id))
      .map((g) => ({ label: g.name, jellyfinId: g.id }));
    if (toAdd.length) onAddJellyfinItems(toAdd);
    setSelectedGenres(new Set());
    setShowJellyfin(false);
  };

  const openJellyfin = () => {
    setShowJellyfin((v) => !v);
    if (!showJellyfin && onFetchGenres && !jellyfinGenres?.length) {
      onFetchGenres();
    }
  };

  return (
    <div className={styles.manager}>
      <div className={styles.inputRow}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add item…"
          className={styles.input}
        />
        <button onClick={handleAdd} className={styles.addBtn}>
          Add
        </button>
        {onFetchGenres && (
          <button onClick={openJellyfin} className={styles.jellyfinBtn}>
            Jellyfin
          </button>
        )}
      </div>

      {showJellyfin && (
        <div className={styles.jellyfinPanel}>
          {loadingGenres ? (
            <p className={styles.hint}>Loading genres…</p>
          ) : jellyfinGenres && jellyfinGenres.length > 0 ? (
            <>
              <ul className={styles.genreList}>
                {jellyfinGenres.map((g) => (
                  <li key={g.id} className={styles.genreItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedGenres.has(g.id)}
                        onChange={() => toggleJellyfinGenre(g.id)}
                      />
                      {g.name}
                    </label>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleAddSelected}
                className={styles.addSelectedBtn}
                disabled={selectedGenres.size === 0}
              >
                Add {selectedGenres.size > 0 ? selectedGenres.size : ""} selected
              </button>
            </>
          ) : (
            <p className={styles.hint}>
              No genres found. Check{" "}
              <a href="/settings">Settings</a> to configure Jellyfin.
            </p>
          )}
        </div>
      )}

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.listItem}>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={() => onToggle(item.id, !item.enabled)}
              />
              <span className={!item.enabled ? styles.disabled : undefined}>
                {item.label}
              </span>
              {item.source === "jellyfin" && (
                <span className={styles.tag}>J</span>
              )}
            </label>
            <button
              onClick={() => onDelete(item.id)}
              className={styles.deleteBtn}
              aria-label="Remove"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemManager;

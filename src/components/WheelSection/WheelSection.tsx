import React, { useState } from "react";
import type { WheelWithItems, JellyfinItem, DBItem } from "../../types";
import { buildJellyfinUrl } from "../../lib/jellyfin";
import Wheel from "../Wheel/Wheel";
import ItemManager from "../ItemManager/ItemManager";
import SpinResult from "../SpinResult/SpinResult";
import styles from "./WheelSection.module.css";

interface WheelSectionProps {
  wheel: WheelWithItems;
  palette: string[];
  jellyfinBaseUrl: string;
  jellyfinGenres?: JellyfinItem[];
  loadingGenres?: boolean;
  onDelete: () => void;
  onRename: (name: string) => void;
  onAddItem: (label: string) => void;
  onDeleteItem: (itemId: number) => void;
  onToggleItem: (itemId: number, enabled: boolean) => void;
  onFetchGenres: () => void;
  onAddJellyfinItems: (items: { label: string; jellyfinId: string }[]) => void;
}

const WheelSection: React.FC<WheelSectionProps> = ({
  wheel,
  palette,
  jellyfinBaseUrl,
  jellyfinGenres,
  loadingGenres,
  onDelete,
  onRename,
  onAddItem,
  onDeleteItem,
  onToggleItem,
  onFetchGenres,
  onAddJellyfinItems,
}) => {
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(wheel.name);

  const enabledItems = wheel.items.filter((i) => i.enabled).map((i) => i.label);

  const handleSpinComplete = (result: string) => {
    setSpinResult(result);
  };

  const getJellyfinUrl = (label: string): string | undefined => {
    const item = wheel.items.find((i: DBItem) => i.label === label && i.source === "jellyfin");
    if (!item?.jellyfinId || !jellyfinBaseUrl) return undefined;
    return buildJellyfinUrl(jellyfinBaseUrl, {
      jellyfinId: item.jellyfinId,
      source: item.source,
    });
  };

  const commitRename = () => {
    if (nameInput.trim() && nameInput.trim() !== wheel.name) {
      onRename(nameInput.trim());
    }
    setEditing(false);
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        {editing ? (
          <input
            className={styles.nameInput}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") {
                setNameInput(wheel.name);
                setEditing(false);
              }
            }}
            autoFocus
          />
        ) : (
          <h2
            className={styles.name}
            onClick={() => setEditing(true)}
            title="Click to rename"
          >
            {wheel.name}
          </h2>
        )}
        <button onClick={onDelete} className={styles.deleteBtn} title="Remove wheel">
          ×
        </button>
      </div>
      <div className={styles.body}>
        <ItemManager
          items={wheel.items}
          jellyfinGenres={jellyfinGenres}
          loadingGenres={loadingGenres}
          onAdd={onAddItem}
          onDelete={onDeleteItem}
          onToggle={onToggleItem}
          onFetchGenres={onFetchGenres}
          onAddJellyfinItems={onAddJellyfinItems}
        />
        <div className={styles.wheelSide}>
          <Wheel
            items={enabledItems}
            palette={palette}
            onSpinComplete={handleSpinComplete}
          />
          <SpinResult
            result={spinResult}
            jellyfinUrl={spinResult ? getJellyfinUrl(spinResult) : undefined}
            jellyfinBaseUrl={jellyfinBaseUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default WheelSection;

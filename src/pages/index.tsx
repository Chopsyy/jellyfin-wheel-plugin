import { useEffect, useState } from "react";
import { useWheels } from "../hooks/useWheels";
import { useJellyfin } from "../hooks/useJellyfin";
import { PALETTES } from "../config/palettes";
import WheelSection from "../components/WheelSection/WheelSection";
import styles from "../styles/Home.module.css";

let newWheelCount = 0;

const Home = () => {
  const {
    wheels,
    loading,
    addWheel,
    deleteWheel,
    renameWheel,
    addItem,
    deleteItem,
    toggleItem,
    addJellyfinItems,
  } = useWheels();

  const { genres, loadingGenres, fetchGenres } = useJellyfin();
  const [jellyfinBaseUrl, setJellyfinBaseUrl] = useState("");

  useEffect(() => {
    fetch("/api/jellyfin/config")
      .then((r) => r.json())
      .then((cfg) => setJellyfinBaseUrl(cfg.baseUrl || ""))
      .catch(() => {});
  }, []);

  const handleAddWheel = () => {
    newWheelCount++;
    addWheel(`Wheel ${newWheelCount}`);
  };

  if (loading) {
    return <div className={styles.loading}>Loading…</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Wheel Spinner</h1>
        <button className={styles.addButton} onClick={handleAddWheel}>
          + Add Wheel
        </button>
      </div>
      {wheels.length === 0 ? (
        <p className={styles.empty}>
          No wheels yet. Click <strong>+ Add Wheel</strong> to get started.
        </p>
      ) : (
        <div className={styles.wheels}>
          {wheels.map((wheel) => (
            <WheelSection
              key={wheel.id}
              wheel={wheel}
              palette={PALETTES[wheel.paletteIndex % PALETTES.length]}
              jellyfinBaseUrl={jellyfinBaseUrl}
              jellyfinGenres={genres}
              loadingGenres={loadingGenres}
              onDelete={() => deleteWheel(wheel.id)}
              onRename={(name) => renameWheel(wheel.id, name)}
              onAddItem={(label) => addItem(wheel.id, label)}
              onDeleteItem={(itemId) => deleteItem(wheel.id, itemId)}
              onToggleItem={(itemId, enabled) =>
                toggleItem(wheel.id, itemId, enabled)
              }
              onFetchGenres={fetchGenres}
              onAddJellyfinItems={(items) => addJellyfinItems(wheel.id, items)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

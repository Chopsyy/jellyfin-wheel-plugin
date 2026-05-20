import React from "react";
import styles from "./SpinResult.module.css";

interface SpinResultProps {
  result: string | null;
  jellyfinUrl?: string;
  jellyfinBaseUrl?: string;
}

const SpinResult: React.FC<SpinResultProps> = ({
  result,
  jellyfinUrl,
  jellyfinBaseUrl,
}) => {
  if (!result) return null;

  return (
    <div className={styles.result}>
      <span className={styles.label}>Result:</span>
      <span className={styles.value}>{result}</span>
      {jellyfinUrl && jellyfinBaseUrl && (
        <a
          href={jellyfinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.jellyfinLink}
        >
          Open in Jellyfin
        </a>
      )}
    </div>
  );
};

export default SpinResult;

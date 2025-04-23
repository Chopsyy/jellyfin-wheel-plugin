import React, { useState } from 'react';
import styles from '../styles/Wheel.module.css';

interface WheelProps {
  items: string[]; // Explicitly define that items is an array of strings
}

const Wheel: React.FC<WheelProps> = ({ items }) => {
  const [spinning, setSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null); // Selected item is either a string or null

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * items.length);
    const selected = items[randomIndex];

    setTimeout(() => {
      setSelectedItem(selected);
      setSpinning(false);
    }, 3000); // Simulate spinning duration
  };

  return (
    <div className={styles.wheelContainer}>
      <div className={styles.wheel} onClick={spinWheel}>
        {items.map((item, index) => (
          <div key={index} className={styles.wheelItem}>
            {item}
          </div>
        ))}
      </div>
      {selectedItem && (
        <div className={styles.result}>Selected: {selectedItem}</div>
      )}
      <button
        className={styles.spinButton}
        onClick={spinWheel}
        disabled={spinning}
      >
        {spinning ? 'Spinning...' : 'Spin the Wheel!'}
      </button>
    </div>
  );
};

export default Wheel;

import React, { useState } from "react";
import styles from "../styles/Wheel.module.css";

interface WheelProps {
  items: string[];
}

const Wheel: React.FC<WheelProps> = ({ items }) => {
  const [spinning, setSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [animationStyle, setAnimationStyle] = useState({});

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * items.length);
    const selected = items[randomIndex];
    const spins = 5; // Number of full spins
    const sliceAngle = 360 / items.length;
    const randomRotation = spins * 360 + randomIndex * sliceAngle;

    const newRotation = rotation + randomRotation;

    // Set animation style for smooth spinning
    setAnimationStyle({
      transition: "transform 3s ease-out",
      transform: `rotate(${newRotation}deg)`,
    });

    setTimeout(() => {
      setRotation(newRotation % 360); // Normalize rotation to avoid overflow
      setAnimationStyle({}); // Clear animation style after spinning
      setSelectedItem(selected);
      setSpinning(false);
    }, 3000); // Match the animation duration
  };

  // Dynamically generate the conic-gradient for the wheel
  const gradientColors = [
    "#ffcccb",
    "#add8e6",
    "#90ee90",
    "#ffa07a",
    "#f4a460",
    "#dda0dd",
  ];
  const gradient = items
    .map((_, index) => {
      const color = gradientColors[index % gradientColors.length];
      const start = (index * 100) / items.length;
      const end = ((index + 1) * 100) / items.length;
      const borderGap = 0.5; // Adjust this value for the border thickness
      return `${color} ${start}% ${end - borderGap}%, black ${
        end - borderGap
      }% ${end}%`;
    })
    .join(", ");

  return (
    <div className={styles.wheelContainer}>
      <div
        className={styles.wheel}
        style={{
          ...animationStyle,
          background: `conic-gradient(${gradient})`,
        }}
        onClick={spinWheel}
      >
        {/* Removed values from slices */}
      </div>
      {selectedItem && (
        <div className={styles.result}>Selected: {selectedItem}</div>
      )}
      <button
        className={styles.spinButton}
        onClick={spinWheel}
        disabled={spinning}
      >
        {spinning ? "Spinning..." : "Spin the Wheel!"}
      </button>
      <ul className={styles.itemList}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{ color: gradientColors[index % gradientColors.length] }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export { Wheel };

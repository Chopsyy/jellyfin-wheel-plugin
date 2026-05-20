import React, { useState } from "react";
import styles from "./Wheel.module.css";

interface WheelProps {
  items: string[];
  palette: string[];
  onSpinComplete?: (result: string) => void;
}

const RADIUS = 90;
const TEXT_RADIUS = 62;
const CENTER_RADIUS = 12;
const SPIN_DURATION = 3000;
const SPIN_ROTATIONS = 5;

const toRad = (deg: number) => (deg * Math.PI) / 180;

const toXY = (angleDeg: number, r: number) => ({
  x: Math.sin(toRad(angleDeg)) * r,
  y: -Math.cos(toRad(angleDeg)) * r,
});

function slicePath(startDeg: number, endDeg: number, r: number): string {
  if (endDeg - startDeg >= 360) {
    return `M 0 ${-r} A ${r} ${r} 0 1 1 0.001 ${-r} Z`;
  }
  const s = toXY(startDeg, r);
  const e = toXY(endDeg, r);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M 0 0 L ${s.x.toFixed(3)} ${s.y.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)} Z`;
}

function truncate(text: string, sliceAngle: number, fontSize: number): string {
  const arcLen = TEXT_RADIUS * toRad(sliceAngle);
  const charWidth = fontSize * 0.58;
  const max = Math.max(2, Math.floor(arcLen / charWidth));
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

const Wheel: React.FC<WheelProps> = ({ items, palette, onSpinComplete }) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning || items.length === 0) return;

    const n = items.length;
    const randomIndex = Math.floor(Math.random() * n);
    const sliceAngle = 360 / n;
    const midAngle = (randomIndex + 0.5) * sliceAngle;

    // Rotate so slice midpoint lands at pointer (0° = top)
    const currentNorm = ((rotation % 360) + 360) % 360;
    const target = ((360 - midAngle) % 360 + 360) % 360;
    const delta = ((target - currentNorm) + 360) % 360;
    const additional = (delta < 0.5 ? 360 : delta) + SPIN_ROTATIONS * 360;
    const newRotation = rotation + additional;

    setSpinning(true);
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      onSpinComplete?.(items[randomIndex]);
    }, SPIN_DURATION);
  };

  const n = items.length;
  const sliceAngle = n > 0 ? 360 / n : 360;
  const fontSize = Math.max(5, Math.min(12, 200 / Math.max(n, 1)));

  return (
    <div className={styles.container}>
      <div className={styles.wheelWrapper}>
        <div className={styles.pointer} />
        <svg
          viewBox="-100 -100 200 200"
          className={styles.wheel}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? `transform ${SPIN_DURATION}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
              : "none",
          }}
          onClick={spin}
        >
          {n === 0 ? (
            <circle r={RADIUS} fill="#555" />
          ) : (
            items.map((item, i) => {
              const start = i * sliceAngle;
              const end = (i + 1) * sliceAngle;
              const mid = (start + end) / 2;
              const color = palette[i % palette.length];
              const label = truncate(item, sliceAngle, fontSize);

              return (
                <g key={i}>
                  <path
                    d={slicePath(start, end, RADIUS)}
                    fill={color}
                    stroke="rgba(0,0,0,0.35)"
                    strokeWidth="1.5"
                  />
                  <g transform={`rotate(${mid}) translate(0, ${-TEXT_RADIUS}) rotate(90)`}>
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={fontSize}
                      fontWeight="bold"
                      fill="white"
                      style={{ fontFamily: "inherit", pointerEvents: "none" }}
                    >
                      {label}
                    </text>
                  </g>
                </g>
              );
            })
          )}
          <circle r={CENTER_RADIUS} fill="white" cx="0" cy="0" />
        </svg>
      </div>
      <button
        className={styles.spinButton}
        onClick={spin}
        disabled={spinning || items.length === 0}
      >
        {spinning ? "Spinning…" : "Spin"}
      </button>
    </div>
  );
};

export default Wheel;

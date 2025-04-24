import { useEffect, useState } from "react";
import { Wheel } from "../components/Wheel";

import styles from "../styles/Home.module.css";
import SecondWheel from "../components/SecondWheel";

const Home = () => {
  const [titles, setTitles] = useState<string[]>([]);
  const values = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Fantasy"];
  const secondWheelItems = [
    "Classic",
    "Hidden Gem",
    "unknown",
    "Trash",
    "Julian",
    "Marcel",
    "Evelyn",
    "Hannes",
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Spin the Wheel</h1>
      <div className={styles.wheelsContainer}>
        <Wheel items={values} />
        <SecondWheel items={secondWheelItems} />
      </div>
    </div>
  );
};

export default Home;

import { useEffect, useState } from "react";
import Wheel from "../components/Wheel";
import styles from "../styles/Home.module.css";

const Home = () => {
  const [titles, setTitles] = useState<string[]>([]);
  const values = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Fantasy"];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Spin the Wheel</h1>
      <Wheel items={values} />
    </div>
  );
};

export default Home;

import { useEffect, useState } from 'react';
import Wheel from '../components/Wheel';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [values, setValues] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);

  useEffect(() => {
    // Fetch genres and titles from the API
    const fetchData = async () => {
      const response = await fetch('/api/genres');
      const data = await response.json();
      setValues(data.genres); // Set genres for the wheel
      setTitles(data.titles); // Set titles
      console.log('Show Titles:', data.titles); // Log the titles
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Spin the Wheel</h1>
      <Wheel items={values} />
    </div>
  );
};

export default Home;

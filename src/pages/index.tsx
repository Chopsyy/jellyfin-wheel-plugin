import { useEffect, useState } from 'react';
import Wheel from '../components/Wheel';
import { useDarkMode } from '../context/DarkModeContext';
import styles from '../styles/Home.module.css';

const Home = () => {
  const { darkMode } = useDarkMode(); // Use global dark mode state
  const [values, setValues] = useState([
    'Value 1',
    'Value 2',
    'Value 3',
    'Value 4',
  ]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    const savedImage = localStorage.getItem('backgroundImage');
    if (savedImage) {
      setBackgroundImage(savedImage);
    }
  }, []);

  return (
    <div
      className={`${styles.container} ${!darkMode ? styles.light : ''}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      }}
    >
      <h1 className={styles.title}>Spin the Wheel</h1>
      <Wheel items={values} />
    </div>
  );
};

export default Home;

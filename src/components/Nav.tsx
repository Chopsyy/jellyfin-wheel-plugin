import Link from 'next/link';
import { useDarkMode } from '../context/DarkModeContext';
import styles from '../styles/Nav.module.css';

const Nav = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.link}>
        Home
      </Link>
      <Link href="/customize" className={styles.link}>
        Customize
      </Link>
      <button className={styles.toggleButton} onClick={toggleDarkMode}>
        {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
    </nav>
  );
};

export default Nav;

import Link from "next/link";
import { useDarkMode } from "../context/DarkModeContext";
import styles from "../styles/Nav.module.css";

const Nav = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <nav className={styles.nav}>
      <div className={styles.linksContainer}>
        <Link href="/" className={styles.link}>
          Home
        </Link>
        <Link href="/settings" className={styles.link}>
          Settings
        </Link>
      </div>
      <button className={styles.toggleButton} onClick={toggleDarkMode}>
        {darkMode ? "Dark" : "Light"}
      </button>
    </nav>
  );
};

export default Nav;

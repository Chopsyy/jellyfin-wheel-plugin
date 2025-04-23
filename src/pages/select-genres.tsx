import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/SelectGenres.module.css';

const SelectGenres = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch genres from the API
    const fetchGenres = async () => {
      const response = await fetch('/api/genres');
      const data = await response.json();
      setGenres(data.genres);
    };

    fetchGenres();
  }, []);

  const handleCheckboxChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = () => {
    // Pass selected genres to the wheel page
    router.push({
      pathname: '/',
      query: { genres: selectedGenres.join(',') },
    });
  };

  return (
    <div className={styles.container}>
      <h1>Select Genres</h1>
      <ul className={styles.genreList}>
        {genres.map((genre) => (
          <li key={genre}>
            <label>
              <input
                type="checkbox"
                value={genre}
                onChange={() => handleCheckboxChange(genre)}
              />
              {genre}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit} className={styles.submitButton}>
        Spin the Wheel
      </button>
    </div>
  );
};

export default SelectGenres;

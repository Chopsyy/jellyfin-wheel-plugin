import { useEffect, useState } from 'react';
import styles from '../styles/Customize.module.css';

const Customize = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    // Retrieve the saved background image from localStorage
    const savedImage = localStorage.getItem('backgroundImage');
    if (savedImage) {
      setBackgroundImage(savedImage);
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
      localStorage.setItem('backgroundImage', imageUrl); // Save to localStorage
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      setBackgroundImage(imageUrl);
      localStorage.setItem('backgroundImage', imageUrl); // Save to localStorage
      setImageUrl(''); // Clear the input field
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      }}
    >
      <h1 className={styles.title}>Customize Background</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className={styles.fileInput}
      />
      <div className={styles.urlInputContainer}>
        <input
          type="text"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className={styles.urlInput}
        />
        <button onClick={handleUrlSubmit} className={styles.submitButton}>
          Set Background
        </button>
      </div>
      <p className={styles.note}>
        Upload an image or enter a URL to set as the background.
      </p>
    </div>
  );
};

export default Customize;

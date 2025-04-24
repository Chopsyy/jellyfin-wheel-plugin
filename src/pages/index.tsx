import { useState } from "react";
import { Wheel } from "../components/Wheel";
import SecondWheel from "../components/SecondWheel";
import styles from "../styles/Home.module.css";

const Home = () => {
  const [wheel1Items, setWheel1Items] = useState<string[]>([]);
  const [wheel2Items, setWheel2Items] = useState<string[]>([]);

  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [availableItems1, setAvailableItems1] = useState<string[]>([
    "Action",
    "Comedy",
    "Drama",
  ]);
  const [availableItems2, setAvailableItems2] = useState<string[]>([
    "Horror",
    "Sci-Fi",
    "Fantasy",
  ]);

  const handleAddItem = (wheel: number) => {
    if (
      wheel === 1 &&
      inputValue1.trim() &&
      !availableItems1.includes(inputValue1)
    ) {
      setAvailableItems1([...availableItems1, inputValue1]);
      setWheel1Items([...wheel1Items, inputValue1]); // Automatically check the new item
      setInputValue1("");
    } else if (
      wheel === 2 &&
      inputValue2.trim() &&
      !availableItems2.includes(inputValue2)
    ) {
      setAvailableItems2([...availableItems2, inputValue2]);
      setWheel2Items([...wheel2Items, inputValue2]); // Automatically check the new item
      setInputValue2("");
    }
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    wheel: number
  ) => {
    if (event.key === "Enter") {
      handleAddItem(wheel);
    }
  };

  const handleCheckboxChange = (item: string, wheel: number) => {
    if (wheel === 1) {
      setWheel1Items((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    } else {
      setWheel2Items((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    }
  };

  const handleDeleteItem = (item: string, wheel: number) => {
    if (wheel === 1) {
      setAvailableItems1((prev) => prev.filter((i) => i !== item));
      setWheel1Items((prev) => prev.filter((i) => i !== item));
    } else {
      setAvailableItems2((prev) => prev.filter((i) => i !== item));
      setWheel2Items((prev) => prev.filter((i) => i !== item));
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Customize Your Wheels</h1>
      <div className={styles.wrapper}>
        <div className={styles.wheelSection}>
          <h2>Genre</h2>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={inputValue1}
              onChange={(e) => setInputValue1(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 1)}
              placeholder="Add a new item for Wheel 1"
            />
            <button onClick={() => handleAddItem(1)}>Add</button>
          </div>
          <div className={styles.checkboxContainer}>
            {availableItems1.map((item) => (
              <div key={item} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={wheel1Items.includes(item)}
                  onChange={() => handleCheckboxChange(item, 1)}
                />
                {item}
                <button
                  onClick={() => handleDeleteItem(item, 1)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <Wheel items={wheel1Items} />
        </div>

        <div className={styles.wheelSection}>
          <h2>Qualität</h2>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={inputValue2}
              onChange={(e) => setInputValue2(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 2)}
              placeholder="Add a new item for Wheel 2"
            />
            <button onClick={() => handleAddItem(2)}>Add</button>
          </div>
          <div className={styles.checkboxContainer}>
            {availableItems2.map((item) => (
              <div key={item} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={wheel2Items.includes(item)}
                  onChange={() => handleCheckboxChange(item, 2)}
                />
                {item}
                <button
                  onClick={() => handleDeleteItem(item, 2)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <SecondWheel items={wheel2Items} />
        </div>
      </div>
    </div>
  );
};

export default Home;

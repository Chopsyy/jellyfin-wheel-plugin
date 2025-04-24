import { useState, useEffect } from "react";
import { Wheel } from "../components/Wheel";
import SecondWheel from "../components/SecondWheel";
import styles from "../styles/Home.module.css";

const Home = () => {
  const [wheels, setWheels] = useState<
    | {
        id: number;
        items: string[];
        availableItems: string[];
        inputValue: string;
      }[]
    | null
  >(null);

  useEffect(() => {
    const savedWheels = localStorage.getItem("wheels");
    if (savedWheels) {
      try {
        setWheels(JSON.parse(savedWheels));
      } catch (error) {
        console.error("Failed to parse wheels from localStorage:", error);
        setWheels([
          { id: 1, items: [], availableItems: [], inputValue: "" },
          { id: 2, items: [], availableItems: [], inputValue: "" },
        ]);
      }
    } else {
      setWheels([
        { id: 1, items: [], availableItems: [], inputValue: "" },
        { id: 2, items: [], availableItems: [], inputValue: "" },
      ]);
    }
  }, []);

  useEffect(() => {
    if (wheels !== null) {
      try {
        localStorage.setItem("wheels", JSON.stringify(wheels));
      } catch (error) {
        console.error("Failed to save wheels to localStorage:", error);
      }
    }
  }, [wheels]);

  if (wheels === null) {
    return <div>Loading...</div>; // Prevent rendering until wheels are initialized
  }

  const handleAddItem = (wheelId: number) => {
    setWheels((prevWheels) => {
      if (!prevWheels) return []; // Handle null case

      const updatedWheels = prevWheels.map((wheel) =>
        wheel.id === wheelId &&
        wheel.inputValue.trim() &&
        !wheel.availableItems.includes(wheel.inputValue)
          ? {
              ...wheel,
              availableItems: [...wheel.availableItems, wheel.inputValue],
              items: [...wheel.items, wheel.inputValue],
              inputValue: "",
            }
          : wheel
      );

      localStorage.setItem("wheels", JSON.stringify(updatedWheels)); // Save to local storage immediately
      return updatedWheels;
    });
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    wheelId: number
  ) => {
    if (event.key === "Enter") {
      handleAddItem(wheelId);
    }
  };

  const handleCheckboxChange = (item: string, wheelId: number) => {
    setWheels((prevWheels) => {
      if (!prevWheels) return []; // Handle null case

      return prevWheels.map((wheel) =>
        wheel.id === wheelId
          ? {
              ...wheel,
              items: wheel.items.includes(item)
                ? wheel.items.filter((i) => i !== item)
                : [...wheel.items, item],
            }
          : wheel
      );
    });
  };

  const handleDeleteItem = (item: string, wheelId: number) => {
    setWheels((prevWheels) => {
      if (!prevWheels) return []; // Handle null case

      return prevWheels.map((wheel) =>
        wheel.id === wheelId
          ? {
              ...wheel,
              availableItems: wheel.availableItems.filter((i) => i !== item),
              items: wheel.items.filter((i) => i !== item),
            }
          : wheel
      );
    });
  };

  const handleInputChange = (value: string, wheelId: number) => {
    setWheels((prevWheels) => {
      if (!prevWheels) return []; // Handle null case

      return prevWheels.map((wheel) =>
        wheel.id === wheelId ? { ...wheel, inputValue: value } : wheel
      );
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Customize Your Wheels</h1>
      <div className={styles.wrapper}>
        {wheels.map((wheel) => (
          <div key={wheel.id} className={styles.wheelSection}>
            <h2>Wheel {wheel.id}</h2>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={wheel.inputValue}
                onChange={(e) => handleInputChange(e.target.value, wheel.id)}
                onKeyPress={(e) => handleKeyPress(e, wheel.id)}
                placeholder={`Add a new item for Wheel ${wheel.id}`}
              />
              <button onClick={() => handleAddItem(wheel.id)}>Add</button>
            </div>
            <div className={styles.checkboxContainer}>
              {wheel.availableItems.map((item) => (
                <div key={item} className={styles.checkboxItem}>
                  <label>
                    <input
                      type="checkbox"
                      checked={wheel.items.includes(item)}
                      onChange={() => handleCheckboxChange(item, wheel.id)}
                    />
                    {item}
                  </label>
                  <button
                    onClick={() => handleDeleteItem(item, wheel.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            {wheel.id === 1 ? (
              <Wheel items={wheel.items} />
            ) : (
              <SecondWheel items={wheel.items} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

import { useContext } from "react";
import { ThemeContext } from "context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p2 rounded focus:outline-none"
    >
      {theme === "light" ? "☀️" : "🌜"}
    </button>
  );
};

export default ThemeToggle;

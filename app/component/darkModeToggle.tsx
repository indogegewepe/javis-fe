import { useEffect, useState } from "react";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      setDark(true);
    } else if (saved === "light") {
      setDark(false);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (dark === null) return;

    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  if (dark === null) return null;

  return (
    <button
      onClick={() => setDark(!dark)}
      className="absolute top-4 right-4 p-3 shadow-lg rounded text-blue-500 bg-gray-200 dark:bg-gray-800 dark:text-white transition-colors border dark:border-gray-300/50 border-gray-700/50"
    >
      {dark ? <IconMoonStars /> : <IconSun />}
    </button>
  );
}
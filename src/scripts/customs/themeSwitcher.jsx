import React, { useState, useEffect } from "react";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import Brightness6RoundedIcon from "@mui/icons-material/Brightness6Rounded";

const themes = ["auto", "light", "dark"];

const ThemeSwitcher = () => {
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const getInitialThemeIndex = () => {
    const saved = localStorage.getItem("theme");
    return saved ? themes.indexOf(saved) : 0;
  };

  const [themeIndex, setThemeIndex] = useState(getInitialThemeIndex);

  useEffect(() => {
    const currentTheme = themes[themeIndex];

    if (currentTheme === "auto") {
      const systemTheme = getSystemTheme();
      document.documentElement.setAttribute("data-bs-theme", systemTheme);
    } else {
      document.documentElement.setAttribute("data-bs-theme", currentTheme);
    }

    localStorage.setItem("theme", currentTheme);
  }, [themeIndex]);

  const handleClick = () => {
    setThemeIndex((prevIndex) => (prevIndex + 1) % themes.length);
  };

  const renderIcon = () => {
    const currentTheme = themes[themeIndex];
    if (currentTheme === "light") return <WbSunnyRoundedIcon />;
    if (currentTheme === "dark") return <DarkModeRoundedIcon />;
    return <Brightness6RoundedIcon />;
  };

  return (
    <button className="btn btn-outline-primary p-1" onClick={handleClick}>
      {renderIcon()}
    </button>
  );
};

export default ThemeSwitcher;

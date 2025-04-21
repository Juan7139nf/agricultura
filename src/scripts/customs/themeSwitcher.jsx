import React, { useState, useEffect } from 'react';

const themes = ['auto', 'light', 'dark'];

const ThemeSwitcher = () => {
  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const getInitialThemeIndex = () => {
    const saved = localStorage.getItem('theme');
    return saved ? themes.indexOf(saved) : 0;
  };

  const [themeIndex, setThemeIndex] = useState(getInitialThemeIndex);

  useEffect(() => {
    const currentTheme = themes[themeIndex];

    if (currentTheme === 'auto') {
      const systemTheme = getSystemTheme();
      document.documentElement.setAttribute('data-bs-theme', systemTheme);
    } else {
      document.documentElement.setAttribute('data-bs-theme', currentTheme);
    }

    localStorage.setItem('theme', currentTheme);
  }, [themeIndex]);

  const handleClick = () => {
    setThemeIndex((prevIndex) => (prevIndex + 1) % themes.length);
  };

  return (
    <button className="btn btn-outline-primary" onClick={handleClick}>
      Tema: {themes[themeIndex]}
    </button>
  );
};

export default ThemeSwitcher;

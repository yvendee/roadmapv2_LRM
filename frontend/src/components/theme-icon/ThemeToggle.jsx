// src/components/theme/ThemeToggle.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const ThemeToggle = ({ isDark, setIsDark }) => {
  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 text-xl text-gray-800 dark:text-yellow-300"
      title="Toggle dark mode"
    >
      <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
    </button>
  );
};

export default ThemeToggle;


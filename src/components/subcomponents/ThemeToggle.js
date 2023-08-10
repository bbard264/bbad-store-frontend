import React, { useState, useEffect } from 'react';
import '../../styles/components/subcomponents/ThemeToggle.css';
import { useTheme } from '../../config/services/ThemeContext';
import sunIcon from '../../assets/icon/sun.png';
import moonIcon from '../../assets/icon/moon.png';

export default function ThemeToggle() {
  const { toggleTheme } = useTheme();
  const [isChecked, setIsChecked] = useState(
    localStorage.getItem('isDarkMode') === 'true'
  );

  useEffect(() => {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    setIsChecked(isDarkMode);
  }, []);

  const handleToggle = () => {
    toggleTheme();
    setIsChecked((prevIsChecked) => !prevIsChecked);
  };

  return (
    <label className="switchTheme">
      <input type="checkbox" checked={!isChecked} onChange={handleToggle} />
      <span className="sliderTheme">
        <i className="sunMoonIcon">
          {isChecked ? (
            <img src={sunIcon} alt={''} />
          ) : (
            <img src={moonIcon} alt={''} />
          )}
        </i>
      </span>
    </label>
  );
}

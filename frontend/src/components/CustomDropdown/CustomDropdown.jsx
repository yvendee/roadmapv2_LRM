// frontend\src\components\CustomDropdown\CustomDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

export default function CustomDropdown({ options, selectedOption, setSelectedOption }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="unik-dropdown-container relative w-full" ref={dropdownRef}>
      <button
        type="button"
        className="unik-dropdown-toggle w-full border rounded px-3 py-2 text-left cursor-pointer select-none"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption || 'Select an option'}
        <span className="unik-dropdown-arrow float-right">&#9662;</span> {/* Down arrow */}
      </button>

      {isOpen && (
        <div
          className="unik-dropdown-options absolute z-20 w-full mt-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto"
          style={{ scrollbarWidth: 'thin' }}
          role="listbox"
        >
          {options.length === 0 ? (
            <div className="unik-dropdown-no-options p-2 text-gray-500 text-sm">No options</div>
          ) : (
            options.map((opt, idx) => (
              <div
                key={idx}
                className={`unik-dropdown-option px-3 py-2 cursor-pointer select-none transition-colors duration-200
                    ${selectedOption === opt ? 'unik-dropdown-option-selected' : 'unik-dropdown-option-hover'}`}
                  
                onClick={() => {
                  setSelectedOption(opt);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={selectedOption === opt}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedOption(opt);
                    setIsOpen(false);
                  }
                }}
              >
                {opt}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

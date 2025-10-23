import React, { useState, useRef, useEffect } from 'react';

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
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        className="w-full border rounded px-3 py-2 text-left cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedOption || 'Select an option'}
        <span className="float-right">&#9662;</span> {/* Down arrow */}
      </button>

      {isOpen && (
        <div
          className="absolute z-20 w-full mt-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto"
          style={{ scrollbarWidth: 'thin' }}
        >
          {options.length === 0 ? (
            <div className="p-2 text-gray-500 text-sm">No options</div>
          ) : (
            options.map((opt, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white ${
                  selectedOption === opt ? 'bg-blue-600 text-white' : ''
                }`}
                onClick={() => {
                  setSelectedOption(opt);
                  setIsOpen(false);
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

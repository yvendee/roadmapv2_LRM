import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useCompanyFilterStore } from '../../store/layout/companyFilterStore';
import useLoginStore from '../../store/loginStore'; 
import './TopbarDropdown.css';

const TopbarDropdown = () => {
  const dropdownRef = useRef(null);
  const { options, selected, setSelected } = useCompanyFilterStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loggedUser = useLoginStore((state) => state.user); 

  // 🔒 Only show if superadmin
  // if (loggedUser?.role !== 'superadmin') return null;
  if (loggedUser?.role !== 'superadmin') return <span>&nbsp;</span>;

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    setLoading(true);

    // Hide loader after 1 second
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative flex items-center space-x-2 w-auto">
      <p>&nbsp;</p>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        Company Filter:
      </label>

      <div
        // className="relative bg-white dark:bg-gray-800 border dark:border-gray-600 px-3 py-2 rounded cursor-pointer text-sm text-gray-800 dark:text-gray-100 flex justify-between items-center whitespace-nowrap"
          className="relative bg-white dark:bg-gray-800 border dark:border-gray-600 px-3 py-2 rounded cursor-pointer text-sm text-gray-800 dark:text-gray-100 flex justify-between items-center whitespace-nowrap"
        onClick={toggleDropdown}
      >
        {selected}
        <span className="mx-1">&nbsp;</span>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </div>


      {loading && (
        <div className="loader-balls">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}

      {isOpen && (
        <ul
          className="dropdown-scroll absolute top-12 left-[130px] z-10 mt-1 max-h-100 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded shadow text-sm"
          onMouseEnter={(e) => (e.currentTarget.style.overflowY = 'auto')}
          onMouseLeave={(e) => (e.currentTarget.style.overflowY = 'hidden')}
          style={{ minWidth: '100%' }}
        >
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="dropdown-item"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopbarDropdown;

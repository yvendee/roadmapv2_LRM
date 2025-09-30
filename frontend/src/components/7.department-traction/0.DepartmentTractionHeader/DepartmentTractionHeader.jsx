// frontend\src\components\7.department-traction\0.DepartmentTractionHeader\DepartmentTractionHeader.jsx
import React, { useState } from 'react';
import crmBarChart from '../../../assets/images/webp/crm-bar-chart.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faChevronDown, faBullseye, faBolt } from '@fortawesome/free-solid-svg-icons';
import './DepartmentTractionHeader.css'; // Optional if you want to isolate styles

const DepartmentTractionHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handlePrint = (type) => {
    setShowDropdown(false);
    const event = new CustomEvent('print-section', {
      detail: { type }, // e.g. 'department-annual', 'department-traction'
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="row mb-1">
      <div className="col-md-12">
        <div className="card bg-100 shadow-none border px-4 py-2 mr-[15px]">
          <div className="flex items-center justify-between p-2 ms-2 w-full">

            {/* Left: icon + title */}
            <div className="flex items-center gap-3">
              <img src={crmBarChart} alt="" width="90" />
              <h4 className="fw-bold mb-0">Department Traction</h4>
            </div>

            {/* Right: print dropdown */}
            <div className="relative inline-block text-left">
              <div
                onClick={() => setShowDropdown((prev) => !prev)}
                className="btn btn-dark btn-sm flex items-center gap-1 dark:text-black cursor-pointer"
              >
                <FontAwesomeIcon icon={faPrint} />
                <span>Print</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div
                      onClick={() => handlePrint('department-annual')}
                      className="dropdown-option"
                    >
                      <FontAwesomeIcon icon={faBullseye} />
                      <span>Print Department Annual Priorities</span>
                    </div>
                    <div
                      onClick={() => handlePrint('department-traction')}
                      className="dropdown-option"
                    >
                      <FontAwesomeIcon icon={faBolt} />
                      <span>Print Department Traction</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentTractionHeader;

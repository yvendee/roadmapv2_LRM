import React, { useState } from 'react';
import crmBarChart from '../../../assets/images/webp/crm-bar-chart.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faChevronDown, faBullseye, faBolt } from '@fortawesome/free-solid-svg-icons';

const CompanyTractionHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handlePrint = (type) => {
    setShowDropdown(false);
    console.log(`Printing: ${type}`);
    window.print();
  };

  return (
    <div className="row mb-1">
      <div className="col-md-12">
        <div className="card bg-100 shadow-none border px-4 py-2">
          <div className="d-flex align-items-center justify-between px-2">

            {/* Left: image and title */}
            <div className="col-sm-auto inline-center d-flex align-items-center gap-3 p-2 ms-2">
              <img src={crmBarChart} alt="" width="90" />
              <h4 className="fw-bold mb-0">Company Traction</h4>
            </div>

            {/* Right: print dropdown */}
            <div className="position-relative">
              <div
                onClick={() => setShowDropdown(prev => !prev)}
                className="btn btn-dark btn-sm d-flex align-items-center gap-2 cursor-pointer dark:text-black"
              >
                <FontAwesomeIcon icon={faPrint} />
                <span>Print</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>

              {showDropdown && (
                <div className="position-absolute end-0 mt-2 w-100 bg-white border rounded shadow z-10">
                  <div className="py-1">

                    <div
                      onClick={() => handlePrint('annual')}
                      className="d-flex align-items-center gap-2 px-3 py-2 text-sm text-gray-700 hover-bg-gray-100 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faBullseye} />
                      <span>Print Annual Priorities Only</span>
                    </div>

                    <div
                      onClick={() => handlePrint('traction')}
                      className="d-flex align-items-center gap-2 px-3 py-2 text-sm text-gray-700 hover-bg-gray-100 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faBolt} />
                      <span>Print Traction Only</span>
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

export default CompanyTractionHeader;

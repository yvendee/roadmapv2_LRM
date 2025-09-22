// frontend\src\components\one-page-strategic-plan\0.HeaderWithPrint\HeaderWithPrint.jsx
import React from 'react';
import crmBarChart from '../../../assets/images/webp/crm-bar-chart.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { useCompanyFilterStore } from '../../../store/layout/companyFilterStore';
import logo from '../../../assets/images/webp/momentum-logo.webp'; // Adjust path as needed

const HeaderWithPrint = () => {
  const selected = useCompanyFilterStore((state) => state.selected);

  const handlePrint = () => {
    window.print();
  };

  return (

    <>


      <div className="row mb-1">

      <div id="print-area" className="p-4">

        <div className="print-logo-container" style={{ display: 'none' }}>
          <img
            src={logo}
            alt="MomentumOS"
            style={{ height: '40px', position: 'absolute', top: '10px', left: '10px' }}
          />
        </div>
        <br></br>
        <br></br>

        </div>


        <div className="col-md-12">
          <div className="card bg-100 shadow-none border px-4 py-2 mr-[15px]">
            <div className="flex items-center justify-between p-2 ms-2 w-full">
              {/* Left: icon + title */}
              <div className="flex items-center gap-3">
                <img src={crmBarChart} alt="" width="90" />
                <h4 className="fw-bold mb-0">One Page Strategic Plan - {selected}</h4>
              </div>

              {/* Right: print button */}
              <button
                onClick={handlePrint}
                className="btn btn-dark btn-sm flex items-center gap-1 dark:text-black"
              >
                <FontAwesomeIcon icon={faPrint} />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    
    </>
  );
};
  
export default HeaderWithPrint;
import React from 'react';
import crmBarChart from '../../../assets/images/webp/crm-bar-chart.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
const HeaderWithPrint = () => {
    const handlePrint = () => {
      window.print();
    };
  
    return (
      <div className="row mb-1">
        <div className="col">
          <div className="card bg-100 shadow-none border">
            <div className="row gx-0 flex-between-center">
              <div className="col-sm-auto inline-center d-flex align-items-center gap-3 p-2">
                <img src={crmBarChart} alt="" width="90" />
                <h4 className="fw-bold mb-0">One Page Strategic Plan -</h4>
              </div>
              <div className="col-sm-auto p-2">
                <button onClick={handlePrint} className="btn btn-dark btn-sm d-flex align-items-center gap-1">
                  <FontAwesomeIcon icon={faPrint} />
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default HeaderWithPrint;
// frontend\src\components\7A.13-week-sprint\0.13WeekSprintHeader\13WeekSprintHeader.jsx
import React from 'react';
import crmBarChart from '../../../assets/images/webp/crm-bar-chart.webp';

const ThirteenWeekSprintHeader = () => {

  return (

  <div className="row mb-1">
    <div className="col-md-12">
      <div className="card bg-100 shadow-none border px-4 py-2">
        {/* <div className="d-flex align-items-center gap-3"> */}
        <div className="col-sm-auto inline-center d-flex align-items-center gap-3 p-2 ms-2">

          <img src={crmBarChart} alt="" width="90" />
          <h4 className="fw-bold mb-0">13 Week Sprint</h4>
        </div>
      </div>
    </div>
  </div>

  );
};

export default ThirteenWeekSprintHeader;

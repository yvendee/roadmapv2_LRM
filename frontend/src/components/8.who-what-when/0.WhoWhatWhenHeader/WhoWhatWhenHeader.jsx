// frontend\src\components\8.who-what-when\0.WhoWhatWhenHeader\WhoWhatWhenHeader.jsx
import crmBarChart from '../../../assets/images/webp/crm-bar-chart.webp';

const WhoWhatWhenHeader = () => {

  return (

  <div className="row mb-1">
    <div className="col-md-12">
      <div className="card bg-100 shadow-none border px-4 py-2">
        {/* <div className="d-flex align-items-center gap-3"> */}
        <div className="col-sm-auto inline-center d-flex align-items-center gap-3 p-2 ms-2">

          <img src={crmBarChart} alt="" width="90" />
          <h4 className="fw-bold mb-0">Who What When</h4>
        </div>
      </div>
    </div>
  </div>

  );
};

export default WhoWhatWhenHeader;

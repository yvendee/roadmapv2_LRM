// frontend\src\components\12.coaching-alignment\0.CoachingAlignmentHeader\CoachingAlignmentHeader.jsx
import React from 'react';
import crmBarChart from '../../../assets/images/webp/crm-bar-chart.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useHandleEditStore } from '../../../store/left-lower-content/12.coaching-alignment/0.handleEditStore';
import useLoginStore from '../../../store/loginStore'; 

const CoachingAlignmentHeader = () => {
  const { isEditing, setIsEditing } = useHandleEditStore();
  const { user } = useLoginStore(); 

  const handleEdit = () => {
    // setIsEditing(true);
    
    // Toggle the edit mode
    setIsEditing(!isEditing);
  };

  return (

  <div className="row mb-1">
    <div className="col-md-12">
      <div className="card bg-100 shadow-none border px-4 py-2 mr-[15px]">
          <div className="flex items-center justify-between p-2 ms-2 w-full">
            {/* Left: icon + title */}
            <div className="flex items-center gap-3">
              <img src={crmBarChart} alt="" width="90" />
              <h4 className="fw-bold mb-0">Coaching Alignment</h4>
            </div>

            {/* Right: Conditionally render Edit button if user is superadmin */}
            {user?.role === 'superadmin' && (
              <button
                onClick={handleEdit}
                className="btn btn-dark btn-sm flex items-center gap-1 dark:text-black"
              >
                <FontAwesomeIcon icon={faPen} />
                <span>Edit</span>
              </button>
            )}
          </div>
      </div>
    </div>
  </div>

  );
};

export default CoachingAlignmentHeader;

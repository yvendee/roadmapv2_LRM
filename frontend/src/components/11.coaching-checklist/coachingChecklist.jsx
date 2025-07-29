// frontend\src\components\11.coaching-checklist\coachingChecklist.jsx
import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import CoachingChecklistHeader from './0.CoachingChecklistHeader/CoachingChecklistHeader';
import API_URL from '../../configs/config';
import './coachingChecklist.css';


const CoachingChecklist = () => {
  const { user, setUser } = useUserStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="main-content-view">
      <CoachingChecklistHeader />

      <span>&nbsp;</span>  
    </div>
  );
};

export default CoachingChecklist;

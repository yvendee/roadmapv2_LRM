// frontend\src\components\12.coaching-alignment\coachingAlignment.jsx
import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import CoachingAlignmentHeader from './0.CoachingAlignmentHeader/CoachingAlignmentHeader';
import API_URL from '../../configs/config';
import './coachingAlignment.css';


const CoachingAlignment = () => {
  const { user, setUser } = useUserStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="main-content-view">
      <CoachingAlignmentHeader />

      <span>&nbsp;</span>  
    </div>
  );
};

export default CoachingAlignment;

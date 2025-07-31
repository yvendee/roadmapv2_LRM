// frontend\src\components\7A.thirteen-week-sprint\ThirteenWeekSprint.jsx
import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import ThirteenWeekSprintHeader from './0.13WeekSprintHeader/13WeekSprintHeader';
import WeeklySprintTracker from './1.WeeklySprintTracker/WeeklySprintTracker';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import './ThirteenWeekSprint.css';

const ThirteenWeekSprint = () => {



  return (

    <div className="main-content-view">
      <ThirteenWeekSprintHeader />
      <WeeklySprintTracker />
      
      <span>&nbsp;</span>  
    </div>

  );
};

export default ThirteenWeekSprint;

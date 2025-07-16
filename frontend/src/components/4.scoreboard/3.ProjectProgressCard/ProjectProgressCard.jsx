// frontend\src\components\4.scoreboard\3.ProjectProgressCard\ProjectProgressCard.jsx
import React from 'react';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useProjectProgressStore, { initialProjectProgress } from '../../../store/left-lower-content/4.scoreboard/3.projectProgressCardStore';
import './ProjectProgressCard.css';

const ProjectProgressCard = () => {
  const completed = useProjectProgressStore((state) => state.completed);
  const total = useProjectProgressStore((state) => state.total);
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="progress-card">
      <div className="progress-header">
        <FontAwesomeIcon icon={faListCheck} className="progress-icon" />
        <span>Project Progress</span>
      </div>
      <div className="progress-bar-wrapper">
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="progress-label">{percent}% Complete</div>
      </div>
      <div className="progress-footer">
        <span>Completed: {completed} items</span>
        <span>Total: {total} items</span>
      </div>
    </div>
  );
};

export default ProjectProgressCard;

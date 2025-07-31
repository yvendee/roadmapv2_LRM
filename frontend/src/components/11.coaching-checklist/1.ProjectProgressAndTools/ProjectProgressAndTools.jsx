// frontend\src\components\11.coaching-checklist\1.ProjectProgressAndTools\ProjectProgressAndTools.jsx
import React from 'react';
import './ProjectProgressAndTools.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faWrench, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import useProjectToolsStore from '../../../store/left-lower-content/11.coaching-checklist/1.projectProgressAndToolsStore';

const ProjectProgressAndTools = () => {
    
    const { completedItems, totalItems, nextRecommendedTools } = useProjectToolsStore();


    const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

    return (
    <div className="project-tools-container">
        {/* Project Progress */}
        <div className="project-progress-box">
        <div className="box-title">
            <FontAwesomeIcon icon={faListCheck} className="box-icon" />
            <span>Project Progress</span>
        </div>
        <div className="progress-bar-container">
            <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
                {progress}% Complete
            </div>
            </div>
        </div>
        <div className="progress-info">
            <span>Completed: {completedItems} items</span>
            <span>Total: {totalItems} items</span>
        </div>
        </div>

        {/* Next Recommended Tools */}
        <div className="recommended-tools-box always-black">
        <div className="box-title">
            <FontAwesomeIcon icon={faWrench} className="box-icon" />
            <span>Next Recommended Tools</span>
        </div>
        <div className="next-tool">
        <FontAwesomeIcon icon={faArrowRight} className="next-icon" />
        <ul>
            {nextRecommendedTools.map((tool) => (
            <li key={tool.id}>{tool.name}</li>
            ))}
        </ul>
        </div>

        </div>
    </div>
    );
};

export default ProjectProgressAndTools;

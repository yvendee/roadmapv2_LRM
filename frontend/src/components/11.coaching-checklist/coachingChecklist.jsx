// frontend\src\components\11.coaching-checklist\coachingChecklist.jsx
import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import CoachingChecklistHeader from './0.CoachingChecklistHeader/CoachingChecklistHeader';
import ProjectProgressAndTools from './1.ProjectProgressAndTools/ProjectProgressAndTools';
import CollapsiblePanels from './2.CollapsiblePanels/CollapsiblePanels'
import useProjectToolsStore from '../../store/left-lower-content/11.coaching-checklist/1.projectProgressAndToolsStore';
import useAccordionChecklistStore from '../../store/left-lower-content/11.coaching-checklist/2.collapsiblePanelsStore';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import './coachingChecklist.css';


const CoachingChecklist = () => {
  const { user, setUser } = useUserStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const organization = useLayoutSettingsStore((state) => state.organization);
  const setCompletedItems = useProjectToolsStore((state) => state.setCompletedItems);
  const setTotalItems = useProjectToolsStore((state) => state.setTotalItems);
  const setNextRecommendedTools = useProjectToolsStore((state) => state.setNextRecommendedTools);
  const { panels, setPanels } = useAccordionChecklistStore();


  // Fetch Project Progress & Recommended Tools Data
  // useEffect(() => {
  //   const encodedOrg = encodeURIComponent(organization);

  //   fetch(`${API_URL}/v1/coaching-checklist/project-progress?organization=${encodedOrg}`, {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     credentials: 'include',
  //   })
  //     .then(async (res) => {
  //       const json = await res.json();
  //       if (res.ok) {
  //         ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Project Progress & Tools:', json);
  //         if (json && typeof json === 'object') {
  //           const { completedItems, totalItems, nextRecommendedTools } = json;
  //           setCompletedItems(completedItems);
  //           setTotalItems(totalItems);
  //           setNextRecommendedTools(nextRecommendedTools);
  //         } else {
  //           console.error('⚠️ Unexpected format in project progress response');
  //         }
  //       } else if (res.status === 401) {
  //         navigate('/', { state: { loginError: 'Session Expired' } });
  //       } else {
  //         console.error('Fetch error:', json.message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('API error:', err);
  //     });
  // }, [organization]);

  // Fetch Accordion Checklist Data
  useEffect(() => {

    const localData = localStorage.getItem('CoachingChecklistData');
    if (!localData) {

      const encodedOrg = encodeURIComponent(organization);
    
      fetch(`${API_URL}/v1/coaching-checklist/panels?organization=${encodedOrg}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then(async (res) => {
          const json = await res.json();
          if (res.ok) {
            ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Accordion Panels:', json);
            if (Array.isArray(json)) {
              setPanels(json);
            } else {
              console.error('⚠️ Unexpected panels format received.');
            }
          } else if (res.status === 401) {
            navigate('/', { state: { loginError: 'Session Expired' } });
          } else {
            console.error('Fetch error:', json.message);
          }
        })
        .catch((err) => {
          console.error('API error:', err);
        });
    }
  }, [organization]);
  

  return (
    <div className="main-content-view">
      <CoachingChecklistHeader />
      <ProjectProgressAndTools />
      <CollapsiblePanels />

      <span>&nbsp;</span>  
    </div>
  );
};

export default CoachingChecklist;

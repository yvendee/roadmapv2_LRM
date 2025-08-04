// frontend\src\components\12.coaching-alignment\coachingAlignment.jsx
import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import CoachingAlignmentHeader from './0.CoachingAlignmentHeader/CoachingAlignmentHeader';
import CurrentFocus from './1.CurrentFocus/CurrentFocus'
import CurrentBusinessPulse from './2.CurrentBusinessPulse/CurrentBusinessPulse';
import WhatsNext from './3.WhatsNext/WhatsNext';
import CoachingGoals from './4.CoachingGoals/CoachingGoals';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import API_URL from '../../configs/config';
import useCurrentFocusStore from '../../store/left-lower-content/12.coaching-alignment/1.currentFocusStore';
import useBusinessPulseStore from '../../store/left-lower-content/12.coaching-alignment/2.currentBusinessPulseStore';
import useWhatsNextStore from '../../store/left-lower-content/12.coaching-alignment/3.whatsNextStore';
import useCoachingGoalsStore from '../../store/left-lower-content/12.coaching-alignment/4.coachingGoalsStore';
import { ENABLE_CONSOLE_LOGS } from '../../configs/config';
import './coachingAlignment.css';


const CoachingAlignment = () => {
  const { user, setUser } = useUserStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const organization = useLayoutSettingsStore((state) => state.organization);
  const setCurrentFocus = useCurrentFocusStore((state) => state.setCurrentFocus);
  const setPulseItems = useBusinessPulseStore((state) => state.setPulseItems);
  const setWhatsNext = useWhatsNextStore((state) => state.setWhatsNext);
  // const setCoachingGoals = useCoachingGoalsStore((state) => state.setCoachingGoals);
  const coachingGoalsItems = useCoachingGoalsStore((state) => state.coachingGoalsItems);
  const setCoachingGoals = useCoachingGoalsStore((state) => state.setCoachingGoals);


  // Fetch Current Focus Data
  useEffect(() => {
    if (!organization) return; // Guard against undefined or empty organization
  
    const encodedOrg = encodeURIComponent(organization);
  
    const fetchCurrentFocus = async () => {
      try {
        const res = await fetch(`${API_URL}/v1/coaching-alignment/current-focus?organization=${encodedOrg}`);
        if (!res.ok) {
          throw new Error('Failed to fetch current focus');
        }
        const data = await res.json();
        setCurrentFocus(data);
        ENABLE_CONSOLE_LOGS && console.log('Current focus loaded:', data);
      } catch (err) {
        ENABLE_CONSOLE_LOGS && console.error('Error loading current focus:', err);
      }
    };
  
    fetchCurrentFocus();
  }, [organization, setCurrentFocus]); // 👈 Must include `organization`
  
  // Fetch Business Pulse Data
  useEffect(() => {
    if (!organization) return;

    const encodedOrg = encodeURIComponent(organization);

    const fetchPulseData = async () => {
      try {
        const res = await fetch(`${API_URL}/v1/coaching-alignment/current-business-pulse?organization=${encodedOrg}`);
        if (!res.ok) {
          throw new Error('Failed to fetch business pulse');
        }
        const data = await res.json();
        setPulseItems(data);
        ENABLE_CONSOLE_LOGS && console.log('Business pulse loaded:', data);
      } catch (err) {
        ENABLE_CONSOLE_LOGS && console.error('Error loading business pulse:', err);
      }
    };

    fetchPulseData();
  }, [organization, setPulseItems]);


  // Fetch WhatsNext Data
  useEffect(() => {
    if (!organization) return;

    const encodedOrg = encodeURIComponent(organization);

    const fetchWhatsNext = async () => {
      try {
        const res = await fetch(`${API_URL}/v1/coaching-alignment/whats-next?organization=${encodedOrg}`);
        if (!res.ok) {
          throw new Error('Failed to fetch what\'s next items');
        }
        const data = await res.json();
        setWhatsNext(data);
        ENABLE_CONSOLE_LOGS && console.log('WhatsNext loaded:', data);
      } catch (err) {
        ENABLE_CONSOLE_LOGS && console.error('Error loading WhatsNext:', err);
      }
    };

    fetchWhatsNext();
  }, [organization, setWhatsNext]);

  // Fetch Coaching Goals Data
  useEffect(() => {
    if (!organization) return;

    const fetchCoachingGoals = async () => {
      try {
        const encodedOrg = encodeURIComponent(organization);
        const res = await fetch(`${API_URL}/v1/coaching-alignment/coaching-goals?organization=${encodedOrg}`);
        if (!res.ok) {
          throw new Error('Failed to fetch coaching goals');
        }
        const data = await res.json();
        setCoachingGoals(data);
        ENABLE_CONSOLE_LOGS && console.log('Fetched coaching goals:', data);
      } catch (err) {
        ENABLE_CONSOLE_LOGS && console.error('Error fetching coaching goals:', err);
      }
    };

    fetchCoachingGoals();
  }, [organization, setCoachingGoals]);

  
  return (
    <div className="main-content-view">
      <CoachingAlignmentHeader />
      <CurrentFocus />
      <CurrentBusinessPulse />
      <WhatsNext />
      <CoachingGoals />

      <span>&nbsp;</span>  
    </div>
  );
};

export default CoachingAlignment;

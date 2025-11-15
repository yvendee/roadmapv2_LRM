// frontend\src\components\4.scoreboard\Scoreboard.jsx
import React, { useEffect, useState } from 'react';
import ScoreBoardHeader from './0.ScoreBoardHeader/ScoreBoardHeader';
import AnnualPrioritiesScoreboard from './1.AnnualPrioritiesScoreboard/AnnualPrioritiesScoreboard';
import CompanyTractionCards from './2.CompanyTractionCards/CompanyTractionCards';
import ProjectProgressCard from './3.ProjectProgressCard/ProjectProgressCard';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import useAnnualPrioritiesStore from '../../store/left-lower-content/4.scoreboard/1.annualPrioritiesScoreboardStore';
import useCompanyTractionStore from '../../store/left-lower-content/4.scoreboard/2.companyTractionCardsStore';
import useProjectProgressStore from '../../store/left-lower-content/4.scoreboard/3.projectProgressCardStore';
import useMembersDepartmentsStore from '../../store/left-lower-content/16.members-directory/1.membersDirectoryStore';
// import useUserStore from '../../store/userStore';
// Store for the circular cards (Scoreboard)
import useCompanyTractionCardsStore from '../../store/left-lower-content/4.scoreboard/2.companyTractionCardsStore';
import useCompanyTractionTableStore from '../../store/left-lower-content/6.company-traction/2.companyTractionStore';

import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import './Scoreboard.css';

const Scoreboard = () => {
  // const { user, setUser } = useUserStore();
  // const [error, setError] = useState(null);
  const navigate = useNavigate();
  const organization = useLayoutSettingsStore((state) => state.organization);
  const setAnnualPriorities = useAnnualPrioritiesStore((state) => state.setAnnualPriorities);
  const setQuarters = useCompanyTractionStore((state) => state.setQuarters);
  const updateProgress = useProjectProgressStore((state) => state.updateProgress);

  const companyTraction = useCompanyTractionTableStore((state) => state.companyTraction);
  const setQuartersCard= useCompanyTractionCardsStore((state) => state.setQuarters);

  const membersDirectory = useMembersDepartmentsStore((state) => state.MembersDepartmentsTable);



  // // Annual-Priorities
  // useEffect(() => {
  //   const encodedOrg = encodeURIComponent(organization);

  //   fetch(`${API_URL}/v1/scoreboard/annual-priorities?organization=${encodedOrg}`, {
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
  //         ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Annual Priorities:', json);
  //         setAnnualPriorities(json);
  //       } else if (res.status === 401) {
  //         navigate('/', { state: { loginError: 'Session Expired' } });
  //       } else {
  //         console.error('❌ Server error:', json.message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('❌ Fetch error:', err);
  //     });
  // }, [organization]);


  // Annual Priorities - computed from company traction store
  useEffect(() => {

    if (!companyTraction) return;

    // Flatten Q1–Q4 tasks
    const allTasks = [
      ...(companyTraction.Q1 || []),
      ...(companyTraction.Q2 || []),
      ...(companyTraction.Q3 || []),
      ...(companyTraction.Q4 || []),
    ];

    // Helper to extract first name
    const firstName = (full) => {
      if (!full) return "";
      return full.trim().split(" ")[0]; // first word
    };

    // Build map of firstname → progress numbers
    const progressMap = {};

    allTasks.forEach((task) => {
      const names = [task.who, task.collaborator];

      names.forEach((n) => {
        const fname = n ? firstName(n) : "others";

        if (!progressMap[fname]) progressMap[fname] = [];

        const p = parseFloat(task.progress.replace("%", "")) || 0;
        progressMap[fname].push(p);
      });
    });

    // Build final list: fullname + score
    const results = [];

    Object.keys(progressMap).forEach((fname) => {
      const list = progressMap[fname];
      if (list.length === 0) return;

      const sum = list.reduce((a, b) => a + b, 0);
      const score = Math.round(sum / list.length); // your formula

      // match fullname
      let fullname = "Others";

      const match = membersDirectory.find((m) =>
        firstName(m.fullname).toLowerCase() === fname.toLowerCase()
      );

      if (match) fullname = match.fullname;

      results.push({ name: fullname, score });
    });

    // Compute average score
    const avg =
      results.length === 0
        ? 0
        : Math.round(results.reduce((a, b) => a + b.score, 0) / results.length);

    // Save to Annual Priorities Store
    setAnnualPriorities({
      average: avg,
      members: results,
    });

    ENABLE_CONSOLE_LOGS &&
      console.log("⭐ Computed Annual Priorities:", {
        average: avg,
        members: results,
      });
  }, [
    useCompanyTractionTableStore((s) => s.companyTraction),
    useMembersDepartmentsStore((s) => s.MembersDepartmentsTable),
  ]);


  // Company-Traction-Cards
  // useEffect(() => {
  //   const encodedOrg = encodeURIComponent(organization);

  //   fetch(`${API_URL}/v1/scoreboard/company-traction-cards?organization=${encodedOrg}`, {
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
  //         ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Company Traction Cards:', json);
  //         setQuarters(json);
  //       } else if (res.status === 401) {
  //         navigate('/', { state: { loginError: 'Session Expired' } });
  //       } else {
  //         console.error('❌ Server error:', json.message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('❌ Fetch error:', err);
  //     });
  // }, [organization]);

  // 🧠 Company-Traction-Cards (Reactive Calculation)
  useEffect(() => {
  
    const calculateAveragePercent = (quarterData = []) => {
      if (!Array.isArray(quarterData) || quarterData.length === 0) return 0;

      const validProgress = quarterData
        .map((item) => {
          if (!item?.progress) return 0;
          const num = parseFloat(item.progress.toString().replace('%', '').trim());
          return isNaN(num) ? 0 : num;
        })
        .filter((p) => !isNaN(p));

      if (validProgress.length === 0) return 0;

      const sum = validProgress.reduce((acc, val) => acc + val, 0);
      return Math.round(sum / validProgress.length);
    };

    const newPercents = [
      { label: 'Q1', percent: calculateAveragePercent(companyTraction?.Q1 || []) },
      { label: 'Q2', percent: calculateAveragePercent(companyTraction?.Q2 || []) },
      { label: 'Q3', percent: calculateAveragePercent(companyTraction?.Q3 || []) },
      { label: 'Q4', percent: calculateAveragePercent(companyTraction?.Q4 || []) },
    ];

    ENABLE_CONSOLE_LOGS && console.log('📊 Recalculated Company Traction Percents:', newPercents);
    setQuartersCard(newPercents);
  }, [organization, useCompanyTractionTableStore((state) => state.companyTraction)]);

  // // Project-Progress
  // useEffect(() => {
  //   const encodedOrg = encodeURIComponent(organization);

  //   fetch(`${API_URL}/v1/scoreboard/project-progress?organization=${encodedOrg}`, {
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
  //         ENABLE_CONSOLE_LOGS && console.log('📥 Project Progress fetched:', json);
  //         updateProgress(json); 
  //       } else if (res.status === 401) {
  //         navigate('/', { state: { loginError: 'Session Expired' } });
  //       } else {
  //         console.error('❌ Server error:', json.message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('❌ Fetch error:', err);
  //     });
  // }, [organization]);

  // Project-Progress (Calculated from Company Traction Table Q1→Q4)
  useEffect(() => {

    if (!companyTraction) return;

    // Extract all quarters safely
    const Q1 = Array.isArray(companyTraction.Q1) ? companyTraction.Q1 : [];
    const Q2 = Array.isArray(companyTraction.Q2) ? companyTraction.Q2 : [];
    const Q3 = Array.isArray(companyTraction.Q3) ? companyTraction.Q3 : [];
    const Q4 = Array.isArray(companyTraction.Q4) ? companyTraction.Q4 : [];

    const allItems = [...Q1, ...Q2, ...Q3, ...Q4];

    // Total items
    const total = allItems.length;

    // Completed items (progress === 100%)
    const completed = allItems.filter((item) => {
      if (!item?.progress) return false;
      const num = parseFloat(item.progress.replace('%', '').trim());
      return num === 100;
    }).length;

    ENABLE_CONSOLE_LOGS &&
      console.log("📦 Calculated Project Progress (Q1→Q4):", {
        completed,
        total,
      });

    updateProgress({ completed, total });
  }, [
    organization,
    useCompanyTractionTableStore((state) => state.companyTraction)
  ]);


  return (

    <div className="main-content-view">
      <ScoreBoardHeader />
      <AnnualPrioritiesScoreboard />
      <CompanyTractionCards />
      <ProjectProgressCard />
      <span>&nbsp;</span>  
    </div>


  );
};

export default Scoreboard;

// frontend\src\components\4.scoreboard\Scoreboard.jsx
import React, { useEffect, useState } from 'react';
import ScoreBoardHeader from './0.ScoreBoardHeader/ScoreBoardHeader';
import AnnualPrioritiesScoreboard from './1.AnnualPrioritiesScoreboard/AnnualPrioritiesScoreboard';
import CompanyTractionCards from './2.CompanyTractionCards/CompanyTractionCards';
import ProjectProgressCard from './3.ProjectProgressCard/ProjectProgressCard';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import './Scoreboard.css';

const Scoreboard = () => {
  const { user, setUser } = useUserStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetch('/api/mock-response4')
  //     .then((res) => res.json())
  //     .then((json) => setUser(json.data));
  // }, [setUser]);

  useEffect(() => {
    fetch(`${API_URL}/mock-response3`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    })
    .then(async (res) => {
      const json = await res.json();
      if (res.ok) {
        setUser(json.data);
      } else if (res.status === 401) {
        // Redirect to login page with error message
        // navigate('/', { state: { loginError: json.message || 'Unauthorized' } });
        navigate('/', { state: {loginError: 'Session Expired'} });
      } else {
        setError(json.message || 'Failed to fetch user data');
      }
    })
    .catch((err) => {
      console.error('API error:', err);
      setError('Something went wrong.');
    });
  }, [setUser]);

  return (
    // <div>
    //   <h2 className="text-xl font-bold mb-4">Scoreboard</h2>
    //   {error ? (
    //     <p className="text-red-500">{error}</p>
    //   ) : user ? (
    //     <table className="table-auto border-collapse border border-gray-400">
    //       <tbody>
    //         <tr><td className="border p-2">Name</td><td className="border p-2">{user.name}</td></tr>
    //         <tr><td className="border p-2">Email</td><td className="border p-2">{user.email}</td></tr>
    //       </tbody>
    //     </table>
    //   ) : (
    //     <p>Loading...</p>
    //   )}
    // </div>

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

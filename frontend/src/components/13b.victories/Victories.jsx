// frontend\src\components\13b.victories\Victories.jsx
import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import VictoriesHeader from './0.VictoriesHeader/VictoriesHeader';
import VictoriesTable from '../13b.victories/1.VictoriesTable/VictoriesTable';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import './Victories.css';

const Victories = () => {
  const { user, setUser } = useUserStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetch(`${API_URL}/mock-response2`, {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //   .then(async (res) => {
  //     const json = await res.json();
  //     if (res.ok) {
  //       setUser(json.data);
  //     } else if (res.status === 401) {
  //       navigate('/', { state: {loginError: 'Session Expired'} });
  //     } else {
  //       setError(json.message || 'Failed to fetch user data');
  //     }
  //   })
  //   .catch((err) => {
  //     console.error('API error:', err);
  //     setError('Something went wrong.');
  //   });
  // }, [setUser, navigate]);

  return (
    // <div>
    //   <h2 className="text-xl font-bold mb-4">Tools</h2>
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
      <VictoriesHeader />
      <VictoriesTable />

      <span>&nbsp;</span>  
    </div>
  );
};

export default Victories;

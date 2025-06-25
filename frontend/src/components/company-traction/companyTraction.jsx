//frontend\src\components\company-traction\companyTraction.jsx
import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import './companyTraction.css';


const CompanyTraction = () => {
  const { user, setUser } = useUserStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetch('/api/mock-response5')
  //     .then((res) => res.json())
  //     .then((json) => setUser(json.data));
  // }, [setUser]);

  // useEffect(() => {
  //   fetch('/api/mock-response5', {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //   }
  //   })
  //     .then(async (res) => {
  //       const json = await res.json();
  //       if (res.ok) {
  //         setUser(json.data);
  //       } else {
  //         setError(json.message || 'Failed to fetch user data');
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('API error:', err);
  //       setError('Something went wrong.');
  //     });
  // }, [setUser]);


  useEffect(() => {
    fetch('/api/mock-response5', {
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
  }, [setUser, navigate]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Company Traction</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : user ? (
        <table className="table-auto border-collapse border border-gray-400">
          <tbody>
            <tr><td className="border p-2">Name</td><td className="border p-2">{user.name}</td></tr>
            <tr><td className="border p-2">Email</td><td className="border p-2">{user.email}</td></tr>
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CompanyTraction;

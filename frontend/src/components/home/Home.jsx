// frontend\src\components\home\Home.jsx
import React, { useEffect, useState } from 'react';
import API_URL from '../../configs/config';
import './Home.css';
import HomeHeader from './0.HomeHeader/HomeHeader';
import WelcomeSection from './1.WelcomeSection/WelcomeSection';

const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/mock-response1`)
      .then(res => res.json())
      .then(json => setData(json.data));
  }, []);

  return (

    
    <div className="main-content-view">

      {/* <h1 className="text-2xl dark:text-yellow-300">
        This should change color in dark mode
      </h1> */}

      {/* <h2 className="text-xl font-bold mb-4">Home</h2>
      {data ? (
        <table className="table-auto border-collapse border border-gray-400">
          <tbody>
            <tr><td className="border p-2">Name</td><td className="border p-2">{data.name}</td></tr>
            <tr><td className="border p-2">Email</td><td className="border p-2">{data.email}</td></tr>
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )} */}

      <HomeHeader />
      <WelcomeSection />

    </div>
  );
};

export default Home;

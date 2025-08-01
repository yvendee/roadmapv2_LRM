// frontend\src\components\review\Review.jsx
import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import API_URL from '../../configs/config';
import './Review.css';

const Review = () => {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    fetch(`${API_URL}/mock-response2`)
      .then((res) => res.json())
      .then((json) => setUser(json.data));
  }, [setUser]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Review</h2>
      {user ? (
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

export default Review;

import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import './Scoreboard.css';

const Scoreboard = () => {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    fetch('/api/mock-response4')
      .then((res) => res.json())
      .then((json) => setUser(json.data));
  }, [setUser]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Scoreboard</h2>
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

export default Scoreboard;

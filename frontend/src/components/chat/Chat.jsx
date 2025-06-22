import React, { useEffect, useState } from 'react';
import './Chat.css';

const Chat = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/mock-response3')
      .then(res => res.json())
      .then(json => setData(json.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      {data ? (
        <table className="table-auto border-collapse border border-gray-400">
          <tbody>
            <tr><td className="border p-2">Name</td><td className="border p-2">{data.name}</td></tr>
            <tr><td className="border p-2">Email</td><td className="border p-2">{data.email}</td></tr>
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Chat;

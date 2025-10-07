// frontend\src\components\admin-panel\pages\Users\Users.jsx
import React from 'react';
import './Users.css';
import { FaEdit } from 'react-icons/fa';

const dummyUsers = [
  {
    company: 'ABC Corp',
    name: 'John Doe',
    email: 'john.doe@example.com',
    emailVerifiedAt: '2025-05-01',
  },
  {
    company: 'XYZ Ltd',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    emailVerifiedAt: '2025-06-15',
  },
  {
    company: 'Example Inc',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    emailVerifiedAt: '',
  },
];

export default function Users() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">Maintenance &gt; Users</div>
          <h2 className="text-2xl font-semibold">Users</h2>
        </div>
        <button className="new-user-btn">New user</button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">Company</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Email Verified At</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {dummyUsers.map((user, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3">{user.company}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.emailVerifiedAt || '-'}</td>
                <td className="p-3 text-right">
                  <button className="text-orange-500 hover:text-orange-600">
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Showing 1 to {dummyUsers.length} of {dummyUsers.length} results</span>
          <div>
            <label htmlFor="perPage" className="mr-2">Per page</label>
            <select id="perPage" className="border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600">
              <option value="10">10</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

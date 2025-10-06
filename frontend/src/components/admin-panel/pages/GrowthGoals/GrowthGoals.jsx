// frontend\src\components\admin-panel\pages\GrowthGoals\GrowthGoals.jsx
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import './GrowthGoals.css';

const dummyData = [
  { company: 'Chuck Gulledge Advisors, LLC', tableName: '', year: '', annualGoal: '2,000,000' },
  { company: 'eDoc Innovations', tableName: '', year: '', annualGoal: '' },
  { company: '3R©', tableName: '', year: '', annualGoal: '' },
  { company: 'Sensei', tableName: '', year: '', annualGoal: '0' },
  { company: 'Kolb Grading', tableName: '', year: '', annualGoal: '' },
  { company: 'Texans Credit Union', tableName: '', year: '', annualGoal: '0' },
  { company: 'WESCD', tableName: '', year: '', annualGoal: '' },
  { company: 'Test Company', tableName: '', year: '', annualGoal: '5,000,000' },
  { company: 'Five Star', tableName: '', year: '', annualGoal: '' },
  { company: 'Collins Credit Union', tableName: '', year: '', annualGoal: '' },
];

export default function GrowthGoals() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-gray-500">Growth Goals &gt; List</div>
          <h2 className="text-2xl font-semibold">Growth Goals</h2>
        </div>
        <button className="new-growth-goal-btn">
          New growth goal
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">Company</th>
              <th className="p-3">Table name</th>
              <th className="p-3">Year</th>
              <th className="p-3">Annual goal</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((row, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3">{row.company}</td>
                <td className="p-3">{row.tableName || '-'}</td>
                <td className="p-3">{row.year || '-'}</td>
                <td className="p-3">{row.annualGoal || '-'}</td>
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
          <span>Showing 1 to 10 of 10 results</span>
          <div>
            <label htmlFor="perPage" className="mr-2">Per page</label>
            <select id="perPage" className="border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600">
              <option value="10">10</option>
              {/* Add more options if needed */}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

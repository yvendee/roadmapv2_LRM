// frontend\src\components\admin-panel\pages\CoreValues\CoreValues.jsx
import React from 'react';
import './CoreValues.css';
import { FaEdit } from 'react-icons/fa';

const dummyValues = [
  { company: 'ABC Corp', value: 'Integrity', icon: '🛡️' },
  { company: 'XYZ Ltd', value: 'Customer Focus', icon: '👥' },
  { company: 'Example Inc', value: 'Innovation', icon: '💡' },
  { company: 'Test Co', value: 'Excellence', icon: '🏆' },
];

export default function CoreValues() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">Tools &gt; Core Values</div>
          <h2 className="text-2xl font-semibold">Core Values</h2>
        </div>
        <button className="new-core-value-btn">New core value</button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">Company</th>
              <th className="p-3">Value</th>
              <th className="p-3">Icon</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {dummyValues.map((item, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3">{item.company}</td>
                <td className="p-3">{item.value}</td>
                <td className="p-3 text-xl">{item.icon}</td>
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
          <span>Showing 1 to {dummyValues.length} of {dummyValues.length} results</span>
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

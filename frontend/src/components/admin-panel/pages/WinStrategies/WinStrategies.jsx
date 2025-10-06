// frontend\src\components\admin-panel\pages\WinStrategies\WinStrategies.jsx
import React from 'react';
import './WinStrategies.css';
import { FaEdit } from 'react-icons/fa';

const dummyStrategies = [
  { companyId: 'ABC123', name: 'Global Expansion' },
  { companyId: 'XYZ456', name: 'Cost Leadership' },
  { companyId: 'EXM789', name: 'Product Differentiation' },
  { companyId: 'DCO321', name: 'Customer Retention' },
];

export default function WinStrategies() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-gray-500">Tools &gt; Win Strategies</div>
          <h2 className="text-2xl font-semibold">Win Strategies</h2>
        </div>
        <button className="new-win-strategy-btn">New win strategy</button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">Company ID</th>
              <th className="p-3">Name</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {dummyStrategies.map((item, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3">{item.companyId}</td>
                <td className="p-3">{item.name}</td>
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
          <span>Showing 1 to {dummyStrategies.length} of {dummyStrategies.length} results</span>
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

// frontend\src\components\admin-panel\pages\AnnualPriorities\AnnualPriorities.jsx
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import './AnnualPriorities.css';

const dummyPriorities = [
  {
    company: 'ABC Corp',
    description: 'Launch new CRM platform for sales team',
    year: '2025',
  },
  {
    company: 'XYZ Ltd',
    description: 'Expand operations into the APAC region',
    year: '2025',
  },
  {
    company: 'Example Inc',
    description: 'Cut costs in logistics by 15%',
    year: '2024',
  },
  // Add more as needed
];

export default function AnnualPriorities() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">OPSP &gt; Annual Priorities</div>
          <h2 className="text-2xl font-semibold">Annual Priorities</h2>
        </div>
        <button className="new-annual-priority-btn">
          New annual priority
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">Company</th>
              <th className="p-3">Description</th>
              <th className="p-3">Year</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {dummyPriorities.map((item, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3">{item.company}</td>
                <td className="p-3">{item.description}</td>
                <td className="p-3">{item.year}</td>
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
          <span>Showing 1 to {dummyPriorities.length} of {dummyPriorities.length} results</span>
          <div>
            <label htmlFor="perPage" className="mr-2">Per page</label>
            <select id="perPage" className="border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600">
              <option value="10">10</option>
              {/* More options if needed */}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

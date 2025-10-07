// frontend\src\components\admin-panel\pages\TableHeaders\TableHeaders.jsx
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './TableHeaders.css';

const dummyHeaders = [
  { company: 'ABC Corp', tableName: 'Annual Performance' },
  { company: 'XYZ Ltd', tableName: 'Quarterly Metrics' },
  { company: 'Example Inc', tableName: 'Employee Stats' },
  // Add more as needed
];

export default function TableHeaders() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">Maintenance &gt; Table Headers</div>
          <h2 className="text-2xl font-semibold">Table Headers</h2>
        </div>
        <button className="new-table-header-btn">New table header</button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">Company</th>
              <th className="p-3">Table Names</th>
              <th className="p-3"></th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {dummyHeaders.map((item, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3">{item.company}</td>
                <td className="p-3">{item.tableName}</td>
                <td className="p-3 text-right">
                  <button className="text-orange-500 hover:text-orange-600">
                    <FaEdit />
                  </button>
                </td>
                <td className="p-3 text-right">
                  <button className="text-red-500 hover:text-red-600">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Showing 1 to {dummyHeaders.length} of {dummyHeaders.length} results</span>
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

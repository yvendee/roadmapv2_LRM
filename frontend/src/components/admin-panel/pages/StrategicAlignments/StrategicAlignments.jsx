// frontend\src\components\admin-panel\pages\StrategicAlignments\StrategicAlignments.jsx
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import './StrategicAlignments.css';

const dummyAlignments = [
  {
    category: 'Customer Experience',
    company: 'ABC Corp',
    icon: '🎯',
  },
  {
    category: 'Operational Excellence',
    company: 'XYZ Ltd',
    icon: '⚙️',
  },
  {
    category: 'Innovation',
    company: 'Example Inc',
    icon: '💡',
  },
  // Add more rows as needed
];

export default function StrategicAlignments() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-gray-500">OPSP &gt; Strategic Alignments</div>
          <h2 className="text-2xl font-semibold">Strategic Alignments</h2>
        </div>
        <button className="new-strategic-alignment-btn">
            New strategic alignment
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">Strategic Alignment Category</th>
              <th className="p-3">Company</th>
              <th className="p-3">Icon</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {dummyAlignments.map((item, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3">{item.category}</td>
                <td className="p-3">{item.company}</td>
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
          <span>Showing 1 to {dummyAlignments.length} of {dummyAlignments.length} results</span>
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

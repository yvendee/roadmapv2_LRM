// frontend\src\components\admin-panel\pages\KeyThrustStrategicDrivers\KeyThrustStrategicDrivers.jsx
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import './KeyThrustStrategicDrivers.css';

const dummyDrivers = [
  {
    company: 'ABC Corp',
    driver: 'Expand Market Reach',
    description: 'Increase presence in emerging markets.',
    status: 'In Progress',
  },
  {
    company: 'XYZ Ltd',
    driver: 'Improve Product Quality',
    description: 'Revamp QA process across departments.',
    status: 'Completed',
  },
  {
    company: 'Example Inc',
    driver: 'Customer Satisfaction',
    description: 'Enhance support team training.',
    status: 'Planned',
  },
  // Add more dummy data as needed
];

export default function KeyThrustStrategicDrivers() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">OPSP &gt; Key Thrust Strategic Drivers</div>
          <h2 className="text-2xl font-semibold">Key Thrust Strategic Drivers</h2>
        </div>
        <button className="new-strategic-driver-btn">
          New strategic driver
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">Company</th>
              <th className="p-3">Strategic Driver</th>
              <th className="p-3">Description</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {dummyDrivers.map((item, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3">{item.company}</td>
                <td className="p-3">{item.driver}</td>
                <td className="p-3">{item.description}</td>
                <td className="p-3">{item.status}</td>
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
          <span>Showing 1 to {dummyDrivers.length} of {dummyDrivers.length} results</span>
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

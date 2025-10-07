// frontend\src\components\admin-panel\pages\FoundationalDocuments\FoundationalDocuments.jsx
import React from 'react';
import './FoundationalDocuments.css';
import { FaEdit } from 'react-icons/fa';

const dummyDocs = [
  { company: 'ABC Corp', name: 'Vision Statement', attachments: '1 file' },
  { company: 'XYZ Ltd', name: 'Mission Document', attachments: '2 files' },
  { company: 'Example Inc', name: 'Company Charter', attachments: '-' },
  { company: 'Demo Co', name: 'Leadership Framework', attachments: '3 files' },
];

export default function FoundationalDocuments() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">Tools &gt; Foundational Documents</div>
          <h2 className="text-2xl font-semibold">Foundational Documents</h2>
        </div>
        <button className="new-foundation-doc-btn">New foundational document</button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">Company</th>
              <th className="p-3">Name</th>
              <th className="p-3">Attachments</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {dummyDocs.map((doc, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3">{doc.company}</td>
                <td className="p-3">{doc.name}</td>
                <td className="p-3">{doc.attachments}</td>
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
          <span>Showing 1 to {dummyDocs.length} of {dummyDocs.length} results</span>
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

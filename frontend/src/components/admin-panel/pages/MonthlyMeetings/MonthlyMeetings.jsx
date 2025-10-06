// frontend\src\components\admin-panel\pages\MonthlyMeetings\MonthlyMeetings.jsx
import React from 'react';
import './MonthlyMeetings.css';
import { FaEdit } from 'react-icons/fa';

const dummyMeetings = [
  {
    company: 'ABC Corp',
    status: 'Scheduled',
    quarter: 'Q1',
    meetingDate: '2025-01-15',
    agenda: 'Discuss sales KPIs',
    recap: 'Action items assigned',
  },
  {
    company: 'XYZ Ltd',
    status: 'Completed',
    quarter: 'Q2',
    meetingDate: '2025-04-10',
    agenda: 'Review operations',
    recap: 'Follow-up needed',
  },
  {
    company: 'Example Inc',
    status: 'In Progress',
    quarter: 'Q3',
    meetingDate: '2025-07-22',
    agenda: 'Budget planning',
    recap: 'Pending upload',
  },
];

export default function MonthlyMeetings() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-gray-500">Session Dates &gt; Monthly Meetings</div>
          <h2 className="text-2xl font-semibold">Monthly Meetings</h2>
        </div>
        <button className="new-monthly-meeting-btn">New monthly meeting</button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">Company</th>
              <th className="p-3">Status</th>
              <th className="p-3">Quarter</th>
              <th className="p-3">Meeting Date</th>
              <th className="p-3">Meeting Agenda</th>
              <th className="p-3">Post Session Recap</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {dummyMeetings.map((item, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3">{item.company}</td>
                <td className="p-3">{item.status}</td>
                <td className="p-3">{item.quarter}</td>
                <td className="p-3">{item.meetingDate}</td>
                <td className="p-3">{item.agenda}</td>
                <td className="p-3">{item.recap}</td>
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
          <span>Showing 1 to {dummyMeetings.length} of {dummyMeetings.length} results</span>
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

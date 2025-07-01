// frontend\src\components\one-page-strategic-plan\7.ConstraintsTracker\ConstraintsTracker.jsx
import React from 'react';

const ConstraintsTracker = () => (
  <div className="p-4 bg-white rounded-lg shadow-md mt-6 overflow-x-auto mr-[15px]">
    <h5 className="text-sm font-semibold text-green-700 mb-2">Constraints Tracker</h5>
    <table className="min-w-full border border-gray-200 text-sm">
      <thead className="bg-gray-50 text-green-700">
        <tr>
          <th className="border px-3 py-2">Constraint Title</th>
          <th className="border px-3 py-2">Description</th>
          <th className="border px-3 py-2">Owner</th>
          <th className="border px-3 py-2">Actions</th>
          <th className="border px-3 py-2">Status</th>
          <th className="border px-3 py-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr className="hover:bg-gray-50">
          <td className="border px-3 py-2" colSpan={6}>&nbsp;</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default ConstraintsTracker;

// frontend\src\components\one-page-strategic-plan\6.FourDecisions\FourDecisions.jsx
import React from 'react';

const FourDecisions = () => (
  <div className="p-4 bg-white rounded-lg shadow-md mt-6 overflow-x-auto mr-[15px]">
    <h5 className="text-sm font-semibold text-green-700 mb-2">4 Decisions</h5>
    <table className="min-w-full border border-gray-200 text-sm">
      <thead className="bg-gray-50 text-green-700">
        <tr>
          <th className="border px-3 py-2 text-left">Description</th>
          <th className="border px-3 py-2">Orig</th>
          <th className="border px-3 py-2">Q1</th>
          <th className="border px-3 py-2">Q2</th>
          <th className="border px-3 py-2">Q3</th>
          <th className="border px-3 py-2">Q4</th>
          <th className="border px-3 py-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr className="hover:bg-gray-50">
          <td className="border px-3 py-2" colSpan={7}>&nbsp;</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default FourDecisions;

// frontend\src\components\one-page-strategic-plan\3.ThreeYearOutlook\ThreeYearOutlook.jsx
import React from 'react';

const outlooks = [
  { year: '2026', value: 'Revenue of $4 Million' },
  { year: '2027', value: 'Revenue of $7 Million' },
  { year: '2028', value: '' },
];

const ThreeYearOutlook = () => (
  <div className="p-4 bg-white rounded-lg shadow-md mt-6 mr-[15px]">
    <h5 className="text-md font-semibold text-green-700 mb-4">3 Year Outlook</h5>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {outlooks.map((item, index) => (
        <div key={index} className="border rounded-md p-4 min-h-[100px] shadow-sm bg-white">
          <h6 className="text-sm font-semibold text-gray-800">{item.year}</h6>
          <p className="text-sm text-gray-600 mt-1">{item.value || '\u00A0'}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ThreeYearOutlook;

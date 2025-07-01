// frontend\src\components\one-page-strategic-plan\2.FoundationsSection\FoundationsSection.jsx
import React from 'react';

const foundations = [
  {
    title: 'Our Aspiration',
    content:
      '"To be renowned as the premier coaching organization that transforms how companies achieve their optimal exits."',
  },
  {
    title: 'Our Purpose / Mission',
    content: `Our purpose is to:

Develop transformative coaching methodologies and frameworks.
Deliver extraordinary, measurable results for our clients.

Our organizational culture is designed so all team members win.`,
  },
  {
    title: 'Brand Promise',
    content: '',
  },
  {
    title: 'Profit Per X',
    content: '',
  },
  {
    title: 'BHAG',
    content: '$100 Billion in Exit Value',
  },
  {
    title: '3HAG',
    content: '$7Mil in Revenue by 2027',
  },
];

const FoundationsSection = () => {
  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md mr-[15px]">
      <h5 className="text-lg font-semibold mb-4">Foundations</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {foundations.map((item, index) => (
          <div
            key={index}
            className="border rounded-md p-4 bg-white shadow-sm min-h-[160px]"
          >
            <h6 className="text-xs text-green-600 font-semibold mb-2">{item.title}</h6>
            <p className="text-sm whitespace-pre-line text-gray-700">{item.content || '\u00A0'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoundationsSection;

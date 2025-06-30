import React from 'react';

const strategicDrivers = [
  {
    id: 1,
    title: 'Solution Innovation',
    description:
      'Focuses on productization, technology, and data integration to create repeatable, scalable solutions that deliver on the brand promise.',
  },
  {
    id: 2,
    title: 'Talent Leadership',
    description:
      'Centers on elite coach acquisition and building a high-performance culture, ensuring the team can execute the innovative solutions.',
  },
  {
    id: 3,
    title: 'Exceptional Delivery',
    description:
      'Emphasizes structured processes and achieving 10/10 ratings, turning the talent and solutions into concrete results.',
  },
  {
    id: 4,
    title: 'Market Dominance',
    description:
      'Leverages strategic alliances and builds a referral engine to expand reach, which then cycles back to reinforce the brand promise.',
  },
];

const StrategicDriversTable = () => {
  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h5 className="text-lg font-semibold mb-4">Strategic Drivers</h5>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Strategic Drivers</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2 text-center">KPI Annual Target Range</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {strategicDrivers.map((driver) => (
              <tr key={driver.id} className="hover:bg-gray-50">
                <td className="border px-4 py-3">{driver.id}</td>
                <td className="border px-4 py-3 font-medium">{driver.title}</td>
                <td className="border px-4 py-3">{driver.description}</td>
                <td className="border px-4 py-3 text-center">
                  <span className="text-xs text-gray-500 block">tbd</span>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                    Tracking
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StrategicDriversTable;

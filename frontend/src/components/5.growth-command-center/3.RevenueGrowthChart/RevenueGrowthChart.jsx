// frontend\src\components\5.growth-command-center\3.RevenueGrowthChart\RevenueGrowthChart.jsx

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'; // npm install recharts
import useRevenueGrowthStore from '../../../store/left-lower-content/5.growth-command-center/3.revenueGrowthStore';

// const revenueGrowthData = [
//   {
//     year: '2023',
//     revenueGrowth: 5,
//     cogsGrowth: 3
//   },
//   {
//     year: '2024',
//     revenueGrowth: 12,
//     cogsGrowth: 10
//   },
//   {
//     year: '2025',
//     revenueGrowth: 9,
//     cogsGrowth: 7
//   }
// ];


const revenueGrowthData = [
  {
    year: '-',
    revenueGrowth: 0,
    cogsGrowth: 0
  },
  {
    year: '-',
    revenueGrowth: 0,
    cogsGrowth: 0
  },
  {
    year: '-',
    revenueGrowth: 9,
    cogsGrowth: 0
  }
];

const RevenueGrowthChart = () => {
  
  const revenueGrowthData = useRevenueGrowthStore((state) => state.revenueGrowthData);

  return (
    <div className="mx-4 mt-6"> {/* Added horizontal margin */}
      <div className="card p-4">
        <h5 className="fw-bold mb-3">Revenue Growth % Vs Cost Of Goods Growth % (3 Years)</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={revenueGrowthData}
            margin={{ top: 20, right: 30, left: 30, bottom: 10 }} // Optional: adjust internal chart padding too
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis unit="%" />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenueGrowth" name="Revenue Growth %" fill="#ffb300" />
            <Bar dataKey="cogsGrowth" name="COGS Growth %" fill="#f4511e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueGrowthChart;

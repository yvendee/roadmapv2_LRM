// frontend\src\components\5.growth-command-center\3.RevenueGrowthChart\RevenueGrowthChart.jsx

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'; // npm install recharts

const data = [
  {
    year: '2023',
    revenueGrowth: 5,
    cogsGrowth: 3
  },
  {
    year: '2024',
    revenueGrowth: 12,
    cogsGrowth: 10
  },
  {
    year: '2025',
    revenueGrowth: 9,
    cogsGrowth: 7
  }
];

const RevenueGrowthChart = () => {
  return (
    <div className="card p-4">
      <h5 className="fw-bold mb-3">Revenue Growth % Vs Cost Of Goods Growth % (3 Years)</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
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
  );
};

export default RevenueGrowthChart;

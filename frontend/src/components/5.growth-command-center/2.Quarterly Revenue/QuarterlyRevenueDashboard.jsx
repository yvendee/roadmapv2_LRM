import React, { useState } from 'react';
import './QuarterlyRevenueDashboard.css'; // Import the CSS

const QuarterlyRevenueDashboard = () => {
  const [year, setYear] = useState(2025);
  const revenueData = []; // Placeholder

  return (
    <div className="dashboard-wrapper always-black">
        {/* Header */}
        <div className="dashboard-header">
            <h2 className="dashboard-title">Quarterly Revenue Dashboard</h2>
            <div className="controls">
                <label htmlFor="yearSelect">Year:</label>
                <select id="yearSelect" value={year} onChange={(e) => setYear(e.target.value)}>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                </select>
                <button className="refresh-btn">🔄 Refresh</button>
                <button className="add-btn">+ Add Revenue</button>
            </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
        {/* Left - Revenue Chart */}
        <div className="card">
            <div className="card-title">Revenue Chart</div>
            <div className="card-body center-text">
            <p>No revenue data available for {year}.</p>
            <button className="add-btn small">Add Revenue Data</button>
            </div>
        </div>

        {/* Right - Revenue Data */}
        <div className="card">
            <div className="card-title">Revenue Data for {year}</div>
            <div className="card-body">
            <table className="revenue-table">
                <thead>
                <tr>
                    <th>Year ↓</th>
                    <th>Quarter</th>
                    <th>Actual Revenue</th>
                    <th>Revenue Goal</th>
                    <th>Performance</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {revenueData.length === 0 ? (
                    <tr>
                    <td colSpan="6" className="no-data">
                        No revenue data found for {year}.<br />
                        <a href="#">Add the first record</a>
                    </td>
                    </tr>
                ) : (
                    revenueData.map((item, i) => (
                    <tr key={i}>
                        <td>{item.year}</td>
                        <td>{item.quarter}</td>
                        <td>{item.actual}</td>
                        <td>{item.goal}</td>
                        <td>{item.performance}</td>
                        <td>...</td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    </div>
  );
};

export default QuarterlyRevenueDashboard;

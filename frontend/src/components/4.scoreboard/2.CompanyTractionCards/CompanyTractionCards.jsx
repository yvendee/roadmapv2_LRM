// frontend/src/components/4.scoreboard/2.CompanyTractionCards/CompanyTractionCards.jsx

import React from 'react';
import useCompanyTractionStore, { initialCompanyTraction } from '../../../store/left-lower-content/4.scoreboard/2.companyTractionCardsStore';
import './CompanyTractionCards.css';

// const quarters = [
//   { label: 'Q1', percent: 100 },
//   { label: 'Q2', percent: 92.86 },
//   { label: 'Q3', percent: 5 },
//   { label: 'Q4', percent: 0 },
// ];

const getColor = (percent) => {
  if (percent === 100) return '#4caf50';
  if (percent >= 75) return '#4caf50';
  if (percent > 0) return '#f44336';
  return '#ccc';
};

const CompanyTractionCards = () => {

  const quarters = useCompanyTractionStore((state) => state.quarters);

  return (
    <div className="traction-container">
      {quarters.map((q, idx) => (
        <div className="traction-card always-black" key={idx}>
          <div className="traction-title">Company Traction - Quarter {idx + 1}</div>
          <div className="traction-chart">
            <svg width="80" height="80" viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="2"
              />
              <path
                className="circle"
                stroke={getColor(q.percent)}
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="2"
                strokeDasharray={`${q.percent}, 100`}
              />
              <text x="18" y="20.35" className="percentage" textAnchor="middle">
                {q.percent}%
              </text>
            </svg>
          </div>
          <div className="traction-caption">
            <span className="check-icon">✔</span> {q.label} - Strategic Goals Achieved
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompanyTractionCards;

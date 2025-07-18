// frontend\src\store\left-lower-content\4.scoreboard\1.annualPrioritiesScoreboardStore.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import useAnnualPrioritiesStore, { initialAnnualPriorities } from '../../../store/left-lower-content/4.scoreboard/1.annualPrioritiesScoreboardStore';
import './AnnualPrioritiesScoreboard.css';

const AnnualPrioritiesScoreboard = () => {

  const average = useAnnualPrioritiesStore((state) => state.average);
  const members = useAnnualPrioritiesStore((state) => state.members);

  // 🔁 Determine color based on average
  const circleColor = average < 75 ? '#f44336' : '#4caf50'; // red or green

  return (
    <div className="scoreboard-card">
      <div className="scoreboard-header always-black">
        <h6>Annual Priorities Scoreboard</h6>
      </div>

      <div className="scoreboard-body centered">
        {/* Left Panel */}
        <div className="scoreboard-left">
          <svg width="100" height="100" viewBox="0 0 36 36" className="circular-chart">
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
              // stroke="#f44336"
              stroke={circleColor} // ✅ Dynamic color
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="2"
              strokeDasharray={`${average}, 100`}
            />
            <text x="18" y="20.35" className="percentage" textAnchor="middle">
              {average.toFixed(2)}%
            </text>
          </svg>
        </div>

        {/* Right Panel */}
        <div className="scoreboard-right always-black">
          {members.map((member, idx) => (
            <div key={idx} className="member-row">
              <div className="member-info">
                <FontAwesomeIcon icon={faUserTie} className="icon" />
                <span>{member.name || '\u00A0'}</span>
              </div>
              <span>{member.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnualPrioritiesScoreboard;

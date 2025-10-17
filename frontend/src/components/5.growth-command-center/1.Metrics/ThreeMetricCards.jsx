import React, { useEffect, useState } from 'react';
import useMetricStore, { initialMetrics } from '../../../store/left-lower-content/5.growth-command-center/1.metricsStore';
import useLoginStore from '../../../store/loginStore';
import './ThreeMetricCards.css';

const SEMI_CIRCLE_LENGTH = 50.24;

const ThreeMetricCards = () => {
  const loggedUser = useLoginStore((state) => state.user);
  const isSuperAdmin = loggedUser?.role === 'superadmin';

  const metrics = useMetricStore((state) => state.metrics);
  const updateMetric = useMetricStore((state) => state.updateMetric);
  const setMetrics = useMetricStore((state) => state.setMetrics);

  const [viewMode, setViewMode] = useState('Monthly');
  const [editedMetrics, setEditedMetrics] = useState(metrics);

  useEffect(() => {
    setEditedMetrics(metrics);
  }, [metrics]);

  const handleFieldChange = (metricIndex, fieldPath, newValue) => {
    setEditedMetrics((prev) => {
      const newMetrics = prev.map((m, idx) => {
        if (idx !== metricIndex) return m;
        const clone = { ...m };
        const pathParts = fieldPath.split('.');
        let cursor = clone;
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          cursor[part] = Array.isArray(cursor[part])
            ? [...cursor[part]]
            : { ...(cursor[part] || {}) };
          cursor = cursor[part];
        }
        const lastPart = pathParts[pathParts.length - 1];
        cursor[lastPart] = newValue;
        return clone;
      });
      console.log('📝 On edit, local editedMetrics:', newMetrics);
      return newMetrics;
    });
  };

  const handleSave = () => {
    console.log('✅ Save clicked, local edited:', editedMetrics);
    setMetrics(editedMetrics);
  };

  const handleDiscard = () => {
    console.log('❌ Discard clicked, store value (truth):', metrics);
    setEditedMetrics(metrics);
  };

  return (
    <div className="metrics-container always-black">
      {isSuperAdmin && (
        <div className="metrics-actions" style={{ textAlign: 'right', marginBottom: '8px' }}>
          <button className="pure-green-btn" onClick={handleSave}>
            Save Changes
          </button>
          <button className="pure-red-btn ml-2" onClick={handleDiscard}>
            Discard
          </button>
        </div>
      )}

      {editedMetrics.map((metric, idx) => (
        <div className="metric-card" key={idx}>
          <div className="metric-header">{metric.title}</div>

          <svg width="100" height="60" viewBox="0 0 36 18" className="semi-circle">
            <path d="M2,18 A16,16 0 0,1 34,18" fill="none" stroke="#ccc" strokeWidth="3" />
            <path
              d="M2,18 A16,16 0 0,1 34,18"
              fill="none"
              stroke="green"
              strokeWidth="3"
              strokeDasharray={SEMI_CIRCLE_LENGTH}
              strokeDashoffset={(1 - metric.percent / 100) * SEMI_CIRCLE_LENGTH}
              strokeLinecap="round"
            />
            <text x="18" y="14" textAnchor="middle" fontSize="6" fill="#333">
              {metric.percent}%
            </text>
          </svg>

          <div className="metric-inputs">
            <label>Annual Goal</label>
            {isSuperAdmin ? (
              <input
                type="number"
                value={metric.annualGoal}
                onChange={(e) => {
                  const v = Number(e.target.value) || 0;
                  const newPercent = v > 0 ? Math.round((metric.current / v) * 100) : 0;
                  handleFieldChange(idx, 'annualGoal', v);
                  handleFieldChange(idx, 'percent', newPercent);
                }}
              />
            ) : (
              <span>{metric.annualGoal}</span>
            )}

            <label>Current</label>
            {isSuperAdmin ? (
              <input
                type="number"
                value={metric.current}
                onChange={(e) => {
                  const v = Number(e.target.value) || 0;
                  const newPercent = metric.annualGoal > 0 ? Math.round((v / metric.annualGoal) * 100) : 0;
                  handleFieldChange(idx, 'current', v);
                  handleFieldChange(idx, 'percent', newPercent);
                }}
              />
            ) : (
              <span>{metric.current}</span>
            )}
          </div>

          <div className="metric-table-container">
            <div className="table-header">
              <span>{metric.title}</span>
              <select onChange={(e) => setViewMode(e.target.value)} value={viewMode}>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>

            <table className="metric-table">
              <thead>
                <tr>
                  <th>{viewMode === 'Monthly' ? 'Month' : 'Quarter'}</th>
                  <th>Current</th>
                  <th>Goal</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {(viewMode === 'Monthly' ? metric.monthlyData : metric.quarterlyData).map((data, i) => (
                  <tr key={i}>
                    <td>{viewMode === 'Monthly' ? data.month : data.quarter}</td>

                    <td>
                      {isSuperAdmin ? (
                        <input
                          type="number"
                          value={data.current}
                          onChange={(e) => {
                            const v = Number(e.target.value) || 0;
                            const path = viewMode === 'Monthly' ? `monthlyData.${i}.current` : `quarterlyData.${i}.current`;
                            handleFieldChange(idx, path, v);
                            const goalVal = data.goal;
                            const newProg = goalVal > 0 ? Math.round((v / goalVal) * 100) : 0;
                            const progressPath = viewMode === 'Monthly' ? `monthlyData.${i}.progress` : `quarterlyData.${i}.progress`;
                            handleFieldChange(idx, progressPath, newProg);
                          }}
                        />
                      ) : (
                        data.current
                      )}
                    </td>

                    <td>
                      {isSuperAdmin ? (
                        <input
                          type="number"
                          value={data.goal}
                          onChange={(e) => {
                            const v = Number(e.target.value) || 0;
                            const path = viewMode === 'Monthly' ? `monthlyData.${i}.goal` : `quarterlyData.${i}.goal`;
                            handleFieldChange(idx, path, v);
                            const currVal = data.current;
                            const newProg = v > 0 ? Math.round((currVal / v) * 100) : 0;
                            const progressPath = viewMode === 'Monthly' ? `monthlyData.${i}.progress` : `quarterlyData.${i}.progress`;
                            handleFieldChange(idx, progressPath, newProg);
                          }}
                        />
                      ) : (
                        data.goal
                      )}
                    </td>

                    <td>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${Math.min(data.progress, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreeMetricCards;

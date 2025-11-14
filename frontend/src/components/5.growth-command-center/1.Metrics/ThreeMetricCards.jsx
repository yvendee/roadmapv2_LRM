// frontend\src\components\5.growth-command-center\1.Metrics\ThreeMetricCards.jsx

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import useMetricStore from '../../../store/left-lower-content/5.growth-command-center/1.metricsStore';
import useLoginStore from '../../../store/loginStore';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './ThreeMetricCards.css';

const SEMI_CIRCLE_LENGTH = 50.24;

const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const ThreeMetricCards = () => {
  const organization = useLayoutSettingsStore((state) => state.organization);
  const loggedUser = useLoginStore((state) => state.user);
  const isSuperAdmin = loggedUser?.role === 'superadmin';

  
  const canEdit =
    loggedUser?.role === 'superadmin' ||
    ['Admin', 'CEO', 'Leadership', 'Internal', 'Department Head'].includes(loggedUser?.position);

  const metrics = useMetricStore((state) => state.metrics);
  const updateMetric = useMetricStore((state) => state.updateMetric);
  const setMetrics = useMetricStore((state) => state.setMetrics);

  const [viewMode, setViewMode] = useState('Monthly');
  const [editedMetrics, setEditedMetrics] = useState(metrics);
  const [hasEdits, setHasEdits] = useState(false);

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);

  useEffect(() => {
    setEditedMetrics(metrics);
    setHasEdits(false);
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
      setHasEdits(!deepEqual(newMetrics, metrics));
      ENABLE_CONSOLE_LOGS && console.log('📝 On edit, local editedMetrics:', newMetrics);
      return newMetrics;
    });
  };

  // const handleSave = () => {
  //   console.log('✅ Save clicked, local editedMetrics:', editedMetrics);
  //   setMetrics(editedMetrics);
  //   setHasEdits(false);
  // };

  const handleSave = async () => {
    ENABLE_CONSOLE_LOGS && console.log('✅ Save clicked, local editedMetrics:', editedMetrics);
    setMetrics(editedMetrics);
    setHasEdits(false);
    setLoadingSave(true);

    setTimeout( async () => {
      try {
        // Step 1: Get CSRF token
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
        const { csrf_token } = await csrfRes.json();
    
        // Step 2: Send update request
        const response = await fetch(`${API_URL}/v1/growth-command-center/gcc-metrics/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
          credentials: 'include',
          body: JSON.stringify({
            organizationName: organization,
            metricsData: editedMetrics,
          }),
        });
    
        const data = await response.json();
        ENABLE_CONSOLE_LOGS && console.log('✅ Metrics update response:', data);
        setLoadingSave(false);
    
        if (!response.ok) {
          console.error('❌ Update failed:', data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('❌ Request error:', error);
      }

    }, 1000);


  };
  

  const handleDiscard = () => {
    setLoadingDischarge(true);
    setTimeout(() => {
      ENABLE_CONSOLE_LOGS && console.log('❌ Discard clicked, truth from store:', metrics);
      setEditedMetrics(metrics);
      setHasEdits(false);
      setLoadingDischarge(false);
    }, 1000);
  };

  return (
    <div className="metrics-container always-black">
      {/* {isSuperAdmin && hasEdits && ( */}
      {canEdit && hasEdits && (
        <div className="metrics-actions" style={{ textAlign: 'right', marginBottom: '8px', width: '100%' }}>
          <button className="pure-green-btn" onClick={handleSave}>
            {loadingSave ? (
              <div className="loader-bars">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="mr-1" />
                  Save Changes
                </>
            )}
          </button>
          <button className="pure-red-btn ml-2" onClick={handleDiscard}>
            {loadingDischarge ? (
              <div className="loader-bars">
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              <>
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
                Discard
              </>
            )}
          </button>
        </div>
      )}

      {editedMetrics.map((metric, idx) => (
        <div className="metric-card" key={idx}>
          {/* <div className="metric-header">{metric.title}</div> */}
          {canEdit ? (
            <input
              className="mmetric-header"
              type="text"
              value={metric.title}
              onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
            />
          ) : (
            <div className="metric-header">{metric.title}</div>
          )}

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
            <input
              type="number"
              // disabled={!isSuperAdmin}
              disabled={!canEdit}
              value={metric.annualGoal}
              onChange={(e) => {
                const newAnnualGoal = Number(e.target.value) || 0;
                const percent =
                  newAnnualGoal > 0
                    ? Math.round((metric.current / newAnnualGoal) * 100)
                    : 0;
                handleFieldChange(idx, 'annualGoal', newAnnualGoal);
                handleFieldChange(idx, 'percent', percent);
              }}
            />

            <label>Current</label>
            <input
              type="number"
              // disabled={!isSuperAdmin}
              disabled={!canEdit}
              value={metric.current}
              onChange={(e) => {
                const newCurrent = Number(e.target.value) || 0;
                const percent =
                  metric.annualGoal > 0
                    ? Math.round((newCurrent / metric.annualGoal) * 100)
                    : 0;
                handleFieldChange(idx, 'current', newCurrent);
                handleFieldChange(idx, 'percent', percent);
              }}
            />
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
                      {/* {isSuperAdmin ? ( */}
                      {canEdit ? (
                        <input
                          type="number"
                          style={{ width: '80px' }} // 👈 max 6 digits, fixed width
                          value={data.current}
                          onChange={(e) => {
                            const updated = Number(e.target.value) || 0;
                            const newProgress =
                              data.goal > 0 ? Math.round((updated / data.goal) * 100) : 0;
                            const fieldPath = `${viewMode === 'Monthly' ? 'monthlyData' : 'quarterlyData'}.${i}.current`;
                            handleFieldChange(idx, fieldPath, updated);
                            handleFieldChange(idx, `${viewMode === 'Monthly' ? 'monthlyData' : 'quarterlyData'}.${i}.progress`, newProgress);
                          }}
                        />
                      ) : (
                        data.current
                      )}
                    </td>
                    <td>
                      {/* {isSuperAdmin ? ( */}
                      {canEdit ? (
                        <input
                          type="number"
                          style={{ width: '80px' }} // 👈 max 6 digits, fixed width
                          value={data.goal}
                          onChange={(e) => {
                            const updated = Number(e.target.value) || 0;
                            const newProgress =
                              updated > 0 ? Math.round((data.current / updated) * 100) : 0;
                            const fieldPath = `${viewMode === 'Monthly' ? 'monthlyData' : 'quarterlyData'}.${i}.goal`;
                            handleFieldChange(idx, fieldPath, updated);
                            handleFieldChange(idx, `${viewMode === 'Monthly' ? 'monthlyData' : 'quarterlyData'}.${i}.progress`, newProgress);
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

// frontend\src\components\7A.thirteen-week-sprint\1.WeeklySprintTracker\WeeklySprintTracker.jsx

import { useEffect, useRef, useState } from 'react';
import useLoginStore from '../../../store/loginStore';
import useWeeklySprintStore from '../../../store/left-lower-content/7A.thirteen-week-sprint/1.WeeklySprintTrackerStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './WeeklySprintTracker.css';

const WeeklySprintTracker = () => {
  const loggedUser = useLoginStore(state => state.user);
  const organization = useLayoutSettingsStore((state) => state.organization);
  const weeklySprints = useWeeklySprintStore(state => state.weeklySprints);
  const setWeeklySprints = useWeeklySprintStore(state => state.setWeeklySprints);
  const addKeyFocusEntry = useWeeklySprintStore(state => state.addKeyFocusEntry);

  const [isEdited, setIsEdited] = useState(false);
  const [editingCell, setEditingCell] = useState({ week: null, field: null, index: null });
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const localStorageKey = 'weeklySprintTrackerData';
  const initialRender = useRef(true);

  // ✅ Determine edit permission
  const canEdit =
    loggedUser?.role === 'superadmin' ||
    ['Admin', 'CEO', 'Leadership', 'Internal', 'Department Head'].includes(loggedUser?.position);

  // Load from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(localStorageKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setWeeklySprints(parsed);
        setIsEdited(true);
      } catch (err) {
        console.error('Invalid localStorage data for WeeklySprintTracker');
      }
    }
  }, []);

  const handleEdit = (newData) => {
    setWeeklySprints(newData);
    localStorage.setItem(localStorageKey, JSON.stringify(newData));
    setIsEdited(true);
  };

  const handleDiscardChanges = () => {
    setLoadingDischarge(true);
    setTimeout(() => {
      const { baselineWeeklySprints } = useWeeklySprintStore.getState();
      ENABLE_CONSOLE_LOGS && console.log('💾 Restoring baselineWeeklySprints:', baselineWeeklySprints);
      setWeeklySprints(baselineWeeklySprints);
      localStorage.removeItem(localStorageKey);
      setIsEdited(false);
      setLoadingDischarge(false);
    }, 1000);
  };

  const handleSaveChanges = async () => {
    setLoadingSave(true);

    setTimeout(async () => {
      setLoadingSave(false);
      const savedData = JSON.parse(localStorage.getItem(localStorageKey));
      ENABLE_CONSOLE_LOGS && console.log('📤 Updated WeeklySprintTracker from localStorage:', savedData);
      localStorage.removeItem(localStorageKey);
      setIsEdited(false);

      try {
        const csrfRes = await fetch(`${API_URL}/csrf-token`, { credentials: 'include' });
        const { csrf_token } = await csrfRes.json();

        const response = await fetch(`${API_URL}/v1/thirteen-week-sprint/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
          credentials: 'include',
          body: JSON.stringify({
            organization,
            thirteenWeekSprintData: savedData,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          ENABLE_CONSOLE_LOGS && console.log('✅ Thirteen Week Sprint Data Updated:', result);
        } else {
          console.error('❌ Failed to update thirteenWeekSprintData:', result.message);
        }
      } catch (error) {
        console.error('❌ Network error while updating thirteenWeekSprintData:', error);
      }
    }, 1000);
  };

  return (
    <div className="weekly-sprint-tracker">
      {isEdited && canEdit && (
        <div className="action-buttons">
          <button className="pure-green-btn" onClick={handleSaveChanges}>
            {loadingSave ? (
              <div className="loader-bars">
                <div></div><div></div><div></div>
              </div>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="mr-1" /> Save Changes
              </>
            )}
          </button>
          <button className="pure-red-btn" onClick={handleDiscardChanges}>
            {loadingDischarge ? (
              <div className="loader-bars">
                <div></div><div></div><div></div>
              </div>
            ) : (
              <>
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" /> Discard Changes
              </>
            )}
          </button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Week</th>
            <th>Key Focus / Milestone</th>
            <th>Top 1–3 Tasks</th>
            <th>Progress (%)</th>
            <th>Blockers / Issues</th>
            <th>Coach Notes</th>
          </tr>
        </thead>
        <tbody>
          {weeklySprints.map(ws => (
            <tr key={ws.week}>
              <td>{ws.week}</td>

              {/* Key Focus / Milestone */}
              <td>
                <div className="multi-cell-container">
                  {ws.keyFocus.map((val, idx) => {
                    const isEditing =
                      editingCell.week === ws.week &&
                      editingCell.field === 'keyFocus' &&
                      editingCell.index === idx;

                    return (
                      <div
                        key={idx}
                        className="multi-cell"
                        onClick={() => {
                          if (canEdit && val !== '-') {
                            setEditingCell({ week: ws.week, field: 'keyFocus', index: idx });
                          }
                        }}
                      >
                        {val === '-' ? (
                          <div className="skeleton" />
                        ) : isEditing ? (
                          <textarea
                            autoFocus
                            defaultValue={val}
                            onBlur={(e) => {
                              const updated = weeklySprints.map((w) =>
                                w.week === ws.week
                                  ? {
                                      ...w,
                                      keyFocus: w.keyFocus.map((kf, i) => (i === idx ? e.target.value : kf)),
                                    }
                                  : w
                              );
                              handleEdit(updated);
                              setEditingCell({ week: null, field: null, index: null });
                            }}
                          />
                        ) : (
                          val
                        )}
                      </div>
                    );
                  })}

                  {canEdit && ws.keyFocus.every(val => val !== '-') && (
                    <button onClick={() => addKeyFocusEntry(ws.week)}>+ Add</button>
                  )}
                </div>
              </td>

              {/* Top Tasks */}
              <td>
                {ws.topTasks.map((task, idx) => (
                  <select
                    key={idx}
                    disabled={!canEdit}
                    value={task}
                    onChange={(e) => {
                      const updated = weeklySprints.map((w) =>
                        w.week === ws.week
                          ? {
                              ...w,
                              topTasks: w.topTasks.map((tt, i) => (i === idx ? e.target.value : tt)),
                            }
                          : w
                      );
                      handleEdit(updated);
                    }}
                  >
                    <option value="-">-</option>
                    {ws.keyFocus
                      .filter(val => val !== '-' && (val ?? '').trim() !== '')
                      .map((keyFocusVal, optionIdx) => (
                        <option key={optionIdx} value={keyFocusVal}>
                          {keyFocusVal}
                        </option>
                      ))}
                  </select>
                ))}
              </td>

              {/* Progress */}
              <td>
                <div className="multi-cell-container">
                  {ws.progress.map((val, idx) => (
                    <div
                      key={idx}
                      className="multi-cell"
                      onClick={() => {
                        if (canEdit && val !== '-') {
                          setEditingCell({ week: ws.week, field: 'progress', index: idx });
                        }
                      }}
                    >
                      {val === '-' ? (
                        <div className="skeleton" />
                      ) : editingCell.week === ws.week &&
                        editingCell.field === 'progress' &&
                        editingCell.index === idx ? (
                        <input
                          type="text"
                          defaultValue={val.replace('%', '')}
                          onBlur={(e) => {
                            const valNum = parseFloat(e.target.value) || 0;
                            const updated = weeklySprints.map((w) =>
                              w.week === ws.week
                                ? {
                                    ...w,
                                    progress: w.progress.map((p, i) =>
                                      i === idx ? `${valNum.toFixed(2)}%` : p
                                    ),
                                  }
                                : w
                            );
                            handleEdit(updated);
                            setEditingCell({ week: null, field: null, index: null });
                          }}
                        />
                      ) : (
                        val
                      )}
                    </div>
                  ))}
                </div>
              </td>

              {/* Blockers */}
              <td>
                <div className="multi-cell-container">
                  {ws.blockers.map((val, idx) => (
                    <div
                      key={idx}
                      className="multi-cell"
                      onClick={() => {
                        if (canEdit && val !== '-') {
                          setEditingCell({ week: ws.week, field: 'blockers', index: idx });
                        }
                      }}
                    >
                      {val === '-' ? (
                        <div className="skeleton" />
                      ) : editingCell.week === ws.week &&
                        editingCell.field === 'blockers' &&
                        editingCell.index === idx ? (
                        <textarea
                          autoFocus
                          defaultValue={val}
                          onBlur={(e) => {
                            const updated = weeklySprints.map((w) =>
                              w.week === ws.week
                                ? {
                                    ...w,
                                    blockers: w.blockers.map((b, i) =>
                                      i === idx ? e.target.value : b
                                    ),
                                  }
                                : w
                            );
                            handleEdit(updated);
                            setEditingCell({ week: null, field: null, index: null });
                          }}
                        />
                      ) : (
                        val
                      )}
                    </div>
                  ))}
                </div>
              </td>

              {/* Coach Notes */}
              <td
                onClick={() => {
                  if (canEdit && ws.coachNotes !== '-') {
                    setEditingCell({ week: ws.week, field: 'coachNotes', index: null });
                  }
                }}
              >
                {ws.coachNotes === '-' ? (
                  <div className="skeleton" />
                ) : editingCell.week === ws.week && editingCell.field === 'coachNotes' ? (
                  <textarea
                    autoFocus
                    defaultValue={ws.coachNotes}
                    onBlur={(e) => {
                      const updated = weeklySprints.map((w) =>
                        w.week === ws.week ? { ...w, coachNotes: e.target.value } : w
                      );
                      handleEdit(updated);
                      setEditingCell({ week: null, field: null, index: null });
                    }}
                  />
                ) : (
                  ws.coachNotes
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklySprintTracker;

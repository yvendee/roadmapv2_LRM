// frontend\src\components\7A.thirteen-week-sprint\1.WeeklySprintTracker\WeeklySprintTracker.jsx

import React, { useState } from 'react';
import useLoginStore from '../../../store/loginStore';
import useWeeklySprintStore from '../../../store/left-lower-content/7A.thirteen-week-sprint/1.WeeklySprintTrackerStore';
import './WeeklySprintTracker.css';

const WeeklySprintTracker = () => {
  const loggedUser = useLoginStore(state => state.user);
  const weeklySprints = useWeeklySprintStore(state => state.weeklySprints);
  const setWeeklySprints = useWeeklySprintStore(state => state.setWeeklySprints);
  const updateKeyFocus = useWeeklySprintStore(state => state.updateKeyFocus);
  const updateProgress = useWeeklySprintStore(state => state.updateProgress);
  const updateBlockers = useWeeklySprintStore(state => state.updateBlockers);
  const updateCoachNotes = useWeeklySprintStore(state => state.updateCoachNotes);
  const addKeyFocusEntry = useWeeklySprintStore(state => state.addKeyFocusEntry);

  const [editingCell, setEditingCell] = useState({ week: null, field: null, index: null });

  return (
    <div className="weekly-sprint-tracker">
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
                        const isEditing = editingCell.week === ws.week &&
                                            editingCell.field === 'keyFocus' &&
                                            editingCell.index === idx;

                        const isEditable = loggedUser?.role === 'superadmin' && val !== '-';

                        return (
                            <div
                            key={idx}
                            className="multi-cell"
                            onClick={() => {
                                if (isEditable) {
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
                                onBlur={e => {
                                    updateKeyFocus(ws.week, idx, e.target.value);
                                    setEditingCell({ week: null, field: null, index: null });
                                }}
                                />
                            ) : (
                                val
                            )}
                            </div>
                        );
                        })}

                        {/* Hide the Add button if any value is "-" */}
                        {loggedUser?.role === 'superadmin' && ws.keyFocus.every(val => val !== '-') && (
                        <button onClick={() => addKeyFocusEntry(ws.week)}>+ Add</button>
                        )}
                    </div>
                </td>

                {/* Top Tasks Dropdowns */}
                <td>
                    {ws.topTasks.map((task, idx) => (
                        <select
                        key={idx}
                        disabled={loggedUser?.role !== 'superadmin'}
                        value={task}
                        onChange={e => {
                            const newTasks = [...ws.topTasks];
                            newTasks[idx] = e.target.value;
                            setWeeklySprints(
                            weeklySprints.map(w =>
                                w.week === ws.week ? { ...w, topTasks: newTasks } : w
                            )
                            );
                        }}
                        >
                        <option value="-">-</option>
                        {ws.keyFocus
                            .filter(val => val !== '-' && val.trim() !== '') // filter out "-" or empty
                            .map((keyFocusVal, optionIdx) => (
                            <option key={optionIdx} value={keyFocusVal}>
                                {keyFocusVal}
                            </option>
                            ))}
                        </select>
                    ))}
                </td>

                {/* <td>
                {ws.topTasks.map((task, idx) => (
                    <select
                    key={idx}
                    disabled={loggedUser?.role !== 'superadmin'}
                    value={task}
                    onChange={e => {
                        const newTasks = [...ws.topTasks];
                        newTasks[idx] = e.target.value;
                        setWeeklySprints(weeklySprints.map(w =>
                        w.week === ws.week ? { ...w, topTasks: newTasks } : w
                        ));
                    }}
                    >
                    <option value="-">-</option>
                    <option value="Task1">Task1</option>
                    <option value="Task2">Task2</option>
                    <option value="Task3">Task3</option>
                    </select>
                ))}
                </td> */}

                {/* Progress (%) */}
                <td>
                <div className="multi-cell-container">
                    {ws.progress.map((val, idx) => (
                    <div
                        key={idx}
                        className="multi-cell"
                        onClick={() => {
                        if (loggedUser?.role === 'superadmin' && val !== '-') {
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
                            onBlur={e => {
                            const valNum = parseFloat(e.target.value) || 0;
                            updateProgress(ws.week, idx, `${valNum.toFixed(2)}%`);
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

                {/* Blockers / Issues */}
                <td>
                <div className="multi-cell-container">
                    {ws.blockers.map((val, idx) => (
                    <div
                        key={idx}
                        className="multi-cell"
                        onClick={() => {
                        if (loggedUser?.role === 'superadmin' && val !== '-') {
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
                            onBlur={e => {
                            updateBlockers(ws.week, idx, e.target.value);
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
                    if (loggedUser?.role === 'superadmin' && ws.coachNotes !== '-') {
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
                    onBlur={e => {
                        updateCoachNotes(ws.week, e.target.value);
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

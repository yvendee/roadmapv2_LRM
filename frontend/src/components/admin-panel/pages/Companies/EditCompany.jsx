// frontend\src\components\admin-panel\pages\Companies\EditCompany.jsx
import React, { useState } from 'react';
import './EditCompany.css';
import { useEditCompanyStore } from '../../../../store/admin-panel/companies/editCompanyStore';
import ToastNotification from '../../../../components/toast-notification/ToastNotification'; 
import API_URL, { ENABLE_CONSOLE_LOGS } from '../../../../configs/config';

const allMonths = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'November', 'December',
];

// Toast State
const [toast, setToast] = useState({
    message: '',
    status: '', // 'success' or 'error'
    isVisible: false,
  });

const quartersList = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function EditCompany() {
  const name = useEditCompanyStore((state) => state.name);
  const quarters = useEditCompanyStore((state) => state.quarters);
  const setName = useEditCompanyStore((state) => state.setName);
  const setQuarters = useEditCompanyStore((state) => state.setQuarters);
  const [isSaving, setIsSaving] = useState(false);


  const isLoading = !name?.trim(); // loading state if name is empty/null

  const getAvailableMonths = () => {
    const selectedMonths = Object.values(quarters).flat();
    return allMonths.filter((month) => !selectedMonths.includes(month));
  };

  const handleMonthAdd = (quarter, month) => {
    if (!month) return;
    const updated = {
      ...quarters,
      [quarter]: [...quarters[quarter], month],
    };
    setQuarters(updated);
  };

  const handleMonthRemove = (quarter, month) => {
    const updated = {
      ...quarters,
      [quarter]: quarters[quarter].filter((m) => m !== month),
    };
    setQuarters(updated);
  };

//   const handleSaveChanges = () => {
//     console.log('✅ Save Changes clicked');
//     console.log('Company Name:', name);
//     console.log('Quarters:', quarters);
//   };


    const handleSaveChanges = async () => {
        const name = useEditCompanyStore.getState().name;
        const quarters = useEditCompanyStore.getState().quarters;

        ENABLE_CONSOLE_LOGS && console.log('✅ Save Changes clicked');
        ENABLE_CONSOLE_LOGS && console.log('Company Name:', name);
        ENABLE_CONSOLE_LOGS && console.log('Quarters:', quarters);

        setIsSaving(true); // Show spinner

        try {
            // Fetch CSRF token
            const csrfRes = await fetch(`${API_URL}/csrf-token`, {
            credentials: 'include',
            });
            if (!csrfRes.ok) throw new Error('Failed to fetch CSRF token');
            const { csrf_token } = await csrfRes.json();

            // Send update request
            const res = await fetch(`${API_URL}/v1/admin-panel/quarters/update`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf_token,
                Accept: 'application/json',
            },
            body: JSON.stringify({
                organizationName: name,
                quarters: quarters,
            }),
            });

            const data = await res.json();
            if (!res.ok) {
            throw new Error(data.error || 'Failed to update quarters');
            }

            ENABLE_CONSOLE_LOGS && console.log('✅ Update response:', data);

            // ✅ Show success toast
            setToast({
                message: 'Changes saved successfully!',
                status: 'success',
                isVisible: true,
            });

        } catch (error) {
            console.error('❌ Error saving changes:', error.message);

            // ❌ Show error toast
            setToast({
                message: `Failed to save changes: ${error.message}`,
                status: 'error',
                isVisible: true,
            });

        } finally {
            setTimeout(() => {
            setIsSaving(false); // Hide spinner after 3 seconds
            }, 3000);
        }
    };


  const handleDiscard = () => {
    console.log('❌ Discard clicked');
  };

  return (
    <div className="edit-company-container">
      {/* Name Input */}
      <div className="form-row">
        <div className="form-group">
          <label>
            Name<span className="required">*</span>
          </label>
          {isLoading ? (
            <div className="skeleton h-9 rounded w-full" />
          ) : (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          )}
        </div>
      </div>

      {/* Quarters Section */}
      <div className="quarters-container">
        <h3>Quarters</h3>
        <div className="quarters-grid">
          {quartersList.map((q) => (
            <div key={q} className="quarter-box">
              <div className="quarter-header">{q}</div>

              <div className="selected-months">
                {quarters[q].map((month) => (
                  <div key={month} className="month-pill">
                    {month}
                    <span onClick={() => handleMonthRemove(q, month)}>&times;</span>
                  </div>
                ))}
              </div>

              {isLoading ? (
                <div className="skeleton h-10 w-full rounded" />
              ) : (
                <select
                  onChange={(e) => handleMonthAdd(q, e.target.value)}
                  value=""
                  className="month-dropdown"
                >
                  <option value="">Select a month</option>
                  {getAvailableMonths().map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        {isLoading ? (
          <>
            <div className="skeleton h-10 w-40 rounded mr-2" />
            <div className="skeleton h-10 w-32 rounded" />
          </>
        ) : (
          <>
            {/* <button className="save-btn" onClick={handleSaveChanges}>
              Save Changes
            </button> */}

            <button className="save-btn" onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? (
                <div className="spinner"></div>
            ) : (
                'Save Changes'
            )}
            </button>


            {/* <button className="discard-btn" onClick={handleDiscard}>
              Discard
            </button> */}
          </>
        )}
      </div>

        {/* Toast Notification */}
        <ToastNotification
            message={toast.message}
            status={toast.status}
            isVisible={toast.isVisible}
            onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
        />
    </div>
  );
}

import React, { useState } from 'react';
import './EditUser.css';
import useUserStore from '../../../../store/admin-panel/users/userStore';
import ToastNotification from '../../../../components/toast-notification/ToastNotification';
import API_URL, { ENABLE_CONSOLE_LOGS } from '../../../../configs/config';

export default function EditUser() {
  const selectedUser = useUserStore((state) => state.selectedUser);
  const updateUser = useUserStore((state) => state.updateUser);

  const [name, setName] = useState(selectedUser?.name || '');
  const [email, setEmail] = useState(selectedUser?.email || '');
  const [company, setCompany] = useState(selectedUser?.company || '');
  const [emailVerifiedAt, setEmailVerifiedAt] = useState(selectedUser?.emailVerifiedAt || '');

  const [isSaving, setIsSaving] = useState(false);

  const [toast, setToast] = useState({
    message: '',
    status: '',
    isVisible: false,
  });

  const showToast = (message, status) => {
    setToast({ message, status, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };


  const handleSaveChanges = async () => {
    if (!name.trim() || !email.trim() || !company.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
  
    setIsSaving(true);
  
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      const res = await fetch(`${API_URL}/v1/admin-panel/users/update`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          u_id: selectedUser.u_id,  // send u_id instead of id
          name,
          email,
          company,
          emailVerifiedAt,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || 'Failed to update user.');
      }
  
      // Pass the full updated user object, including id, to updateUser so store updates correctly
      updateUser({
        id: selectedUser.id,
        u_id: selectedUser.u_id,
        name,
        email,
        company,
        emailVerifiedAt,
      });
  
      ENABLE_CONSOLE_LOGS && console.log('User updated:', data);
      showToast('User updated successfully!', 'success');
    } catch (error) {
      console.error('Save error:', error);
      showToast(`Error saving user: ${error.message}`, 'error');
    } finally {
      setTimeout(() => setIsSaving(false), 2000);
    }
  };
  
  if (!selectedUser) {
    return <div className="p-6">No user selected for editing.</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      {/* Form fields */}
      <div className="form-group mb-4">
        <label>
          Company<span className="required">*</span>
        </label>
        <input
          type="text"
          className="form-input"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="form-group mb-4">
        <label>
          Name<span className="required">*</span>
        </label>
        <input
          type="text"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group mb-4">
        <label>
          Email<span className="required">*</span>
        </label>
        <input
          type="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group mb-4">
        <label>Email Verified At</label>
        <input
          type="date"
          className="form-input"
          value={emailVerifiedAt}
          onChange={(e) => setEmailVerifiedAt(e.target.value)}
        />
      </div>

      <button
        className="save-btn"
        onClick={handleSaveChanges}
        disabled={isSaving}
      >
        {isSaving ? <div className="spinner"></div> : 'Save Changes'}
      </button>

      {toast.isVisible && (
        <ToastNotification
          message={toast.message}
          status={toast.status}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

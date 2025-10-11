// frontend/src/components/admin-panel/pages/Users/NewUser.jsx

import React, { useState } from 'react';
import './NewUser.css';
import useUserStore  from '../../../../store/admin-panel/users/userStore';
import API_URL, { ENABLE_CONSOLE_LOGS } from '../../../../configs/config';
import ToastNotification from '../../../../components/toast-notification/ToastNotification';
export default function NewUser({ onCancel }) {
  const { setUsers, users } = useUserStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [position, setPosition] = useState('');
  const [group, setGroup] = useState('');

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', status: '', isVisible: false });

  const showToast = (message, status) => {
    setToast({ message, status, isVisible: true });
  };
  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const validate = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name required';
    if (!lastName.trim()) newErrors.lastName = 'Last name required';
    if (!email.trim()) newErrors.email = 'Email required';
    if (!password) newErrors.password = 'Password required';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!organization) newErrors.organization = 'Organization required';
    if (!role) newErrors.role = 'Role required';
    if (!position) newErrors.position = 'Position required';
    if (!group) newErrors.group = 'Group required';
    return newErrors;
  };

  const handleCreate = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, { credentials: 'include' });
      const { csrf_token } = await csrfRes.json();

      const payload = {
        firstName,
        lastName,
        email,
        password,
        organization,
        role,
        position,
        group,
      };

      ENABLE_CONSOLE_LOGS && console.log('Creating user with payload:', payload);

      const res = await fetch(`${API_URL}/v1/admin-panel/users/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || 'Create user failed');
      }

      // Optionally: add the newly created user to the store
      setUsers([...users, data.user]);
      showToast('User created successfully!', 'success');

      // Reset form (or optionally call onCancel)
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setOrganization('');
      setRole('');
      setPosition('');
      setGroup('');
      setErrors({});
    } catch (error) {
      console.error('Create error:', error);
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="new-user-container p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="new-user-header mb-4">
        <div className="text-sm text-gray-500 mb-1">Maintenance &gt; Users &gt; New</div>
        <h2 className="text-2xl font-semibold">New User</h2>
      </div>

      <div className="new-user-form">
        <div className="row-two">
          <div className="form-group">
            <label>First Name<span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && <div className="error-text">{errors.firstName}</div>}
          </div>
          <div className="form-group">
            <label>Last Name<span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && <div className="error-text">{errors.lastName}</div>}
          </div>
        </div>

        <div className="row-two">
          <div className="form-group">
            <label>Email<span className="required">*</span></label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Password<span className="required">*</span></label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>
        </div>

        <div className="row-two">
          <div className="form-group">
            <label>Confirm Password<span className="required">*</span></label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
          </div>
          <div className="form-group">
            <label>Organization<span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
            {errors.organization && <div className="error-text">{errors.organization}</div>}
          </div>
        </div>

        <div className="row-two">
          <div className="form-group">
            <label>Role<span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            {errors.role && <div className="error-text">{errors.role}</div>}
          </div>
          <div className="form-group">
            <label>Position<span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            {errors.position && <div className="error-text">{errors.position}</div>}
          </div>
        </div>

        <div className="row-single">
          <div className="form-group">
            <label>Group<span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            />
            {errors.group && <div className="error-text">{errors.group}</div>}
          </div>
        </div>

        <div className="action-buttons mt-6">
          <button
            className="save-btn"
            onClick={handleCreate}
            disabled={isSaving}
          >
            {isSaving ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>

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

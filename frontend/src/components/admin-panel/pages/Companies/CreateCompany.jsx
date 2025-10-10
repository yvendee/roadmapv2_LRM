import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../../configs/config';
import ToastNotification from '../../../../components/toast-notification/ToastNotification';
import './CreateCompany.css';

export default function CreateCompany() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: '', isVisible: false, status: '' });

  const showToast = (message, status) => {
    setToast({ message, isVisible: true, status });
  };
  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const resetForm = () => {
    setName('');
    setFeedback({ type: '', message: '' });
    setErrors({});
  };

  const handleCreate = async () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Company name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFeedback({ type: '', message: '' });
      return;
    }

    setLoading(true);

    try {
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      if (!csrfRes.ok) throw new Error('Failed to fetch CSRF token');
      const { csrf_token } = await csrfRes.json();

      const body = { name };

      const response = await fetch(`${API_URL}/api/v1/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        showToast('Company has been created!', 'success');
        setFeedback({ type: 'success', message: 'Company has been created!' });
        resetForm();
        // Optionally navigate or refresh companies list
      } else {
        const msg = data.message || 'Failed to create company.';
        showToast(msg, 'error');
        setFeedback({ type: 'error', message: msg });
        if (data.errors) setErrors(data.errors);
      }
    } catch (err) {
      console.error('Create company error:', err);
      showToast('Server error. Please try again later.', 'error');
      setFeedback({ type: 'error', message: 'Server error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-company-container">
      <h2 className="create-company-title">Create Company</h2>

      <div className="create-company-form">
        <div className="create-company-floating-input">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="create-company-floating-input-field"
            placeholder=" "
            required
          />
          <label htmlFor="name">Company Name</label>
          {errors.name && <p className="create-company-error">{errors.name}</p>}
        </div>

        <div className="create-company-buttons">
          <button
            className="create-company-btn create-company-btn-green"
            onClick={handleCreate}
            disabled={loading}
          >
            Create
          </button>
          <button
            className="create-company-btn create-company-btn-red"
            onClick={() => navigate('/admin/companies')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>

        {feedback.message && (
          <div className={`create-company-feedback ${feedback.type}`}>
            {feedback.message}
          </div>
        )}
      </div>

      <ToastNotification
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        status={toast.status}
      />
    </div>
  );
}

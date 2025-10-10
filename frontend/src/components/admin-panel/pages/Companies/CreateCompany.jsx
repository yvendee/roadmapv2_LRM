import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../../configs/config';
import ToastNotification from '../../../../components/toast-notification/ToastNotification';
import './CreateCompany.css';

export default function CreateCompany({ onCancel, onSuccess }) {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [location, setLocation] = useState('');
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
    setIndustry('');
    setSize('');
    setLocation('');
    setFeedback({ type: '', message: '' });
    setErrors({});
  };

  const handleCreate = async () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Company name is required';
    // you can add other field validations similarly if needed

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

      const payload = { name, industry, size, location };

      const response = await fetch(`${API_URL}/api/v1/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        showToast('Company created successfully!', 'success');
        setFeedback({ type: 'success', message: 'Company created successfully!' });
        resetForm();
        if (onSuccess) {
          onSuccess(data); // callback to parent to refresh list
        }
      } else {
        const msg = data.message || 'Failed to create company.';
        showToast(msg, 'error');
        setFeedback({ type: 'error', message: msg });
        if (data.errors) setErrors(data.errors);
      }
    } catch (error) {
      console.error('Create company error:', error);
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
        {[
          { id: 'name', label: 'Company Name', value: name, setter: setName },
          { id: 'industry', label: 'Industry', value: industry, setter: setIndustry },
          { id: 'size', label: 'Size', value: size, setter: setSize },
          { id: 'location', label: 'Location', value: location, setter: setLocation },
        ].map(({ id, label, value, setter }) => (
          <div key={id} className="create-company-floating-input">
            <input
              id={id}
              type="text"
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="create-company-floating-input-field"
              placeholder=" "
              required
            />
            <label htmlFor={id}>{label}</label>
            {errors[id] && <p className="create-company-error">{errors[id]}</p>}
          </div>
        ))}

        <div className="create-company-buttons">
          <button
            className="create-company-btn create-company-btn-green"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
          <button
            className="create-company-btn create-company-btn-red"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                navigate(-1);
              }
            }}
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

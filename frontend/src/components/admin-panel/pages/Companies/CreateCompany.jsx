import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../../configs/config';
import ToastNotification from '../../../../components/toast-notification/ToastNotification';
import './CreateCompany.css';


export default function CreateCompany({ onCancel, onSuccess }) {
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
  
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setFeedback({ type: '', message: '' });
        return;
      }
  
      setLoading(true);
      try {
        const csrfRes = await fetch(`${API_URL}/csrf-token`, { credentials: 'include' });
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
          if (onSuccess) onSuccess(data);
        } else {
          const msg = data.message || 'Failed to create company.';
          showToast(msg, 'error');
          setFeedback({ type: 'error', message: msg });
          if (data.errors) setErrors(data.errors);
        }
      } catch (error) {
        console.error('Create company error:', error);
        showToast('Server error. Please try again later.', 'error');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="create-company-container">
  
        <div className="create-company-form">
          {/* First Row: Company Name + Industry */}
          <div className="create-company-row">
            <div className="create-company-floating-input half">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="create-company-floating-input-field"
                placeholder=" "
                required
              />
              <label htmlFor="name">Company Name</label>
              {errors.name && <p className="create-company-error">{errors.name}</p>}
            </div>
  
            <div className="create-company-floating-input half">
              <input
                id="industry"
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="create-company-floating-input-field"
                placeholder=" "
              />
              <label htmlFor="industry">Industry</label>
              {errors.industry && <p className="create-company-error">{errors.industry}</p>}
            </div>
          </div>
  
          {/* Second Row: Size + Location */}
          <div className="create-company-row">
            <div className="create-company-floating-input half">
              <input
                id="size"
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="create-company-floating-input-field"
                placeholder=" "
              />
              <label htmlFor="size">Size</label>
              {errors.size && <p className="create-company-error">{errors.size}</p>}
            </div>
  
            <div className="create-company-floating-input half">
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="create-company-floating-input-field"
                placeholder=" "
              />
              <label htmlFor="location">Location</label>
              {errors.location && <p className="create-company-error">{errors.location}</p>}
            </div>
          </div>
  
          <div className="create-company-buttons">
            <button
              className="create-company-btn create-company-btn-green"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
            {/* <button
              className="create-company-btn create-company-btn-red"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button> */}
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
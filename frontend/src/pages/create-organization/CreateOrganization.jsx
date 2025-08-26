import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configs/config';
import './CreateOrganization.css';

const CreateOrganization = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [location, setLocation] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    if (!name.trim()) newErrors.name = 'Organization name is required';

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
      const { csrf_token } = await csrfRes.json();

      const formData = { name, industry, size, location };

      const response = await fetch(`${API_URL}/create-organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setFeedback({ type: 'success', message: 'Organization has been created!' });
        resetForm();
      } else {
        const errMsg = data.message || 'Failed to create organization.';
        setFeedback({ type: 'error', message: errMsg });
        if (data.errors) setErrors(data.errors);
      }
    } catch (error) {
      console.error('Create organization error:', error);
      setFeedback({ type: 'error', message: 'Server error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-org-container">
      <h2 className="create-org-title">Create Organization</h2>

      <div className="create-org-form">
        {[
          { id: 'name', label: 'Organization Name', value: name, set: setName },
          { id: 'industry', label: 'Industry', value: industry, set: setIndustry },
          { id: 'size', label: 'Size', value: size, set: setSize },
          { id: 'location', label: 'Location', value: location, set: setLocation },
        ].map(({ id, label, value, set }) => (
          <div key={id} className="create-org-floating-input">
            <input
              id={id}
              type="text"
              value={value}
              onChange={(e) => set(e.target.value)}
              className="create-org-floating-input-field"
              placeholder=" " // required for :placeholder-shown CSS trick
              required // enables browser validation styling
            />
            <label htmlFor={id}>{label}</label>
            {errors[id] && <p className="create-org-error">{errors[id]}</p>}
          </div>
        ))}

        <div className="create-org-buttons">
          <button
            className="create-org-btn create-org-btn-blue"
            onClick={handleCreate}
            disabled={loading}
          >
            Create
          </button>
          <button
            className="create-org-btn create-org-btn-red"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Back to Login
          </button>
        </div>

        {feedback.message && (
          <div className={`create-org-feedback ${feedback.type}`}>
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateOrganization;

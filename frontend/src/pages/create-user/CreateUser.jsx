// frontend\src\pages\create-user\CreateUser.jsx
import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanyFilterStore } from '../../store/layout/companyFilterStore';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import './CreateUser.css';

const CreateUser = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [position, setPosition] = useState('');
  const [group, setGroup] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const { options: organizationOptions } = useCompanyFilterStore();


  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const alphaRegex = /^[A-Za-z]+$/;


  // Auto-hide feedback notification after 4 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ type: '', message: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);
  

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOrganization('');
    setRole('');
    setPosition('');
    setGroup('');
    setFeedback({ type: '', message: '' });
    setErrors({});
  };

  // const handleCreate = () => {
  //   const fullname = `${firstName.trim()} ${lastName.trim()}`.trim();
  
  //   const newErrors = {};
  
  //   if (!/^[A-Za-z]+$/.test(firstName)) {
  //     newErrors.firstName = 'First name must contain only letters';
  //   }
  //   if (!/^[A-Za-z]+$/.test(lastName)) {
  //     newErrors.lastName = 'Last name must contain only letters';
  //   }
  //   if (!emailRegex.test(email)) {
  //     newErrors.email = 'Invalid email format';
  //   }
  //   if (!password) {
  //     newErrors.password = 'Password is required';
  //   }
  //   if (password !== confirmPassword) {
  //     newErrors.confirmPassword = 'Passwords do not match';
  //   }
  //   if (!organization) {
  //     newErrors.organization = 'Organization is required';
  //   }
  //   if (!role) {
  //     newErrors.role = 'Role is required';
  //   }
  //   if (!position) {
  //     newErrors.position = 'Position is required';
  //   }
  //   if (!group) {
  //     newErrors.group = 'Group is required';
  //   }
  
  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     setFeedback({ type: '', message: '' });
  //     return;
  //   }
  
  //   setLoading(true); // 🔒 disable buttons
  
  //   const formData = {
  //     email,
  //     password,
  //     fullname,
  //     organization,
  //     role,
  //     position,
  //     group,
  //   };
  
  //   console.log('Created User:', formData);
  
  //   setFeedback({ type: 'success', message: 'User has been created!' });
  
  //   setTimeout(() => {
  //     resetForm(); // clear inputs
  //     setLoading(false); // 🔓 re-enable buttons
  //   }, 5000);
  // };

  const handleCreate = async () => {
    const fullname = `${firstName.trim()} ${lastName.trim()}`.trim();
  
    const newErrors = {};
  
    if (!/^[A-Za-z]+$/.test(firstName)) {
      newErrors.firstName = 'First name must contain only letters';
    }
    if (!/^[A-Za-z]+$/.test(lastName)) {
      newErrors.lastName = 'Last name must contain only letters';
    }
    if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!organization) {
      newErrors.organization = 'Organization is required';
    }
    if (!role) {
      newErrors.role = 'Role is required';
    }
    if (!position) {
      newErrors.position = 'Position is required';
    }
    if (!group) {
      newErrors.group = 'Group is required';
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFeedback({ type: '', message: '' });
      return;
    }
  
    setLoading(true); // 🔒 disable buttons
  
    try {
      // ✅ Get CSRF token first
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrf_token } = await csrfRes.json();
  
      // ✅ Prepare form data
      const formData = {
        firstName,
        lastName,
        email,
        password,
        organization,
        role,
        position,
        group,
      };
  
      // ✅ Call Laravel backend
      const response = await fetch(`${API_URL}/create-user`, {
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
        setFeedback({ type: 'success', message: 'User has been created!' });
        resetForm(); // clear inputs
      } else {
        const errMsg = data.message || 'Failed to create user.';
        setFeedback({ type: 'error', message: errMsg });
        if (data.errors) setErrors(data.errors);
      }
    } catch (error) {
      console.error('Create user error:', error);
      setFeedback({ type: 'error', message: 'Server error. Please try again later.' });
    } finally {
      setLoading(false); // 🔓 re-enable buttons
    }
  };
  

  return (
    <div className="create-user-container">
      <h2 className="create-user-title">Create User</h2>

      <div className="create-user-form">
        {/* First Name */}
        <div className="create-user-floating-input">
          <input
            id="first-name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="create-user-floating-input-field"
          />
          <label htmlFor="first-name" className={firstName ? 'filled' : ''}>
            First Name
          </label>
          {errors.firstName && <p className="create-user-error">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div className="create-user-floating-input">
          <input
            id="last-name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="create-user-floating-input-field"
          />
          <label htmlFor="last-name" className={lastName ? 'filled' : ''}>
            Last Name
          </label>
          {errors.lastName && <p className="create-user-error">{errors.lastName}</p>}
        </div>

        {/* Email */}
        <div className="create-user-floating-input">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="create-user-floating-input-field"
          />
          <label htmlFor="email" className={email ? 'filled' : ''}>
            Email
          </label>
          {errors.email && <p className="create-user-error">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="create-user-floating-input">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="create-user-floating-input-field"
          />
          <label htmlFor="password" className={password ? 'filled' : ''}>
            Password
          </label>
          {errors.password && <p className="create-user-error">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="create-user-floating-input">
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="create-user-floating-input-field"
          />
          <label htmlFor="confirm-password" className={confirmPassword ? 'filled' : ''}>
            Confirm Password
          </label>
          {errors.confirmPassword && <p className="create-user-error">{errors.confirmPassword}</p>}
        </div>

        {/* Dropdowns */}
        {[
        //   { label: 'Organization', value: organization, set: setOrganization, options: ['Chuck Gulledge Advisors, LLC', 'Collins Credit Union'], id: 'organization' },
          { label: 'Organization', value: organization, set: setOrganization, options: organizationOptions, id: 'organization' },  
          { label: 'Role', value: role, set: setRole, options: ['User', 'Testuser', 'Superadmin'], id: 'role' },
          { label: 'Position', value: position, set: setPosition, options: ['Admin', 'CEO', 'Superadmin'], id: 'position' },
          { label: 'Group', value: group, set: setGroup, options: ['Executive', 'Operations'], id: 'group' },
        ].map(({ label, value, set, options, id }) => (
          <div key={id} className="create-user-select-wrapper">
            <select
              className="create-user-select"
              value={value}
              onChange={(e) => set(e.target.value)}
            >
              <option value="">{`Select ${label}`}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors[id] && <p className="create-user-error">{errors[id]}</p>}
          </div>
        ))}

        {/* <div className="create-user-buttons">
        <button
            className="create-user-btn create-user-btn-blue"
            onClick={handleCreate}
            disabled={loading}
        >
            Create
        </button>
        <button
            className="create-user-btn create-user-btn-red"
            onClick={() => navigate('/')}
            disabled={loading}
        >
            Back to Login
        </button>
        </div> */}


        {/* {feedback.message && (
          <div
            className={`create-user-feedback ${
              feedback.type === 'success' ? 'success' : 'error'
            }`}
          >
            {feedback.message}
          </div>
        )} */}


        <div className="create-user-buttons">
          <button
            className="create-user-btn create-user-btn-blue"
            onClick={handleCreate}
            disabled={loading}
          >
            Create
          </button>
          <button
            className="create-user-btn create-user-btn-red"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Back to Login
          </button>
        </div>

        {feedback.message && (
          <div
            className={`create-user-feedback ${
              feedback.type === 'success' ? 'success' : 'error'
            }`}
          >
            {feedback.message}
          </div>
        )}
      </div>

      {/* Custom Centered Notification */}
      {feedback.message && (
        <div
          className={`custom-notification ${
            feedback.type === 'success' ? 'success' : 'error'
          }`}
        >
          {feedback.message}
        </div>
      )}

    </div>
  );
};

export default CreateUser;

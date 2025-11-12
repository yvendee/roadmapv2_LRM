import React, { useEffect, useState } from 'react';
import './NewUser.css';
import useUserStore from '../../../../store/admin-panel/users/userStore';
import { useCompanyFilterStore } from '../../../../store/layout/companyFilterStore';
import API_URL, { ENABLE_CONSOLE_LOGS } from '../../../../configs/config';
import ToastNotification from '../../../../components/toast-notification/ToastNotification';

export default function NewUser({ onCancel }) {
  const { setUsers, users } = useUserStore();
  const { options, setSelected } = useCompanyFilterStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [position, setPosition] = useState('');
  // const [group, setGroup] = useState('');
  const [associatedOrg, setAssociatedOrg] = useState([]); // Associated organization state

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', status: '', isVisible: false });

  const roleOptions = ['user', 'testuser', 'superadmin'];

  const positionOptions = [
    'Other',
    'Admin',
    'CEO',
    'Internal',
    'Leadership',
    'Department Head',
    'Manager',
    'HR',
    'Finance',
    'Accounting',
    'Sales',
    'Marketing',
    'Support',
    'CustomerService',
    'Developer',
    'Engineer',
    'Designer',
    'QA',
    'ProductManager',
    'ProjectManager',
    'BusinessAnalyst',
    'IT',
    'Security',
    'Legal',
    'Operations',
    'Consultant',
    'Intern',
    'Trainer',
    'Recruiter',
    'ExecutiveAssistant',
    'DataAnalyst',
    'SystemAdmin',
  ];

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
    return newErrors;
  };

  const handleCreate = async () => {
    console.log("✅ handleCreate fired");
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
        associatedOrganization: associatedOrg.length > 0 ? associatedOrg : [], // Sending the associated organization
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

      // Format the new user for the store shape
      const newUser = {
        id: Date.now(), // temporary ID (replace with server-provided ID if available)
        u_id: data.user?.u_id || '', // use server value if returned
        company: payload.organization, // main organization
        associationOrganization: payload.associationOrganization || '', // <-- add this
        name: `${payload.firstName} ${payload.lastName}`,
        email: payload.email,
        emailVerifiedAt: data.user?.emailVerifiedAt || '',
        role: payload.role,
        position: payload.position,
      };
      

      setUsers([...users, newUser]);
      showToast('User created successfully!', 'success');

      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setOrganization('');
      setRole('');
      setPosition('');
      // setGroup('');
      setAssociatedOrg([]); // Reset associated organizations
      setErrors({});
    } catch (error) {
      console.error('Create error:', error);
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });

        const { csrf_token } = await csrfRes.json();

        const res = await fetch(`${API_URL}/v1/company-options`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch organizations');

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          useCompanyFilterStore.setState({
            options: data,
            selected: data[0],
          });
          setOrganization(data[0]); // Default selected
        } else {
          console.warn('No organizations found');
        }
      } catch (error) {
        console.error('Error fetching organization options:', error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleRemoveOrg = (org) => {
    setAssociatedOrg(associatedOrg.filter((item) => item !== org));
  };

  return (
    <div className="new-user-container p-6 max-w-2xl mx-auto">
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
            <label>Organization <span className="required">*</span></label>
            <select
              className="form-input"
              value={organization}
              onChange={(e) => {
                setOrganization(e.target.value);
                setSelected(e.target.value); // update Zustand store
              }}
            >
              {options.map((org, index) => (
                <option key={index} value={org}>
                  {org}
                </option>
              ))}
            </select>
            {errors.organization && (
              <div className="error-text">{errors.organization}</div>
            )}
          </div>
        </div>

{/* Associated Organization - Multi-select dropdown with pills */}
<div className="form-group">
  <label>Associated Organization</label>

  {/* Render selected organizations as pills */}
  <div className="pill-container">
    {associatedOrg.map((org, idx) => (
      <span key={idx} className="pill">
        {org}
        <button
          type="button"
          onClick={() => setAssociatedOrg(associatedOrg.filter(item => item !== org))}
          className="pill-remove"
        >
          &times;
        </button>
      </span>
    ))}
  </div>

  {/* Dropdown to select organizations */}
  <select
    className="form-input"
    value="" // always reset to placeholder after selection
    onChange={(e) => {
      const selectedOrg = e.target.value;
      if (selectedOrg && !associatedOrg.includes(selectedOrg)) {
        setAssociatedOrg([...associatedOrg, selectedOrg]);
      }
      e.target.value = ""; // reset dropdown after selection
    }}
  >
    <option value="">-- Select an Organization --</option>
    {options
      .filter((org) => !associatedOrg.includes(org)) // hide already selected orgs
      .map((org, idx) => (
        <option key={idx} value={org}>
          {org}
        </option>
      ))}
  </select>

  <small className="text-gray-500">
    Leave empty for no association (default: [])
  </small>
</div>



        <div className="row-two">
          <div className="form-group">
            <label>Role <span className="required">*</span></label>
            <select
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">-- Select Role --</option>
              {roleOptions.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.role && <div className="error-text">{errors.role}</div>}
          </div>

          <div className="form-group">
            <label>Position <span className="required">*</span></label>
            <select
              className="form-input"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              <option value="">-- Select Position --</option>
              {positionOptions.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.position && <div className="error-text">{errors.position}</div>}
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

      <ToastNotification
        message={toast.message}
        status={toast.status}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

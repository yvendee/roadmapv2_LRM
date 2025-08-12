// frontend\src\components\16.members-directory\1.InformationSection\InformationSection.jsx
import React from 'react';
import './InformationSection.css'; 

const InformationSection = () => {
  return (
    <div className="row mb-3">
      <div className="col-lg-12">
        <div className="card bg-100 border">
          <div className="card-header border-bottom">
            <h5 className="mb-0 access-title">Access Type & Log In Information</h5>
          </div>
          <div className="card-body access-body">
            {/* Access Type Section */}
            <div className="mb-3">
              <h6 className="fw-bold">Access Type:</h6>
              <ul className="access-list">
                <li>
                  <strong>Admin</strong> – Admins have full access to all sections within the Momentum Hub.
                  They can view, edit, add, and delete content across all areas, including Company Traction,
                  Departmental Traction, and settings. Admins can also manage user permissions. The CEO or Founder
                  is typically listed as an Admin.
                </li>
                <li>
                  <strong>Leadership</strong> – Leadership includes C-suite executives and senior leaders. They
                  have access to all sections of the Momentum Hub and can add, edit, or delete traction items—but
                  only for items assigned to them or where they are collaborators.<br />
                  <em>Company Traction:</em> Can view all, but can only edit or delete items assigned to them or
                  where they are a collaborator.<br />
                  <em>Departmental Traction:</em> Same permissions as above—limited to their own assigned items or
                  collaborations.
                </li>
                <li>
                  <strong>Department Head</strong> – Department Heads have similar access to Leadership, with one
                  key difference: they have full editing rights within their department, regardless of assignment.<br />
                  <em>Company Traction:</em> Can view all, but can only edit or delete items assigned to them or
                  where they are a collaborator.<br />
                  <em>Departmental Traction:</em> Can add, edit, or delete any item within their department—even
                  if it’s not assigned to them.
                </li>
              </ul>
            </div>

            {/* Log In Section */}
            <div>
              <h6 className="fw-bold">Log In:</h6>
              <p>
                Once an email is added, the system automatically creates a login, and the default password is
                <strong> Momentum2025!</strong><br />
                <em>Note:</em> Once a user logs in, we highly recommend changing the password by going to
                <strong>Profile</strong> (top right corner), selecting <strong>Change Password</strong>, and saving
                the changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationSection;

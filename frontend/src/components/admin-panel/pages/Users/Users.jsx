import React, { useEffect, useState } from 'react';
import './Users.css';
import { FaEdit } from 'react-icons/fa';
import useUserStore from '../../../../store/admin-panel/users/userStore';
import EditUser from './EditUser';
import API_URL, { ENABLE_CONSOLE_LOGS } from '../../../../configs/config';

export default function Users() {
  const { users, setUsers, selectedUser, setSelectedUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch Users on Mount
  useEffect(() => {
    (async () => {
      try {
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });

        if (!csrfRes.ok) throw new Error('Failed to fetch CSRF token');
        const { csrf_token } = await csrfRes.json();

        const res = await fetch(`${API_URL}/v1/admin-panel/users/list`, {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
        });

        const json = await res.json();
        const data = json.users || [];

        ENABLE_CONSOLE_LOGS && console.log('Fetched users:', data);

        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [setUsers]);

  const handleEditUser = (user) => {
    ENABLE_CONSOLE_LOGS && console.log('✏️ Editing user:', user);
    setSelectedUser(user);
  };

  const handleDeleteClick = () => {
    ENABLE_CONSOLE_LOGS && console.log('🗑️ Delete clicked');
    ENABLE_CONSOLE_LOGS && console.log('Selected User:', selectedUser);
    setShowDeleteModal(true); // show modal
  };

  const handleConfirmDelete = () => {
    ENABLE_CONSOLE_LOGS && console.log('✅ Confirmed delete:', selectedUser);
    setShowDeleteModal(false);
    // optionally trigger API delete here
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="p-6">
      {/* Header - Users List */}
      {!selectedUser && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Maintenance &gt; Users</div>
            <h2 className="text-2xl font-semibold">Users</h2>
          </div>
          <button className="new-user-btn">New user</button>
        </div>
      )}

      {/* Header - Edit User */}
      {selectedUser && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">
              Maintenance &gt;{' '}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => setSelectedUser(null)}
              >
                Users
              </span>{' '}
              &gt; Edit
            </div>
            <h2 className="text-2xl font-semibold">Edit User</h2>
          </div>

          <button className="delete-btn" onClick={handleDeleteClick}>
            Delete
          </button>
        </div>
      )}

      {/* ✏️ Edit Mode */}
      {selectedUser && <EditUser />}

      {/* Users List Table */}
      {!selectedUser && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-700 text-left">
              <tr>
                <th className="p-3"><input type="checkbox" /></th>
                <th className="p-3">Company</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Email Verified At</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <tr key={index} className="border-t border-gray-200 dark:border-gray-600">
                      <td className="p-3"><input type="checkbox" disabled /></td>
                      <td className="p-3"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
                      <td className="p-3"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
                      <td className="p-3"><div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div></td>
                      <td className="p-3"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></td>
                      <td className="p-3 text-right">
                        <div className="h-4 w-6 bg-gray-200 rounded-full animate-pulse inline-block"></div>
                      </td>
                    </tr>
                  ))
                : users.map((user) => {
                    const showSkeleton = !user.company;
                    return (
                      <tr
                        key={user.id}
                        className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="p-3"><input type="checkbox" /></td>
                        <td className="p-3">
                          {showSkeleton ? (
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                          ) : (
                            user.company
                          )}
                        </td>
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.emailVerifiedAt || '-'}</td>
                        <td className="p-3 text-right">
                          {showSkeleton ? (
                            <div className="h-4 w-6 bg-gray-200 rounded-full animate-pulse inline-block"></div>
                          ) : (
                            <button
                              className="text-orange-500 hover:text-orange-600"
                              onClick={() => handleEditUser(user)}
                            >
                              <FaEdit />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing 1 to {users.length} of {users.length} results
            </span>
            <div>
              <label htmlFor="perPage" className="mr-2">
                Per page
              </label>
              <select
                id="perPage"
                className="border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600"
                defaultValue="10"
                disabled
              >
                <option value="10">10</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="delete-modal-overlay"
          onClick={handleCancelDelete}
        >
          <div
            className="delete-modal-box"
            onClick={(e) => e.stopPropagation()} // prevent click bubbling
          >
            <p className="delete-modal-text">Are you sure you want to delete this user?</p>
            <div className="delete-modal-actions">
              <button className="delete-modal-btn yes" onClick={handleConfirmDelete}>Yes</button>
              <button className="delete-modal-btn no" onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

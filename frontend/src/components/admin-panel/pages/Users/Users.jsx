// frontend/src/components/admin-panel/pages/Users/Users.jsx

import React, { useEffect } from 'react';
import './Users.css';
import { FaEdit } from 'react-icons/fa';
import useUserStore from '../../../../store/admin-panel/users/userStore';
import API_URL from '../../../../configs/config';

export default function Users() {
  const users = useUserStore((state) => state.users);
  const setUsers = useUserStore((state) => state.setUsers);
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);

  // Fetch users on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${API_URL}/v1/admin-panel/users/list`, {
          credentials: 'include',
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to fetch users');

        setUsers(data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
  }, [setUsers]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    // Navigate to edit page or open modal as needed
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">Maintenance &gt; Users</div>
          <h2 className="text-2xl font-semibold">Users</h2>
        </div>
        <button className="new-user-btn">New user</button>
      </div>

      {/* Table */}
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
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isLoading = !user.company;

                return (
                  <tr
                    key={user.id || Math.random()}
                    className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-3"><input type="checkbox" /></td>
                    <td className="p-3">
                      {isLoading ? <div className="skeleton h-5 w-28 rounded" /> : user.company}
                    </td>
                    <td className="p-3">
                      {isLoading ? <div className="skeleton h-5 w-24 rounded" /> : user.name}
                    </td>
                    <td className="p-3">
                      {isLoading ? <div className="skeleton h-5 w-40 rounded" /> : user.email}
                    </td>
                    <td className="p-3">
                      {isLoading ? <div className="skeleton h-5 w-20 rounded" /> : (user.emailVerifiedAt || '-')}
                    </td>
                    <td className="p-3 text-right">
                      {isLoading ? (
                        <div className="skeleton h-5 w-5 rounded-full ml-auto" />
                      ) : (
                        <button
                          className="text-orange-500 hover:text-orange-600"
                          onClick={() => handleEditClick(user)}
                        >
                          <FaEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing 1 to {users.length} of {users.length} results
          </span>
          <div>
            <label htmlFor="perPage" className="mr-2">Per page</label>
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
    </div>
  );
}

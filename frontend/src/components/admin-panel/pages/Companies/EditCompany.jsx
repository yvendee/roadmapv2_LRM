import React, { useState, useEffect } from 'react';
import useCompanyStore from '../../../../store/admin-panel/companies/companyStore';

export default function EditCompany() {
  const { selectedCompany, updateCompany } = useCompanyStore();
  const [formData, setFormData] = useState({ name: '', code: '' });

  useEffect(() => {
    if (selectedCompany) {
      setFormData({
        id: selectedCompany.id,
        name: selectedCompany.name,
        code: selectedCompany.code,
      });
    }
  }, [selectedCompany]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCompany(formData);
  };

  if (!selectedCompany) return null;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded shadow border dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Edit Company</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Company Code</label>
          <input
            type="text"
            name="code"
            className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import useCompanyStore from '../../../../store/admin-panel/companies/companyStore';

const allMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function EditCompany() {
  const { selectedCompany, updateCompany } = useCompanyStore();
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    code: '',
    quarters: {
      Q1: [],
      Q2: [],
      Q3: [],
      Q4: [],
    },
  });

  useEffect(() => {
    if (selectedCompany) {
      setFormData({
        ...selectedCompany,
        quarters: selectedCompany.quarters || {
          Q1: [],
          Q2: [],
          Q3: [],
          Q4: [],
        },
      });
    }
  }, [selectedCompany]);

  const getUsedMonths = (excludeQuarter) => {
    return Object.entries(formData.quarters)
      .filter(([q]) => q !== excludeQuarter)
      .flatMap(([, months]) => months);
  };

  const handleMonthChange = (quarter, event) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map((opt) => opt.value);

    setFormData((prev) => ({
      ...prev,
      quarters: {
        ...prev.quarters,
        [quarter]: selectedOptions,
      },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCompany(formData);
  };

  if (!selectedCompany) return null;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded shadow border dark:border-gray-700">
      <div className="text-sm text-gray-500 mb-1">Companies &gt; Edit</div>
      <h2 className="text-2xl font-semibold mb-6">Edit Company</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Company Code<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Quarters */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quarters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quarterLabels.map((quarter) => {
              const usedMonths = getUsedMonths(quarter);

              return (
                <div key={quarter} className="p-4 border rounded-md dark:border-gray-600 dark:bg-gray-700">
                  <div className="font-semibold mb-2">
                    Quarter: <span className="text-orange-500">{quarter}</span>
                  </div>

                  <label className="block mb-1 font-medium">
                    Month<span className="text-red-500">*</span>
                  </label>
                  <select
                    multiple
                    value={formData.quarters[quarter]}
                    onChange={(e) => handleMonthChange(quarter, e)}
                    className="w-full border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
                  >
                    {allMonths.map((month) => (
                      <option
                        key={month}
                        value={month}
                        disabled={usedMonths.includes(month)}
                      >
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-medium"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

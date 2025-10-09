import React, { useEffect } from 'react';
import './Companies.css';
import { FaEdit } from 'react-icons/fa';
import useCompanyStore from '../../../../store/admin-panel/companies/companyStore';
import { useEditCompanyStore } from '../../../../store/admin-panel/companies/editCompanyStore';
import EditCompany from './EditCompany';
import API_URL from '../../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../../configs/config';


export default function Companies() {
  const { companies, setCompanies, selectedCompany, setSelectedCompany } = useCompanyStore();
  const { name, setName, setQuarters } = useEditCompanyStore();
  

  // fetch Company / Organization List
  useEffect(() => {
    (async () => {
      try {
        // Fetch CSRF token first
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
        if (!csrfRes.ok) throw new Error('Failed to fetch CSRF token');
        const { csrf_token } = await csrfRes.json();

        // Then fetch companies with the CSRF token header
        const res = await fetch(`${API_URL}/v1/admin-panel/companies`, {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch companies');
        }
        const json = await res.json();
        const data = json.data || [];
        ENABLE_CONSOLE_LOGS && console.log('Fetched companies:', data);
        setCompanies(data);
      } catch (error) {
        console.error('Error loading companies:', error);
      }
    })();
  }, [setCompanies]);


  // fetch Quarter status by Organization
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       // ✅ Step 1: Fetch CSRF token
  //       const csrfRes = await fetch(`${API_URL}/csrf-token`, {
  //         credentials: 'include',
  //       });
  //       if (!csrfRes.ok) throw new Error('Failed to fetch CSRF token');

  //       const { csrf_token } = await csrfRes.json();

  //       // ✅ Step 2: Send POST request with organizationName
  //       const res = await fetch(`${API_URL}/v1/admin-panel/quarters`, {
  //         method: 'POST',
  //         credentials: 'include',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'X-CSRF-TOKEN': csrf_token,
  //           Accept: 'application/json',
  //         },
  //         body: JSON.stringify({ organizationName: name }),
  //       });

  //       if (!res.ok) {
  //         const errorData = await res.json();
  //         throw new Error(errorData?.error || 'Failed to fetch quarters');
  //       }

  //       const data = await res.json();

  //       ENABLE_CONSOLE_LOGS && console.log('✅ Quarters response:', data);

  //       // ✅ Update store with both name and quarters
  //       setName(data.name);
  //       setQuarters(data.quarters);
  //     } catch (error) {
  //       console.error('❌ Error loading quarters:', error.message);
  //     }
  //   })();
  // }, [name, setName, setQuarters]);


  // const handleEditCompany = (company) => {
  //   ENABLE_CONSOLE_LOGS &&  console.log('✏️ Editing Company:', company);
  //   setSelectedCompany(company);
  // };

  const handleEditCompany = async (company) => {
    ENABLE_CONSOLE_LOGS && console.log('✏️ Editing Company:', company);
    setSelectedCompany(company);
  
    try {
      // Fetch CSRF token first
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
      if (!csrfRes.ok) throw new Error('Failed to fetch CSRF token');
      const { csrf_token } = await csrfRes.json();
  
      // Fetch quarters by organizationName (company.name)
      const res = await fetch(`${API_URL}/v1/admin-panel/quarters`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
          Accept: 'application/json',
        },
        body: JSON.stringify({ organizationName: company.name }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || 'Failed to fetch quarters');
      }
  
      const data = await res.json();
  
      ENABLE_CONSOLE_LOGS && console.log('✅ Quarters response:', data);
  
      // Update your store with the response data
      useEditCompanyStore.setState({
        name: data.name,
        quarters: data.quarters,
      });
    } catch (error) {
      console.error('❌ Error loading quarters:', error.message);
    }
  };
  


  return (
    <div className="p-6">
      {/* Header - Companies List */}
      {!selectedCompany && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Maintenance &gt; Companies</div>
            <h2 className="text-2xl font-semibold">Companies</h2>
          </div>
          <button className="new-company-btn">New company</button>
        </div>
      )}

      {/* Header - Edit Company */}
      {selectedCompany && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">
              Maintenance &gt;{' '}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => setSelectedCompany(null)}
              >
                Companies
              </span>{' '}
              &gt; Edit
            </div>
            <h2 className="text-2xl font-semibold">Edit Company</h2>
          </div>

          <button
            className="delete-btn"
            onClick={() => {
              ENABLE_CONSOLE_LOGS &&  console.log('🗑️ Delete clicked');
              ENABLE_CONSOLE_LOGS &&  console.log('Selected Company:', selectedCompany);
            }}
          >
            Delete
          </button>
        </div>
      )}


      {/* Content */}
      {!selectedCompany ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-700 text-left">
              <tr>
                <th className="p-3"><input type="checkbox" /></th>
                <th className="p-3">Name</th>
                {/* <th className="p-3">Company Code</th> */}
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
            {companies.map((company) => {
              const isLoading = !company.name?.trim(); // Check if name is empty, null, or only whitespace

              return (
                <tr
                  key={company.id}
                  className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-3"><input type="checkbox" /></td>

                  <td className="p-3">
                    {isLoading ? (
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                    ) : (
                      company.name
                    )}
                  </td>

                  <td className="p-3 text-right">
                    {isLoading ? (
                      <div className="h-4 w-6 bg-gray-200 rounded-full animate-pulse inline-block" />
                    ) : (
                      <button
                        className="text-orange-500 hover:text-orange-600"
                        onClick={() => handleEditCompany(company)}
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
            <span>Showing 1 to {companies.length} of {companies.length} results</span>
            <div>
              <label htmlFor="perPage" className="mr-2">Per page</label>
              <select id="perPage" className="border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600">
                <option value="10">10</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <EditCompany />
      )}
    </div>
  );
}

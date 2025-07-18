import React, { useState } from 'react';
import './CompanyTraction.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSyncAlt,
  faCommentDots,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

const initialCompanyTraction = {
    Q1: [
      {
        id: 1,
        who: 'Maricar',
        collaborator: 'Maricar',
        description:
          'Develop $8,000 in new monthly revenue - one on one or cohort. Use the references and leads we have.',
        progress: '5%',
        annualPriority: 'Develop lead generation systems',
        dueDate: '03/31/2025',
        rank: '1',
      },
      {
        id: 2,
        who: 'John',
        collaborator: 'Derek',
        description: 'Complete onboarding SOP for sales team',
        progress: '60%',
        annualPriority: 'Streamline internal operations',
        dueDate: '03/25/2025',
        rank: '2',
      },
      {
        id: 3,
        who: 'Arlene',
        collaborator: 'None',
        description: 'Prepare customer success templates',
        progress: '40%',
        annualPriority: 'Improve client retention',
        dueDate: '03/28/2025',
        rank: '3',
      },
    ],
    Q2: [
      {
        id: 1,
        who: 'Maricar',
        collaborator: 'Maricar',
        description:
          'Continue with developing lead generation system but using LinkedIn post and Chuck’s website',
        progress: '0%',
        annualPriority: 'Develop lead generation systems',
        dueDate: 'Click to set date',
        rank: '',
      },
      {
        id: 2,
        who: 'Maricar',
        collaborator: 'None',
        description: 'Use Apollo with Arlene',
        progress: '0%',
        annualPriority: 'Develop lead generation systems',
        dueDate: 'Click to set date',
        rank: '',
      },
      {
        id: 3,
        who: 'Derek',
        collaborator: 'John',
        description: 'Launch Q2 marketing campaign for SaaS clients',
        progress: '10%',
        annualPriority: 'Increase brand awareness',
        dueDate: '05/15/2025',
        rank: '1',
      },
      {
        id: 4,
        who: 'Chuck',
        collaborator: 'Arlene',
        description: 'Evaluate CRM tools and propose migration',
        progress: '25%',
        annualPriority: 'Optimize sales operations',
        dueDate: '06/01/2025',
        rank: '2',
      },
    ],
    Q3: [
      {
        id: 1,
        who: 'Arlene',
        collaborator: 'None',
        description: 'Hire 2 junior SDRs and start training',
        progress: '0%',
        annualPriority: 'Scale sales team',
        dueDate: '08/10/2025',
        rank: '1',
      },
      {
        id: 2,
        who: 'Maricar',
        collaborator: 'Chuck',
        description: 'Test cold email campaign with Apollo sequences',
        progress: '0%',
        annualPriority: 'Develop lead generation systems',
        dueDate: '07/20/2025',
        rank: '2',
      },
      {
        id: 3,
        who: 'Derek',
        collaborator: 'None',
        description: 'Organize Q3 team offsite to improve collaboration',
        progress: '0%',
        annualPriority: 'Build team culture',
        dueDate: '09/01/2025',
        rank: '3',
      },
    ],
    Q4: [
      {
        id: 1,
        who: 'John',
        collaborator: 'Maricar',
        description: 'Analyze 2025 revenue trends and prepare 2026 forecast',
        progress: '0%',
        annualPriority: 'Strategic planning',
        dueDate: '12/05/2025',
        rank: '1',
      },
      {
        id: 2,
        who: 'Chuck',
        collaborator: 'None',
        description: 'Launch new pricing strategy based on churn data',
        progress: '0%',
        annualPriority: 'Improve revenue per client',
        dueDate: '11/15/2025',
        rank: '2',
      },
      {
        id: 3,
        who: 'Arlene',
        collaborator: 'Derek',
        description: 'Wrap up year-end client satisfaction surveys',
        progress: '0%',
        annualPriority: 'Client engagement',
        dueDate: '12/20/2025',
        rank: '3',
      },
    ],
  };
  

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

const CompanyTraction = () => {
  const [activeQuarter, setActiveQuarter] = useState('Q2');
  const [showCompleted, setShowCompleted] = useState(true);
  const [companyTraction] = useState(initialCompanyTraction);

  const filteredRows = showCompleted
    ? companyTraction[activeQuarter] || []
    : (companyTraction[activeQuarter] || []).filter((row) => row.progress !== '100%');

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md ml-[5px] mr-[5px] always-black">
      {/* Employee Filter Centered */}
      <div className="flex justify-center mb-4">
        <div className="text-center">
          <label className="font-medium mr-2">Employee Filter:</label>
          <select className="border rounded px-2 py-1 text-sm">
            <option>All</option>
            <option>Maricar</option>
            <option>Arlene</option>
          </select>
        </div>
      </div>

      {/* Quarter Navigation & Actions */}
      {/* <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          {quarters.map((q) => (
            <button
              key={q}
              className={`text-sm pb-1 border-b-2 ${
                activeQuarter === q ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveQuarter(q)}
            >
              {q}
            </button>
          ))}
        </div> */}

<div className="flex justify-between items-center mb-4">
  {/* Quarter Navigation */}
  <div className="flex gap-8">
    {quarters.map((q) => (
      <div
        key={q}
        className={`cursor-pointer text-sm relative pb-2 transition-all duration-200 ${
          activeQuarter === q
            ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-blue-500 border-b-2 border-transparent'
        }`}
        onClick={() => setActiveQuarter(q)}
      >
        {q}
      </div>
    ))}
  </div>

  {/* Action Buttons */}
  <div className="flex gap-2">
    <div className="pure-blue-btn cursor-pointer flex items-center">
      <FontAwesomeIcon icon={faPlus} className="mr-1" />
      Add Company Traction
    </div>
    <div
      className="pure-green-btn cursor-pointer"
      onClick={() => setShowCompleted(!showCompleted)}
    >
      {showCompleted ? 'Hide Completed Rows' : 'Show All Rows'}
    </div>
    <div className="pure-gray-btn cursor-pointer">
      <FontAwesomeIcon icon={faSyncAlt} />
    </div>
  </div>
</div>




        {/* <div className="flex gap-2">
          <button className="pure-blue-btn">
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            Add Company Traction
          </button>
          <button
            className="pure-green-btn"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? 'Hide Completed Rows' : 'Show All Rows'}
          </button>
          <button className="pure-gray-btn">
            <FontAwesomeIcon icon={faSyncAlt} />
          </button>
        </div>
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border px-4 py-2">
                Who
                <select className="block w-full mt-1 text-xs">
                  <option>All</option>
                </select>
              </th>
              <th className="border px-4 py-2">Collaborator</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Progress</th>
              <th className="border px-4 py-2">Annual Priority</th>
              <th className="border px-4 py-2">Due Date</th>
              <th className="border px-4 py-2">Rank</th>
              <th className="border px-4 py-2">Comments</th>
              <th className="border px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <tr key={row.id}>
                  <td className="border px-4 py-2">
                    <select className="w-full text-xs">
                      <option>{row.who}</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <select className="w-full text-xs">
                      <option>{row.collaborator}</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">{row.description}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`progress-chip ${
                        row.progress === '0%' ? 'bg-red-100 text-red-700' : ''
                      }`}
                    >
                      {row.progress}
                    </span>
                  </td>
                  <td className="border px-4 py-2">{row.annualPriority}</td>
                  <td className="border px-4 py-2">{row.dueDate}</td>
                  <td className="border px-4 py-2 text-center">{row.rank}</td>
                  <td className="border px-4 py-2 text-center">
                    <FontAwesomeIcon icon={faCommentDots} className="text-gray-600 cursor-pointer" />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <FontAwesomeIcon icon={faTrashAlt} className="text-red-600 cursor-pointer" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center p-4 text-gray-500" colSpan="9">
                  No data available for {activeQuarter}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyTraction;

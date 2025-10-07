import GrowthGoals from './pages/GrowthGoals/GrowthGoals';
import KeyThrustStrategicDrivers from './pages/KeyThrustStrategicDrivers/KeyThrustStrategicDrivers';
import StrategicAlignments from './pages/StrategicAlignments/StrategicAlignments';
import AnnualPriorities from './pages/AnnualPriorities/AnnualPriorities';
import CoreValues from './pages/CoreValues/CoreValues';
import FoundationalDocuments from './pages/FoundationalDocuments/FoundationalDocuments';
import WinStrategies from './pages/WinStrategies/WinStrategies';
import MonthlyMeetings from './pages/MonthlyMeetings/MonthlyMeetings';
import QuarterlyMeetings from './pages/QuarterlyMeetings/QuarterlyMeetings';
import Companies from './pages/Companies/Companies'
import Roles from './pages/Roles/Roles';
import TableHeaders from './pages/TableHeaders/TableHeaders';

export default function AdminPanelContent({ selectedItem }) {
  return (
    <main className="p-4 overflow-auto flex-grow bg-gray-50 dark:bg-gray-900">
      {selectedItem === 'Growth Goals' && <GrowthGoals />}
      {selectedItem === 'Key Thrust Strategic Drivers' && <KeyThrustStrategicDrivers />}
      {selectedItem === 'Strategic Alignments' && <StrategicAlignments />}
      {selectedItem === 'Annual Priorities' && <AnnualPriorities />}
      {selectedItem === 'Core Values' && <CoreValues />}
      {selectedItem === 'Foundational Documents' && <FoundationalDocuments />}
      {selectedItem === 'Win Strategies' && <WinStrategies />}
      {selectedItem === 'Monthly Meetings' && <MonthlyMeetings />}
      {selectedItem === 'Quarterly Meetings' && <QuarterlyMeetings />}
      {selectedItem === 'Companies' && <Companies />}
      {selectedItem === 'Roles' && <Roles />}
      {selectedItem === 'Table Headers' && <TableHeaders />}
      
      {/* Fallback view */}
      {selectedItem !== 'Growth Goals' && 
       selectedItem !== 'Key Thrust Strategic Drivers' && 
       selectedItem !== 'Strategic Alignments' &&
       selectedItem !== 'Annual Priorities' && 
       selectedItem !== 'Core Values' && 
       selectedItem !== 'Foundational Documents' && 
       selectedItem !== 'Win Strategies' && 
       selectedItem !== 'Monthly Meetings' && 
       selectedItem !== 'Quarterly Meetings' &&
       selectedItem !== 'Companies' && 
       selectedItem !== 'Roles' && 
       selectedItem !== 'Table Headers' && 
      (
        <>
          <h1 className="text-2xl font-semibold mb-4">{selectedItem}</h1>
          <p className="text-gray-700 dark:text-gray-300">
            This is a mockup content area for <strong>{selectedItem}</strong>.
          </p>
        </>
      )}
    </main>
  );
}

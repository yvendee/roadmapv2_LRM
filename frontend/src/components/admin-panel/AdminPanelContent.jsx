import GrowthGoals from './pages/GrowthGoals/GrowthGoals';
import KeyThrustStrategicDrivers from './pages/KeyThrustStrategicDrivers/KeyThrustStrategicDrivers';
import StrategicAlignments from './pages/StrategicAlignments/StrategicAlignments';
import AnnualPriorities from './pages/AnnualPriorities/AnnualPriorities';

export default function AdminPanelContent({ selectedItem }) {
  return (
    <main className="p-4 overflow-auto flex-grow bg-gray-50 dark:bg-gray-900">
      {selectedItem === 'Growth Goals' && <GrowthGoals />}
      {selectedItem === 'Key Thrust Strategic Drivers' && <KeyThrustStrategicDrivers />}
      {selectedItem === 'Strategic Alignments' && <StrategicAlignments />}
      {selectedItem === 'Annual Priorities' && <AnnualPriorities />}
      
      {/* Fallback view */}
      {selectedItem !== 'Growth Goals' && 
       selectedItem !== 'Key Thrust Strategic Drivers' && 
       selectedItem !== 'Strategic Alignments' &&
       selectedItem !== 'Annual Priorities' && 
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

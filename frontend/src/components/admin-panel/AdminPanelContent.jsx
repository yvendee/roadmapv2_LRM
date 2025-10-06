import GrowthGoals from './pages/GrowthGoals/GrowthGoals';
import KeyThrustStrategicDrivers from './pages/KeyThrustStrategicDrivers/KeyThrustStrategicDrivers';

export default function AdminPanelContent({ selectedItem }) {
  return (
    <main className="p-4 overflow-auto flex-grow bg-gray-50 dark:bg-gray-900">
      {selectedItem === 'Growth Goals' && <GrowthGoals />}
      {selectedItem === 'Key Thrust Strategic Drivers' && <KeyThrustStrategicDrivers />}
      
      {/* Fallback view */}
      {selectedItem !== 'Growth Goals' && selectedItem !== 'Key Thrust Strategic Drivers' && (
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

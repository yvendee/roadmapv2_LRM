// frontend/src/components/admin-panel/AdminPanelContent.jsx
import React from 'react';
import GrowthGoals from './pages/GrowthGoals/GrowthGoals';

export default function AdminPanelContent({ selectedItem }) {
  return (
    <main className="p-4 overflow-auto flex-grow bg-gray-50 dark:bg-gray-900">
      {selectedItem === 'Growth Goals' ? (
        <GrowthGoals />
      ) : (
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

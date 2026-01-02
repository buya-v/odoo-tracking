import React from 'react';
import { Header } from './components/Header';
import { BatchKanban } from './components/BatchKanban';
import { BarcodeInterface } from './components/BarcodeInterface';
import { FeedbackToast } from './components/FeedbackToast';
import { useInventoryStore } from './store/useInventoryStore';

const App: React.FC = () => {
  const { currentMode } = useInventoryStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 overflow-y-auto relative">
        {currentMode === 'batch' ? (
          <BatchKanban />
        ) : (
          <BarcodeInterface />
        )}
      </main>

      <FeedbackToast />
    </div>
  );
};

export default App;
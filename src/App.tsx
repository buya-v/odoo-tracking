import React, { useEffect } from 'react';
import { useInventoryStore } from './store/useInventoryStore';
import { Header } from './components/Header';
import { BarcodeInput } from './components/BarcodeInput';
import { PickingList } from './components/PickingList';
import { ErrorModal } from './components/ErrorModal';

function App() {
  const { activeBatch, loadBatch, processScan, error, clearError } = useInventoryStore();

  useEffect(() => {
    loadBatch();
  }, [loadBatch]);

  const handleScan = (barcode: string) => {
    console.log(`Processing scan for: ${barcode}`);
    processScan(barcode);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
      <Header batch={activeBatch} onSync={() => window.location.reload()} />
      
      <main className="flex-1 overflow-y-auto flex flex-col">
        <BarcodeInput onScan={handleScan} isProcessing={!!error} />
        
        <div className="flex-1 bg-gray-50">
          <PickingList batch={activeBatch} />
        </div>
      </main>

      {/* Sticky footer action (Standard Odoo Mobile pattern) */}
      <div className="bg-white p-4 border-t border-gray-200 sticky bottom-0">
        <button 
          className="w-full bg-odoo-teal text-white font-bold py-4 rounded-lg shadow-lg active:scale-95 transition-transform uppercase tracking-wider"
          disabled={!activeBatch}
        >
          Validate Batch
        </button>
      </div>

      {/* Global Error Handler Overlay */}
      <ErrorModal message={error} onClose={clearError} />
    </div>
  );
}

export default App;
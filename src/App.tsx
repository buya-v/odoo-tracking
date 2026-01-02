import React, { useState } from 'react';
import { useInventoryStore } from './store/inventoryStore';
import { AdvBarcodeStatus } from './components/AdvBarcodeStatus';
import { BatchProgressCard } from './components/BatchProgressCard';
import { SyncIssueWidget } from './components/SyncIssueWidget';
import { ScanBarcode, Map, CheckSquare, Search } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const { 
    activeBatch, 
    processBarcode, 
    toggleSortOptimization, 
    forceValidateBatch 
  } = useInventoryStore();
  
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim() || isProcessing) return;
    
    setIsProcessing(true);
    await processBarcode(barcodeInput);
    setBarcodeInput('');
    setIsProcessing(false);
  };

  const isBatchComplete = activeBatch?.lines.every(l => l.qty_done >= l.qty_demand);

  return (
    <div className="min-h-screen pb-20">
      <AdvBarcodeStatus />
      
      {/* Mobile Header */}
      <header className="bg-indigo-900 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="font-bold text-lg tracking-tight">Odoo Inventory Pro <span className="opacity-50 text-sm font-normal">v18.3</span></h1>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="Online" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        
        {/* Batch Status */}
        {activeBatch ? (
          <BatchProgressCard lines={activeBatch.lines} batchName={activeBatch.name} />
        ) : (
          <div className="p-8 text-center text-gray-500">No Active Batch</div>
        )}

        {/* Scanner Input Simulation */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
           <form onSubmit={handleScan} className="flex gap-2">
              <div className="relative flex-1">
                <ScanBarcode className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="text" 
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Scan Product Barcode..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                disabled={isProcessing}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center"
              >
                {isProcessing ? '...' : <Search size={20} />}
              </button>
           </form>
           <div className="mt-2 flex gap-2 overflow-x-auto">
             {/* Quick Actions for Demo */}
             <button onClick={() => processBarcode('9780123456789')} className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-300 hover:bg-gray-200">Scan Valid</button>
             <button onClick={() => processBarcode('0000000000000')} className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-300 hover:bg-gray-200">Scan Invalid</button>
             <button onClick={() => processBarcode('9780123456789')} className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-300 hover:bg-gray-200">Over-Pick</button>
           </div>
        </div>

        {/* Picking Lines */}
        {activeBatch && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-700">Pick List</h3>
              <button 
                onClick={toggleSortOptimization}
                className={clsx(
                  "text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors",
                  activeBatch.path_optimized 
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Map size={14} />
                {activeBatch.path_optimized ? 'Optimal Path' : 'Standard Sort'}
              </button>
            </div>

            {activeBatch.lines.map((line) => (
              <div 
                key={line.id} 
                className={clsx(
                  "bg-white p-4 rounded-lg border flex justify-between items-center transition-all",
                  line.qty_done >= line.qty_demand 
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200"
                )}
              >
                <div>
                  <p className="font-bold text-gray-800">{line.product_id.name}</p>
                  <p className="text-xs font-mono text-gray-500 mt-1">LOC: {line.location_dest}</p>
                  <p className="text-xs font-mono text-gray-400">BC: {line.product_id.barcode}</p>
                </div>
                <div className="text-right">
                   <span className={clsx(
                     "text-2xl font-bold",
                     line.qty_done >= line.qty_demand ? "text-green-600" : "text-gray-800"
                   )}>
                     {line.qty_done}
                   </span>
                   <span className="text-sm text-gray-400 font-medium"> / {line.qty_demand}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <SyncIssueWidget />

      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={forceValidateBatch}
            disabled={!isBatchComplete && !confirm('Force validate partial batch?')}
            className={clsx(
              "w-full py-3 rounded-xl font-bold text-lg flex justify-center items-center gap-2 shadow-sm transition-all",
              isBatchComplete 
                ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-md"
                : "bg-gray-100 text-gray-400"
            )}
          >
            <CheckSquare />
            Validate Batch
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
import React, { useState, useRef, useEffect } from 'react';
import { Scan, ArrowRight } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { useHaptic } from '../hooks/useHaptic';

export const BarcodeInterface: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { processScan, setMode, feedback } = useInventoryStore();
  const { triggerError, triggerSuccess } = useHaptic();
  const [processing, setProcessing] = useState(false);

  // Auto-focus logic for scanners
  useEffect(() => {
    const focusInterval = setInterval(() => {
      if (document.activeElement !== inputRef.current && !feedback.type) {
        inputRef.current?.focus();
      }
    }, 1000);
    return () => clearInterval(focusInterval);
  }, [feedback]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || processing) return;

    setProcessing(true);
    try {
      await processScan(inputVal);
      // Check updated store state for feedback type to trigger haptic
      // Note: In a real app we might check the result directly, but here we simulate based on store updates
      if (inputVal === 'ERROR_SYS' || inputVal === 'ERROR_WF') {
        triggerError();
      } else {
        triggerSuccess();
      }
      setInputVal('');
    } catch (e) {
      triggerError();
    } finally {
      setProcessing(false);
      // Refocus immediately for next scan
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-full p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Scan Station</h2>
        <button 
          onClick={() => setMode('batch')}
          className="text-adv-primary font-semibold hover:underline"
        >
          Back to Batches
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <form onSubmit={handleScan} className="relative">
          <Scan className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-adv-primary focus:ring-0 outline-none transition-colors"
            placeholder="Scan Barcode..."
            autoComplete="off"
            disabled={processing}
            autoFocus
          />
          <button 
            type="submit"
            disabled={!inputVal || processing}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-adv-primary text-white p-2 rounded-md disabled:opacity-50"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Try: '123' (Success), 'ERROR_WF' (Warning), 'ERROR_SYS' (System Error)
        </p>
      </div>

      <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
        <Scan className="w-16 h-16 mb-2 opacity-20" />
        <p>Waiting for scan...</p>
      </div>
    </div>
  );
};

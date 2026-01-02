import React, { useState, useRef, useEffect } from 'react';
import { Scan } from 'lucide-react';

interface BarcodeInputProps {
  onScan: (barcode: string) => void;
  isProcessing: boolean;
}

export const BarcodeInput: React.FC<BarcodeInputProps> = ({ onScan, isProcessing }) => {
  const [val, setVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus logic to mimic handheld scanner behavior
  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    focusInput();
    window.addEventListener('click', focusInput);
    return () => window.removeEventListener('click', focusInput);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val.trim() && !isProcessing) {
      onScan(val.trim());
      setVal('');
    }
  };

  return (
    <div className="p-4 bg-white border-b border-gray-200 sticky top-[72px] z-20">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          disabled={isProcessing}
          className="w-full bg-gray-50 border-2 border-gray-300 text-gray-900 text-lg rounded-lg focus:border-odoo-teal focus:ring-odoo-teal block w-full pl-12 p-3 scan-input disabled:opacity-50 transition-all"
          placeholder="Scan barcode (Express Mode)..."
          autoComplete="off"
          data-testid="barcode-input"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Scan className="w-6 h-6 text-gray-400" />
        </div>
        <button 
          type="submit"
          className="absolute inset-y-1 right-1 bg-odoo-teal text-white px-4 rounded-md font-medium text-sm hover:bg-teal-700 transition-colors"
        >
          ENTER
        </button>
      </form>
    </div>
  );
};
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorModalProps {
  message: string | null;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" data-testid="error-modal">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-odoo-red p-4 flex items-center justify-between">
          <div className="flex items-center text-white space-x-2">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="font-bold text-lg">Critical Scan Error</h3>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-800 text-lg font-medium mb-4">
            {message}
          </p>
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold min-h-[48px] w-full"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
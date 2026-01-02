import React from 'react';
import { Box, RefreshCw, Wifi } from 'lucide-react';
import { PickingBatch } from '../types';

interface HeaderProps {
  batch: PickingBatch | null;
  onSync: () => void;
}

export const Header: React.FC<HeaderProps> = ({ batch, onSync }) => {
  return (
    <header className="bg-odoo-teal text-white p-4 shadow-md sticky top-0 z-30">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">
              {batch ? batch.name : 'Loading...'}
            </h1>
            <p className="text-xs text-odoo-teal-100 opacity-90">
              {batch ? batch.company_name : 'No Company'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
             onClick={onSync}
             className="p-2 hover:bg-white/10 rounded-full transition-colors"
             aria-label="Sync"
          >
             <RefreshCw className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded text-xs font-mono">
            <Wifi className="w-3 h-3" />
            <span>ONLINE</span>
          </div>
        </div>
      </div>
    </header>
  );
};
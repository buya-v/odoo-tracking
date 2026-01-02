import React from 'react';
import { Menu, Wifi, Battery } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-odoo-teal text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button className="p-1 hover:bg-white/10 rounded">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg tracking-tight">Odoo Inventory</h1>
      </div>
      <div className="flex items-center gap-4 text-sm font-medium">
        <div className="flex items-center gap-1">
          <Wifi className="w-4 h-4" />
          <span className="hidden sm:inline">Connected</span>
        </div>
        <div className="flex items-center gap-1 opacity-90">
          <Battery className="w-4 h-4" />
          <span className="hidden sm:inline">98%</span>
        </div>
        <div className="bg-odoo-dark/20 px-2 py-1 rounded text-xs">
          WH/STOCK
        </div>
      </div>
    </header>
  );
};
import React from 'react';
import { Activity, Menu, Wifi, WifiOff } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { clsx } from 'clsx';

export const Header: React.FC = () => {
  const { syncStatus, retrySync } = useInventoryStore();

  return (
    <header className="bg-adv-primary text-white p-4 flex justify-between items-center shadow-md h-16">
      <div className="flex items-center space-x-3">
        <button className="p-1 hover:bg-white/10 rounded">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg tracking-wide">Odoo Inventory</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-black/20 px-3 py-1 rounded-full">
          {syncStatus === 'syncing' ? (
            <Activity className="w-4 h-4 animate-pulse text-adv-warning" />
          ) : syncStatus === 'connected' ? (
            <div className="w-2 h-2 rounded-full bg-adv-success shadow-[0_0_8px_#28a745]" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-adv-error" />
          )}
          <span className="text-xs font-mono uppercase">{syncStatus}</span>
        </div>

        <button 
          onClick={retrySync}
          className={clsx(
            "p-2 rounded-full transition-colors",
            syncStatus === 'error' ? "bg-adv-error hover:bg-red-700" : "hover:bg-white/10"
          )}
          aria-label="Sync Status"
        >
          {syncStatus === 'connected' ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
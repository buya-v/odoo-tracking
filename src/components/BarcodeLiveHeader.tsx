import React from 'react';
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';

export const BarcodeLiveHeader: React.FC = () => {
  const { syncStatus, triggerSync } = useStore();

  const statusConfig = {
    online: { icon: Wifi, text: 'Online', color: 'text-adv-success', bg: 'bg-green-100' },
    offline: { icon: WifiOff, text: 'Offline', color: 'text-gray-500', bg: 'bg-gray-200' },
    syncing: { icon: RefreshCw, text: 'Syncing...', color: 'text-adv-primary', bg: 'bg-purple-100', animate: true },
    error: { icon: AlertTriangle, text: 'Sync Error', color: 'text-adv-danger', bg: 'bg-red-100' },
  };

  const current = statusConfig[syncStatus];
  const Icon = current.icon;

  return (
    <div className="bg-white border-b border-gray-200 p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Scanner Status</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono text-adv-primary font-bold">ZEBRA-TC52</span>
          <span className="h-2 w-2 rounded-full bg-adv-success animate-pulse"></span>
        </div>
      </div>

      <button 
        onClick={() => triggerSync()}
        disabled={syncStatus === 'syncing'}
        className={clsx(
          "flex items-center gap-2 px-3 py-2 rounded-full transition-all",
          current.bg, 
          current.color
        )}
      >
        <Icon className={clsx("w-5 h-5", current.animate && "animate-spin")} />
        <span className="font-bold text-sm">{current.text}</span>
      </button>
    </div>
  );
};

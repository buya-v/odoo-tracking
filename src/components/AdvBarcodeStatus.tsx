import React, { useEffect, useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import clsx from 'clsx';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export const AdvBarcodeStatus: React.FC = () => {
  const lastScan = useInventoryStore((state) => state.lastScanResult);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lastScan) {
      setVisible(true);
      
      // Haptic Feedback for Mobile
      if (lastScan.type === 'success') {
        // Short success vibration
        if (navigator.vibrate) navigator.vibrate(50);
      } else {
        // Error double vibration
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      }

      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastScan]);

  if (!visible || !lastScan) return null;

  const styles = {
    success: 'bg-adv-success text-white',
    business: 'bg-adv-warning text-black',
    critical: 'bg-adv-error text-white',
  };

  return (
    <div 
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 p-4 shadow-lg transition-transform duration-300 ease-in-out flex items-center gap-3',
        styles[lastScan.type],
        visible ? 'translate-y-0' : '-translate-y-full'
      )}
      data-testid="barcode-status"
    >
      {lastScan.type === 'success' && <CheckCircle className="w-6 h-6" />}
      {lastScan.type === 'business' && <AlertCircle className="w-6 h-6" />}
      {lastScan.type === 'critical' && <XCircle className="w-6 h-6" />}
      
      <div className="flex-1">
        <p className="font-bold font-mono text-sm uppercase tracking-wide">{lastScan.type}</p>
        <p className="text-sm font-medium">{lastScan.message}</p>
      </div>
    </div>
  );
};
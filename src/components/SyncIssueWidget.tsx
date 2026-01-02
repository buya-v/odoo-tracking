import React from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { AlertTriangle, Check, RefreshCw } from 'lucide-react';

export const SyncIssueWidget: React.FC = () => {
  const logs = useInventoryStore(state => state.syncLogs);
  const failedLogs = logs.filter(l => l.status === 'failed');

  if (logs.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <h4 className="font-bold text-sm text-gray-700">Inter-Company Sync (ICS)</h4>
        {failedLogs.length > 0 ? (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
            <AlertTriangle size={12} /> {failedLogs.length} Errors
          </span>
        ) : (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
            <Check size={12} /> Synced
          </span>
        )}
      </div>
      <div className="max-h-48 overflow-y-auto p-2 space-y-2">
        {logs.map(log => (
          <div key={log.id} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0">
             <div className="mt-1">
                {log.status === 'success' && <Check className="text-adv-success w-4 h-4" />}
                {log.status === 'failed' && <AlertTriangle className="text-adv-error w-4 h-4" />}
                {log.status === 'pending' && <RefreshCw className="text-gray-400 w-4 h-4 animate-spin" />}
             </div>
             <div className="flex-1">
                <div className="flex justify-between">
                   <span className="font-mono text-xs text-gray-500">{log.timestamp}</span>
                   <span className="text-xs font-semibold">{log.company_source} &rarr; {log.company_dest}</span>
                </div>
                {log.error_message && (
                  <p className="text-adv-error text-xs mt-1 font-medium">{log.error_message}</p>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
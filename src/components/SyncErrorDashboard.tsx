import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { AlertTriangle, XCircle, RefreshCw, ChevronDown, ChevronRight, Terminal } from 'lucide-react';

export const SyncErrorDashboard: React.FC = () => {
  const { logs, retryAllLogs } = useStore();
  const [expandedLog, setExpandedLog] = useState<number | null>(null);

  return (
    <div className="p-4 h-full bg-adv-surface">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-adv-primary">Sync Error Dashboard</h2>
          <p className="text-gray-500">Monitor inter-company synchronization failures</p>
        </div>
        <button 
          onClick={retryAllLogs}
          className="bg-adv-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 active:scale-95 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Retry All
        </button>
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-lg border border-dashed border-gray-300">
            <div className="flex justify-center mb-2">
              <RefreshCw className="w-12 h-12 text-gray-200" />
            </div>
            <p>No sync errors found. System healthy.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-white rounded-lg border border-l-4 border-l-adv-danger shadow-sm overflow-hidden">
              <div 
                className="p-4 flex items-start justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-adv-danger mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-800">{log.name}</h3>
                    <div className="text-sm text-gray-500 mt-1 flex gap-4">
                      <span>Model: <code className="bg-gray-100 px-1 rounded">{log.model_name}</code></span>
                      <span>ID: {log.res_id}</span>
                      <span>{log.create_date}</span>
                    </div>
                  </div>
                </div>
                {expandedLog === log.id ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
              </div>
              
              {expandedLog === log.id && (
                <div className="bg-gray-900 p-4 overflow-x-auto border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-400 mb-2 text-xs uppercase tracking-wider">
                    <Terminal className="w-4 h-4" />
                    Traceback
                  </div>
                  <pre className="text-red-300 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                    {log.traceback}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
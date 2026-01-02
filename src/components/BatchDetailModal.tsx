import React from 'react';
import { useStore } from '../store/useStore';
import { X, CheckCircle, Package } from 'lucide-react';

export const BatchDetailModal: React.FC = () => {
  const { batches, selectedBatchId, selectBatch } = useStore();
  const batch = batches.find(b => b.id === selectedBatchId);

  if (!batch) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-adv-surface">
          <div>
             <h2 className="text-xl font-bold text-adv-primary">{batch.name}</h2>
             <p className="text-sm text-gray-500">{batch.item_count} items to process</p>
          </div>
          <button 
            onClick={() => selectBatch(null)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
           <div className="flex justify-center py-8">
              <div className="text-center">
                 <Package className="w-16 h-16 text-adv-primary mx-auto mb-4 opacity-20" />
                 <p className="text-lg text-gray-600">Scan items to begin processing...</p>
                 <p className="text-sm text-gray-400 mt-2">Use handheld scanner or manual entry</p>
              </div>
           </div>
           
           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-yellow-800 text-sm mb-1">Instruction</h4>
              <p className="text-yellow-700 text-sm">Scan location barcode first, then product barcode.</p>
           </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
           <button 
             onClick={() => selectBatch(null)}
             className="w-full bg-adv-primary text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90 active:scale-[0.98] transition-all"
           >
             <CheckCircle className="w-5 h-5" />
             Complete Batch
           </button>
        </div>

      </div>
    </div>
  );
};
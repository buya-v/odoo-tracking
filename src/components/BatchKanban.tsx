import React from 'react';
import { Package, MapPin, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { useInventoryStore, Batch } from '../store/useInventoryStore';

export const BatchKanban: React.FC = () => {
  const { batches, setMode } = useInventoryStore();

  return (
    <div className="p-4 pb-24 max-w-md mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">My Batches</h2>
        <span className="bg-adv-primary/10 text-adv-primary px-3 py-1 rounded-full text-sm font-medium">
          {batches.length} Active
        </span>
      </div>

      <div className="space-y-3">
        {batches.map((batch) => (
          <BatchCard key={batch.id} batch={batch} onClick={() => setMode('scanner')} />
        ))}
      </div>
    </div>
  );
};

interface BatchCardProps {
  batch: Batch;
  onClick: () => void;
}

const BatchCard: React.FC<BatchCardProps> = ({ batch, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 active:scale-[0.98] transition-transform cursor-pointer hover:shadow-md"
      role="button"
      aria-label={`Open batch ${batch.name}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-gray-900">{batch.name}</h3>
        <span className={clsx(
          "px-2 py-0.5 rounded text-xs uppercase font-bold",
          batch.status === 'done' ? "bg-green-100 text-green-800" :
          batch.status === 'in_progress' ? "bg-blue-100 text-blue-800" :
          "bg-gray-100 text-gray-800"
        )}>
          {batch.status.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-center text-sm text-gray-600 mb-3">
        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
        {batch.location}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex items-center text-sm font-medium text-gray-700">
          <Package className="w-4 h-4 mr-1.5 text-adv-primary" />
          {batch.lines} Ops
        </div>
        {batch.priority === 'urgent' && (
          <div className="flex items-center text-xs font-bold text-adv-error">
            <Clock className="w-3 h-3 mr-1" />
            URGENT
          </div>
        )}
      </div>
    </div>
  );
};
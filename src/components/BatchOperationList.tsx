import React from 'react';
import { useStore } from '../store/useStore';
import { Package, User, Calendar, ArrowRight } from 'lucide-react';

export const BatchOperationList: React.FC = () => {
  const { batches, selectBatch } = useStore();

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-bold text-adv-primary mb-4">Active Batches</h2>
      
      {batches.map((batch) => (
        <div 
          key={batch.id}
          className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden active:scale-[0.99] transition-transform duration-100 cursor-pointer"
          onClick={() => selectBatch(batch.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && selectBatch(batch.id)}
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-adv-primary font-bold text-lg flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  {batch.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                  <User className="w-4 h-4" />
                  {batch.user_name}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                batch.state === 'done' ? 'bg-green-100 text-adv-success' : 
                batch.state === 'in_progress' ? 'bg-blue-100 text-blue-600' : 
                'bg-gray-100 text-gray-600'
              }`}>
                {batch.state.replace('_', ' ')}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Calendar className="w-3 h-3" />
                {batch.scheduled_date}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                   <span className="block text-xs text-gray-500">Progress</span>
                   <span className="font-mono font-bold text-adv-primary">
                     {batch.processed_count} / {batch.item_count}
                   </span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-adv-primary transition-colors" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-1.5 mt-3 rounded-full overflow-hidden">
              <div 
                className="bg-adv-success h-full transition-all duration-500"
                style={{ width: `${(batch.processed_count / batch.item_count) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
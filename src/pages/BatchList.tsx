import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventoryStore } from '../store/inventoryStore';
import { BatchCard } from '../components/batch/BatchCard';
import { ChevronLeft } from 'lucide-react';

export const BatchList: React.FC = () => {
  const { batches, setActiveBatch } = useInventoryStore();
  const navigate = useNavigate();

  const handleSelectBatch = (id: number) => {
    setActiveBatch(id);
    navigate(`/scanner/${id}`);
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-6">
         <button 
           onClick={() => navigate('/')}
           className="p-2 hover:bg-gray-200 rounded-full"
         >
           <ChevronLeft className="w-6 h-6 text-gray-600" />
         </button>
         <h2 className="text-2xl font-bold text-gray-800">Active Batches</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {batches.map(batch => (
          <BatchCard 
            key={batch.id} 
            batch={batch} 
            onClick={() => handleSelectBatch(batch.id)} 
          />
        ))}
      </div>
    </div>
  );
};
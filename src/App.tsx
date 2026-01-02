import React from 'react';
import { BarcodeLiveHeader } from './components/BarcodeLiveHeader';
import { BatchOperationList } from './components/BatchOperationList';
import { SyncErrorDashboard } from './components/SyncErrorDashboard';
import { BatchDetailModal } from './components/BatchDetailModal';
import { useStore } from './store/useStore';
import { LayoutDashboard, List } from 'lucide-react';

function App() {
  const { viewMode, toggleView, selectedBatchId } = useStore();

  return (
    <div className="min-h-screen bg-adv-surface font-sans text-gray-900">
      {/* Sticky Header */}
      <BarcodeLiveHeader />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto pb-20">
        <div className="flex justify-end p-4">
          <button 
            onClick={toggleView}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white px-3 py-1.5 rounded-lg border shadow-sm hover:bg-gray-50"
          >
             {viewMode === 'list' ? (
               <> <LayoutDashboard className="w-4 h-4" /> Admin Dashboard </>
             ) : (
               <> <List className="w-4 h-4" /> Batch List </>
             )}
          </button>
        </div>

        {viewMode === 'list' ? <BatchOperationList /> : <SyncErrorDashboard />}
      </main>

      {/* Modals */}
      {selectedBatchId && <BatchDetailModal />}
    </div>
  );
}

export default App;
import { create } from 'zustand';
import { AppState, BatchOperation, TrackLog } from '../types';
import { format } from 'date-fns';

const MOCK_BATCHES: BatchOperation[] = [
  { id: 1, name: 'BATCH/2023/001', state: 'in_progress', user_id: 1, user_name: 'Mitchell Admin', scheduled_date: '2023-10-01 08:00:00', item_count: 50, processed_count: 12 },
  { id: 2, name: 'BATCH/2023/003', state: 'draft', user_id: 2, user_name: 'Marc Demo', scheduled_date: '2023-10-02 09:30:00', item_count: 120, processed_count: 0 },
  { id: 3, name: 'BATCH/2023/005', state: 'done', user_id: 1, user_name: 'Mitchell Admin', scheduled_date: '2023-09-28 14:00:00', item_count: 45, processed_count: 45 },
];

const MOCK_LOGS: TrackLog[] = [
  { id: 101, name: 'Error in _sync_stock_quant', model_name: 'stock.quant', res_id: 55, traceback: 'ConnectionTimeout: Remote server did not respond after 3000ms', user_id: 1, create_date: '2023-10-01 10:15:00' }
];

export const useStore = create<AppState>((set, get) => ({
  batches: MOCK_BATCHES,
  logs: MOCK_LOGS,
  syncStatus: 'online',
  selectedBatchId: null,
  viewMode: 'list',

  setSyncStatus: (status) => set({ syncStatus: status }),
  
  selectBatch: (id) => set({ selectedBatchId: id }),

  toggleView: () => set((state) => ({ viewMode: state.viewMode === 'list' ? 'dashboard' : 'list' })),

  addLog: (logData) => {
    const newLog: TrackLog = {
      ...logData,
      id: Math.random(),
      create_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    };
    set((state) => ({ logs: [newLog, ...state.logs] }));
  },

  triggerSync: async () => {
    const { setSyncStatus, addLog } = get();
    setSyncStatus('syncing');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Random failure simulation to demonstrate Error Logging Pattern
    const shouldFail = Math.random() > 0.6;
    
    if (shouldFail) {
      setSyncStatus('error');
      addLog({
        name: 'Error in sync_inter_company_moves',
        model_name: 'adv_inventory.sync',
        res_id: 0,
        user_id: 1,
        traceback: 'ValueError: Mismatch in stock.move state.\n   at /models/sync.py:45 in sync_moves\n   at /models/core.py:12 in _run_scheduler',
      });
    } else {
      setSyncStatus('online');
    }
  },

  retryAllLogs: () => {
    // Simulate clearing logs/retrying
    set((state) => ({
      logs: [],
      syncStatus: 'online'
    }));
  }
}));
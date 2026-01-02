import { create } from 'zustand';

export interface Batch {
  id: number;
  name: string;
  status: 'draft' | 'in_progress' | 'done';
  lines: number;
  priority: 'normal' | 'urgent';
  location: string;
}

export interface Log {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success';
}

interface InventoryState {
  syncStatus: 'connected' | 'syncing' | 'error';
  currentMode: 'scanner' | 'batch';
  lastScannedCode: string | null;
  feedback: {
    message: string;
    type: 'system' | 'workflow' | 'success' | null;
  };
  batches: Batch[];
  logs: Log[];
  
  // Actions
  setMode: (mode: 'scanner' | 'batch') => void;
  processScan: (barcode: string) => Promise<void>;
  clearFeedback: () => void;
  retrySync: () => void;
}

// Mock Data
const INITIAL_BATCHES: Batch[] = [
  { id: 101, name: 'BATCH/2023/001', status: 'in_progress', lines: 12, priority: 'urgent', location: 'WH/Stock/Zone A' },
  { id: 102, name: 'BATCH/2023/002', status: 'draft', lines: 45, priority: 'normal', location: 'WH/Stock/Zone C' },
  { id: 103, name: 'BATCH/2023/003', status: 'done', lines: 8, priority: 'normal', location: 'WH/Out' },
];

export const useInventoryStore = create<InventoryState>((set, get) => ({
  syncStatus: 'connected',
  currentMode: 'batch',
  lastScannedCode: null,
  feedback: { message: '', type: null },
  batches: INITIAL_BATCHES,
  logs: [],

  setMode: (mode) => set({ currentMode: mode }),

  clearFeedback: () => set({ feedback: { message: '', type: null } }),

  retrySync: () => {
    set({ syncStatus: 'syncing' });
    setTimeout(() => set({ syncStatus: 'connected' }), 1000);
  },

  processScan: async (barcode: string) => {
    set({ syncStatus: 'syncing', lastScannedCode: barcode });
    
    // Simulate Network Latency (200ms)
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Logic: Check-then-Commit Pattern Simulation
    if (barcode === 'ERROR_SYS') {
      set({
        syncStatus: 'error',
        feedback: { message: 'Connection timed out. Check server logs.', type: 'system' },
        logs: [...get().logs, { id: Date.now().toString(), timestamp: new Date(), message: 'API Gateway Timeout', type: 'error' }]
      });
      throw new Error('System Error'); // For component catch block if needed
    } else if (barcode === 'ERROR_WF') {
      set({
        syncStatus: 'connected',
        feedback: { message: 'Product not found in current batch.', type: 'workflow' },
      });
    } else {
      // Success
      set({
        syncStatus: 'connected',
        feedback: { message: `Scanned ${barcode} successfully.`, type: 'success' },
        logs: [...get().logs, { id: Date.now().toString(), timestamp: new Date(), message: `Processed ${barcode}`, type: 'success' }]
      });
    }
  },
}));
import { create } from 'zustand';
import { PickingBatch, ScanResult, SyncLog } from '../types/odoo';

interface InventoryState {
  activeBatch: PickingBatch | null;
  syncLogs: SyncLog[];
  lastScanResult: ScanResult | null;
  
  // Actions
  setActiveBatch: (batchId: number) => void;
  processBarcode: (barcode: string) => Promise<ScanResult>;
  forceValidateBatch: () => void;
  toggleSortOptimization: () => void;
}

// Mock Data
const MOCK_PRODUCTS = [
  { id: 1, name: 'Acoustic Bloc Screen', barcode: '9780123456789', default_code: 'FURN_6666' },
  { id: 2, name: 'Corner Desk Right Sit', barcode: '0123456789012', default_code: 'FURN_7777' },
  { id: 3, name: 'Large Cabinet', barcode: '1234567890123', default_code: 'FURN_8888' },
];

const MOCK_BATCH: PickingBatch = {
  id: 101,
  name: 'BATCH/2023/001',
  state: 'in_progress',
  user_id: 1,
  path_optimized: false,
  lines: [
    { id: 1, product_id: MOCK_PRODUCTS[0], qty_done: 0, qty_demand: 5, location_dest: 'WH/STOCK/ROW-3/SHELF-1', state: 'assigned' },
    { id: 2, product_id: MOCK_PRODUCTS[1], qty_done: 1, qty_demand: 2, location_dest: 'WH/STOCK/ROW-1/SHELF-2', state: 'assigned' },
    { id: 3, product_id: MOCK_PRODUCTS[2], qty_done: 0, qty_demand: 1, location_dest: 'WH/STOCK/ROW-2/SHELF-5', state: 'assigned' },
  ]
};

const MOCK_LOGS: SyncLog[] = [
  { id: 1, timestamp: '2023-10-27 10:00:01', company_source: 'US-West', company_dest: 'US-East', status: 'success', payload: '{ move: 101 }' },
  { id: 2, timestamp: '2023-10-27 10:05:22', company_source: 'US-West', company_dest: 'EU-Central', status: 'failed', payload: '{ move: 102 }', error_message: 'Connection Timeout: Destination unreachable' },
];

export const useInventoryStore = create<InventoryState>((set, get) => ({
  activeBatch: MOCK_BATCH,
  syncLogs: MOCK_LOGS,
  lastScanResult: null,

  setActiveBatch: (id) => {
    // In real app, fetch from API. Here we just reset mock.
    set({ activeBatch: { ...MOCK_BATCH, id } });
  },

  processBarcode: async (barcode) => {
    // 3.1 High-Speed Barcode Validation Logic Simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        const state = get();
        if (!state.activeBatch) {
          const res: ScanResult = { success: false, message: 'No active batch selected', type: 'business' };
          set({ lastScanResult: res });
          resolve(res);
          return;
        }

        const product = MOCK_PRODUCTS.find(p => p.barcode === barcode);
        
        if (!product) {
          const res: ScanResult = { success: false, message: `Product not found: ${barcode}`, type: 'business' };
          set({ lastScanResult: res });
          resolve(res);
          return;
        }

        const lineIndex = state.activeBatch.lines.findIndex(l => l.product_id.id === product.id);
        
        if (lineIndex === -1) {
           const res: ScanResult = { success: false, message: `Item ${product.name} not in this batch`, type: 'business' };
           set({ lastScanResult: res });
           resolve(res);
           return;
        }

        const line = state.activeBatch.lines[lineIndex];
        if (line.qty_done >= line.qty_demand) {
           const res: ScanResult = { success: false, message: `Over-picking blocked for ${product.name}`, type: 'business' };
           set({ lastScanResult: res });
           resolve(res);
           return;
        }

        // Success Case
        const newLines = [...state.activeBatch.lines];
        newLines[lineIndex] = { ...line, qty_done: line.qty_done + 1 };
        
        set({
          activeBatch: { ...state.activeBatch, lines: newLines },
          lastScanResult: { success: true, message: `Scanned: ${product.name}`, type: 'success', product }
        });

        resolve({ success: true, message: 'OK', type: 'success' });

      }, 100); // <150ms Latency Requirement
    });
  },

  forceValidateBatch: () => {
    const state = get();
    if (state.activeBatch) {
      set({ activeBatch: { ...state.activeBatch, state: 'done' } });
    }
  },

  toggleSortOptimization: () => {
    const state = get();
    if (!state.activeBatch) return;

    const currentOpt = state.activeBatch.path_optimized;
    let newLines = [...state.activeBatch.lines];

    if (!currentOpt) {
      // Sort by location string
      newLines.sort((a, b) => a.location_dest.localeCompare(b.location_dest));
    } else {
      // Revert to ID sort (original order simulation)
      newLines.sort((a, b) => a.id - b.id);
    }

    set({ activeBatch: { ...state.activeBatch, lines: newLines, path_optimized: !currentOpt } });
  }
}));
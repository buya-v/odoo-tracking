import { create } from 'zustand';
import { PickingBatch, ScanResult } from '../types';
import { triggerFeedback } from '../utils/feedback';

interface InventoryState {
  activeBatch: PickingBatch | null;
  isLoading: boolean;
  error: string | null;
  // Actions
  loadBatch: () => Promise<void>;
  processScan: (barcode: string) => ScanResult;
  clearError: () => void;
}

// Mock Data to simulate Odoo Backend
const MOCK_BATCH: PickingBatch = {
  id: 101,
  name: 'BATCH/0001',
  user_id: 1,
  company_id: 1,
  company_name: 'Company A',
  state: 'in_progress',
  lines: [
    { id: 1, product_id: 10, product_name: 'Office Chair Black', product_barcode: '123456', qty_demand: 5, qty_done: 2, location_dest_id: 5 },
    { id: 2, product_id: 11, product_name: 'Corner Desk Right', product_barcode: '987654', qty_demand: 1, qty_done: 0, location_dest_id: 5 },
    { id: 3, product_id: 12, product_name: 'USB-C Cable 1m', product_barcode: 'GS1-001', qty_demand: 10, qty_done: 10, location_dest_id: 5 }
  ]
};

export const useInventoryStore = create<InventoryState>((set, get) => ({
  activeBatch: null,
  isLoading: false,
  error: null,

  loadBatch: async () => {
    set({ isLoading: true });
    // Simulate Odoo RPC latency
    setTimeout(() => {
      set({ activeBatch: MOCK_BATCH, isLoading: false });
    }, 600);
  },

  processScan: (barcode: string) => {
    const batch = get().activeBatch;
    if (!batch) {
       const msg = "No active batch loaded.";
       triggerFeedback('error');
       return { success: false, message: msg, type: 'error' };
    }

    const lineIndex = batch.lines.findIndex(l => l.product_barcode === barcode);

    if (lineIndex === -1) {
      const msg = `Barcode [${barcode}] not found in local or global database.`;
      triggerFeedback('error');
      set({ error: msg }); // Triggers Global Error Modal
      return { success: false, message: msg, type: 'error' };
    }

    const line = batch.lines[lineIndex];

    if (line.qty_done >= line.qty_demand) {
      const msg = `Product ${line.product_name} already fulfilled.`;
      triggerFeedback('warning');
      return { success: false, message: msg, type: 'warning' };
    }

    // Optimistic Update (Express Mode)
    const updatedLines = [...batch.lines];
    updatedLines[lineIndex] = { ...line, qty_done: line.qty_done + 1 };
    
    set({ activeBatch: { ...batch, lines: updatedLines } });
    triggerFeedback('success');
    
    return { 
      success: true, 
      message: `Scanned: ${line.product_name}`, 
      type: 'success',
      product: { id: line.product_id, name: line.product_name, barcode: line.product_barcode, default_code: 'REF' }
    };
  },

  clearError: () => set({ error: null })
}));
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PickingBatch, Picking, StockMove } from '../types';
import { audioFeedback } from '../lib/audio';

// Mock Data
const MOCK_BATCHES: PickingBatch[] = [
  {
    id: 1,
    name: 'BATCH/001',
    user_id: { id: 1, name: 'Mitchel Admin' },
    state: 'in_progress',
    pickings: [
      {
        id: 101,
        name: 'WH/OUT/001',
        picking_type_code: 'outgoing',
        location_id: { id: 1, name: 'WH/Stock', removal_priority: 10 },
        location_dest_id: { id: 5, name: 'Partner Locations/Customers' },
        state: 'assigned',
        company_id: 1,
        move_lines: [
          {
            id: 1001,
            product_id: { id: 1, name: '[FURN_7888] Desk Stand', barcode: '123456', standard_price: 50 },
            product_uom_qty: 5,
            qty_done: 2,
            location_id: { id: 1, name: 'WH/Stock/Shelf 1', removal_priority: 10 },
            location_dest_id: { id: 5, name: 'Partner Locations/Customers' },
            state: 'assigned'
          },
          {
            id: 1002,
            product_id: { id: 2, name: '[E-COM11] Storage Box', barcode: '987654', standard_price: 15 },
            product_uom_qty: 10,
            qty_done: 0,
            location_id: { id: 2, name: 'WH/Stock/Shelf 2', removal_priority: 5 },
            location_dest_id: { id: 5, name: 'Partner Locations/Customers' },
            state: 'assigned'
          }
        ]
      }
    ]
  }
];

interface InventoryState {
  batches: PickingBatch[];
  activeBatchId: number | null;
  setActiveBatch: (id: number | null) => void;
  scanProduct: (barcode: string) => { success: boolean; message: string };
  interCompanyTransfer: (pickingId: number) => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      batches: MOCK_BATCHES,
      activeBatchId: null,
      setActiveBatch: (id) => set({ activeBatchId: id }),
      
      scanProduct: (barcode) => {
        const state = get();
        if (!state.activeBatchId) return { success: false, message: 'No active batch' };

        const batchIndex = state.batches.findIndex(b => b.id === state.activeBatchId);
        if (batchIndex === -1) return { success: false, message: 'Batch not found' };

        const batch = { ...state.batches[batchIndex] };
        let scanned = false;
        let fullyPicked = false;

        // Find matching product in pickings
        for (const picking of batch.pickings) {
          for (const move of picking.move_lines) {
            if (move.product_id.barcode === barcode) {
              if (move.qty_done < move.product_uom_qty) {
                move.qty_done += 1;
                scanned = true;
                
                // Check if line completed
                if (move.qty_done === move.product_uom_qty) {
                   fullyPicked = true;
                }
                break;
              }
            }
          }
          if (scanned) break;
        }

        if (scanned) {
          const newBatches = [...state.batches];
          newBatches[batchIndex] = batch;
          set({ batches: newBatches });
          
          if (fullyPicked) {
             audioFeedback.playSuccess();
             return { success: true, message: 'Line Complete' };
          }
          audioFeedback.playWarning(); // Partial
          return { success: true, message: 'Scanned' };
        }

        audioFeedback.playError();
        return { success: false, message: 'Invalid Product or Already Done' };
      },

      interCompanyTransfer: (pickingId) => {
        // Simulate ICT logic: Create incoming picking for Company B
        console.log(`[ICT ENGINE] Triggering ICT for Picking ${pickingId}`);
        // Implementation would create a new Picking record in state with reversed locations
      }
    }),
    {
      name: 'odoo-inventory-storage',
    }
  )
);
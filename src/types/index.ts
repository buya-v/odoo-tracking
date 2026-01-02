export type PickingState = 'draft' | 'waiting' | 'confirmed' | 'assigned' | 'done';

export interface Product {
  id: number;
  name: string;
  barcode: string;
  standard_price: number;
}

export interface StockMove {
  id: number;
  product_id: Product;
  product_uom_qty: number; // Demand
  qty_done: number;
  location_id: { id: number; name: string; removal_priority: number };
  location_dest_id: { id: number; name: string };
  state: PickingState;
}

export interface Picking {
  id: number;
  name: string;
  picking_type_code: 'incoming' | 'outgoing' | 'internal';
  location_id: { id: number; name: string };
  location_dest_id: { id: number; name: string };
  state: PickingState;
  move_lines: StockMove[];
  company_id: number;
  intercompany_transfer_ref?: number;
}

export interface PickingBatch {
  id: number;
  name: string;
  user_id: { id: number; name: string };
  state: 'draft' | 'in_progress' | 'done';
  pickings: Picking[];
}
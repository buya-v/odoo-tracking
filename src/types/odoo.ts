export interface Product {
  id: number;
  name: string;
  barcode: string;
  default_code: string;
}

export interface StockMoveLine {
  id: number;
  product_id: Product;
  qty_done: number;
  qty_demand: number;
  location_dest: string; // Used for Optimal Path sorting
  state: 'draft' | 'assigned' | 'done';
}

export interface PickingBatch {
  id: number;
  name: string;
  state: 'draft' | 'in_progress' | 'done';
  user_id: number;
  lines: StockMoveLine[];
  path_optimized: boolean;
  last_sync_error?: string;
}

export interface SyncLog {
  id: number;
  timestamp: string;
  company_source: string;
  company_dest: string;
  status: 'success' | 'failed' | 'pending';
  payload: string;
  error_message?: string;
}

export interface ScanResult {
  success: boolean;
  message: string;
  type: 'success' | 'business' | 'critical';
  product?: Product;
}
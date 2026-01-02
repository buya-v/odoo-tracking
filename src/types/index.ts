export interface Product {
  id: number;
  name: string;
  barcode: string;
  default_code: string;
}

export interface PickingLine {
  id: number;
  product_id: number;
  product_name: string;
  product_barcode: string;
  qty_demand: number;
  qty_done: number;
  location_dest_id: number;
}

export interface PickingBatch {
  id: number;
  name: string;
  user_id: number;
  company_id: number;
  company_name: string;
  lines: PickingLine[];
  state: 'draft' | 'in_progress' | 'done';
}

export interface ScanResult {
  success: boolean;
  message: string;
  product?: Product;
  type: 'success' | 'warning' | 'error';
}
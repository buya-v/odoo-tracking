export type SyncStatus = 'online' | 'offline' | 'error' | 'syncing';

export interface BatchOperation {
  id: number;
  name: string;
  state: 'draft' | 'in_progress' | 'done' | 'cancel';
  user_id: number;
  user_name: string;
  scheduled_date: string;
  item_count: number;
  processed_count: number;
}

export interface TrackLog {
  id: number;
  name: string;
  model_name: string;
  res_id: number;
  traceback: string;
  user_id: number;
  create_date: string;
}

export interface AppState {
  batches: BatchOperation[];
  logs: TrackLog[];
  syncStatus: SyncStatus;
  selectedBatchId: number | null;
  viewMode: 'list' | 'dashboard';
  setSyncStatus: (status: SyncStatus) => void;
  selectBatch: (id: number | null) => void;
  toggleView: () => void;
  triggerSync: () => Promise<void>;
  addLog: (log: Omit<TrackLog, 'id' | 'create_date'>) => void;
  retryAllLogs: () => void;
}
import { render, screen, fireEvent } from '@testing-library/react';
import { BatchOperationList } from '../BatchOperationList';
import { useStore } from '../../store/useStore';
import { vi } from 'vitest';

// Mock Zustand store
vi.mock('../../store/useStore', () => ({
  useStore: vi.fn(),
}));

describe('BatchOperationList', () => {
  const mockSelectBatch = vi.fn();

  beforeEach(() => {
    (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      batches: [
        {
          id: 1,
          name: 'BATCH/TEST/001',
          state: 'in_progress',
          user_name: 'Tester',
          scheduled_date: '2023-01-01',
          processed_count: 5,
          item_count: 10
        }
      ],
      selectBatch: mockSelectBatch,
    });
  });

  it('renders batch list correctly', () => {
    render(<BatchOperationList />);
    expect(screen.getByText('BATCH/TEST/001')).toBeInTheDocument();
    expect(screen.getByText('in progress')).toBeInTheDocument();
  });

  it('calls selectBatch when a row is clicked', () => {
    render(<BatchOperationList />);
    const row = screen.getByRole('button');
    fireEvent.click(row);
    expect(mockSelectBatch).toHaveBeenCalledWith(1);
  });
  
  it('handles keyboard navigation', () => {
    render(<BatchOperationList />);
    const row = screen.getByRole('button');
    fireEvent.keyDown(row, { key: 'Enter', code: 'Enter' });
    expect(mockSelectBatch).toHaveBeenCalledWith(1);
  });
});
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BatchCard } from '../batch/BatchCard';
import { PickingBatch } from '../../types';

const mockBatch: PickingBatch = {
  id: 1,
  name: 'BATCH/TEST',
  user_id: { id: 1, name: 'User' },
  state: 'in_progress',
  pickings: [
    {
      id: 101,
      name: 'WH/OUT/1',
      picking_type_code: 'outgoing',
      location_id: { id: 1, name: 'Loc' },
      location_dest_id: { id: 2, name: 'Dest' },
      state: 'assigned',
      company_id: 1,
      move_lines: [
        {
          id: 1,
          product_id: { id: 1, name: 'Product', barcode: '123', standard_price: 10 },
          product_uom_qty: 10,
          qty_done: 5,
          location_id: { id: 1, name: 'Loc', removal_priority: 1 },
          location_dest_id: { id: 2, name: 'Dest' },
          state: 'assigned'
        }
      ]
    }
  ]
};

describe('BatchCard', () => {
  it('renders batch name and progress correctly', () => {
    const handleClick = vi.fn();
    render(<BatchCard batch={mockBatch} onClick={handleClick} />);

    expect(screen.getByText('BATCH/TEST')).toBeInTheDocument();
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
    expect(screen.getByText('5 / 10 units processed')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<BatchCard batch={mockBatch} onClick={handleClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
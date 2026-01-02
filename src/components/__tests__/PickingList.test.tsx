import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PickingList } from '../PickingList';
import { PickingBatch } from '../../types';

const mockBatch: PickingBatch = {
  id: 1,
  name: 'TEST/001',
  user_id: 1,
  company_id: 1,
  company_name: 'Test Co',
  state: 'in_progress',
  lines: [
    { id: 10, product_id: 1, product_name: 'Test Product', product_barcode: '123', qty_demand: 5, qty_done: 2, location_dest_id: 1 },
    { id: 11, product_id: 2, product_name: 'Done Product', product_barcode: '456', qty_demand: 3, qty_done: 3, location_dest_id: 1 }
  ]
};

describe('PickingList', () => {
  it('renders loading state when batch is null', () => {
    render(<PickingList batch={null} />);
    expect(screen.getByText(/Loading items/i)).toBeInTheDocument();
  });

  it('renders picking lines', () => {
    render(<PickingList batch={mockBatch} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Done Product')).toBeInTheDocument();
  });

  it('shows visual indication for done items', () => {
    render(<PickingList batch={mockBatch} />);
    // Done Product should have "Done" text and specific styling classes would be applied
    expect(screen.getByText('Done')).toBeInTheDocument();
    
    const doneLine = screen.getByTestId('line-item-11');
    expect(doneLine.className).toContain('border-odoo-teal');
  });

  it('shows progress correctly', () => {
    render(<PickingList batch={mockBatch} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('/ 5')).toBeInTheDocument();
  });
});
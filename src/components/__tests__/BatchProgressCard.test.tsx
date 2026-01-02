import { render, screen } from '@testing-library/react';
import { BatchProgressCard } from '../BatchProgressCard';
import { describe, it, expect } from 'vitest';
import { StockMoveLine } from '../../types/odoo';

const mockLines: StockMoveLine[] = [
  { 
    id: 1, 
    product_id: { id: 1, name: 'P1', barcode: '1', default_code: '1' }, 
    qty_done: 5, 
    qty_demand: 10, 
    location_dest: 'A', 
    state: 'assigned' 
  }
];

describe('BatchProgressCard', () => {
  it('renders batch name correctly', () => {
    render(<BatchProgressCard lines={mockLines} batchName="TEST-001" />);
    expect(screen.getByText('TEST-001')).toBeInTheDocument();
  });

  it('calculates progress percentage correctly', () => {
    render(<BatchProgressCard lines={mockLines} batchName="TEST-001" />);
    // 5/10 = 50%
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('5 / 10 Units Processed')).toBeInTheDocument();
  });

  it('handles zero demand gracefully', () => {
    const emptyLines: StockMoveLine[] = [
      { 
        id: 2, 
        product_id: { id: 1, name: 'P1', barcode: '1', default_code: '1' }, 
        qty_done: 0, 
        qty_demand: 0, 
        location_dest: 'A', 
        state: 'assigned' 
      }
    ];
    render(<BatchProgressCard lines={emptyLines} batchName="TEST-EMPTY" />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
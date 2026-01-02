import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ScannerInterface } from '../../pages/ScannerInterface';
import { BrowserRouter } from 'react-router-dom';
import { useInventoryStore } from '../../store/inventoryStore';

// Mock the store
vi.mock('../../store/inventoryStore', () => ({
  useInventoryStore: vi.fn()
}));

const mockScanProduct = vi.fn();

describe('ScannerInterface', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useInventoryStore as any).mockReturnValue({
      batches: [
        {
          id: 1,
          name: 'BATCH/001',
          pickings: [
             {
               move_lines: [
                 {
                   id: 1,
                   product_id: { name: 'Test Product', barcode: '123456' },
                   location_id: { name: 'Shelf 1', removal_priority: 1 },
                   qty_done: 0,
                   product_uom_qty: 1
                 }
               ]
             }
          ]
        }
      ],
      scanProduct: mockScanProduct
    });
    
    // Mock useParams
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ id: '1' })
      };
    });
  });

  it('renders input field focused', () => {
    render(
      <BrowserRouter>
        <ScannerInterface />
      </BrowserRouter>
    );
    const input = screen.getByPlaceholderText('Scan Barcode...');
    expect(input).toBeInTheDocument();
  });

  it('submits barcode on enter', () => {
    mockScanProduct.mockReturnValue({ success: true, message: 'Scanned' });
    render(
      <BrowserRouter>
        <ScannerInterface />
      </BrowserRouter>
    );
    
    const input = screen.getByPlaceholderText('Scan Barcode...');
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.submit(input);
    
    expect(mockScanProduct).toHaveBeenCalledWith('123456');
  });
});
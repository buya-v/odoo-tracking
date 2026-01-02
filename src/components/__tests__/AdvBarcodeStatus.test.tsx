import { render, screen, act } from '@testing-library/react';
import { AdvBarcodeStatus } from '../AdvBarcodeStatus';
import { useInventoryStore } from '../../store/inventoryStore';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the store
const initialStoreState = useInventoryStore.getState();

describe('AdvBarcodeStatus Component', () => {
  beforeEach(() => {
    useInventoryStore.setState(initialStoreState, true);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not render when there is no scan result', () => {
    render(<AdvBarcodeStatus />);
    const statusElement = screen.queryByTestId('barcode-status');
    expect(statusElement).not.toBeInTheDocument();
  });

  it('should render success message when scan is valid', () => {
    render(<AdvBarcodeStatus />);
    
    act(() => {
      useInventoryStore.setState({
        lastScanResult: { success: true, message: 'Scanned Item A', type: 'success' }
      });
    });

    const statusElement = screen.getByTestId('barcode-status');
    expect(statusElement).toBeInTheDocument();
    expect(screen.getByText('Scanned Item A')).toBeInTheDocument();
    expect(screen.getByText('success')).toBeInTheDocument();
  });

  it('should render business error correctly', () => {
    render(<AdvBarcodeStatus />);
    
    act(() => {
      useInventoryStore.setState({
        lastScanResult: { success: false, message: 'Item not in batch', type: 'business' }
      });
    });

    const statusElement = screen.getByTestId('barcode-status');
    expect(statusElement).toHaveClass('bg-adv-warning');
    expect(screen.getByText('business')).toBeInTheDocument();
  });

  it('should auto-hide after 3 seconds', () => {
    render(<AdvBarcodeStatus />);
    
    act(() => {
      useInventoryStore.setState({
        lastScanResult: { success: true, message: 'Test', type: 'success' }
      });
    });

    expect(screen.getByTestId('barcode-status')).toBeVisible();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // In the component logic, it sets visible state to false. 
    // Since conditional rendering returns null on !visible, it should be removed from DOM or have hidden class depending on impl.
    // Our implementation returns null when not visible.
    expect(screen.queryByTestId('barcode-status')).not.toBeInTheDocument();
  });
});
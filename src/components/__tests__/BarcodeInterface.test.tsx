import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BarcodeInterface } from '../BarcodeInterface';
import { useInventoryStore } from '../../store/useInventoryStore';
import { vi } from 'vitest';

// Mock store
vi.mock('../../store/useInventoryStore');

// Mock Haptic
vi.mock('../../hooks/useHaptic', () => ({
  useHaptic: () => ({
    triggerError: vi.fn(),
    triggerSuccess: vi.fn(),
  }),
}));

describe('BarcodeInterface', () => {
  const processScanMock = vi.fn();
  const setModeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useInventoryStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      processScan: processScanMock,
      setMode: setModeMock,
      feedback: { type: null },
    });
  });

  it('renders input field', () => {
    render(<BarcodeInterface />);
    expect(screen.getByPlaceholderText('Scan Barcode...')).toBeInTheDocument();
  });

  it('submits scan code', async () => {
    render(<BarcodeInterface />);
    const input = screen.getByPlaceholderText('Scan Barcode...');
    
    fireEvent.change(input, { target: { value: 'TEST-123' } });
    fireEvent.submit(input);

    expect(processScanMock).toHaveBeenCalledWith('TEST-123');
  });

  it('navigates back to batches', () => {
    render(<BarcodeInterface />);
    const backBtn = screen.getByText('Back to Batches');
    fireEvent.click(backBtn);
    expect(setModeMock).toHaveBeenCalledWith('batch');
  });
});
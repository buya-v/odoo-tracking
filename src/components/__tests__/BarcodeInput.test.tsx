import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BarcodeInput } from '../BarcodeInput';

describe('BarcodeInput', () => {
  it('renders correctly', () => {
    render(<BarcodeInput onScan={() => {}} isProcessing={false} />);
    expect(screen.getByTestId('barcode-input')).toBeInTheDocument();
  });

  it('calls onScan when form is submitted', () => {
    const handleScan = vi.fn();
    render(<BarcodeInput onScan={handleScan} isProcessing={false} />);
    
    const input = screen.getByTestId('barcode-input');
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.submit(input);

    expect(handleScan).toHaveBeenCalledWith('123456');
    // Input should clear after submit
    expect(input).toHaveValue('');
  });

  it('does not call onScan if input is empty', () => {
    const handleScan = vi.fn();
    render(<BarcodeInput onScan={handleScan} isProcessing={false} />);
    
    const input = screen.getByTestId('barcode-input');
    fireEvent.submit(input);

    expect(handleScan).not.toHaveBeenCalled();
  });

  it('is disabled when processing', () => {
    render(<BarcodeInput onScan={() => {}} isProcessing={true} />);
    expect(screen.getByTestId('barcode-input')).toBeDisabled();
  });
});
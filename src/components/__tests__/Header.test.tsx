import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';
import { useInventoryStore } from '../../store/useInventoryStore';
import { vi } from 'vitest';

// Mock store
vi.mock('../../store/useInventoryStore');

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title correctly', () => {
    (useInventoryStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      syncStatus: 'connected',
      retrySync: vi.fn(),
    });

    render(<Header />);
    expect(screen.getByText('Odoo Inventory')).toBeInTheDocument();
  });

  it('displays correct status when connected', () => {
    (useInventoryStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      syncStatus: 'connected',
      retrySync: vi.fn(),
    });

    render(<Header />);
    expect(screen.getByText('connected')).toBeInTheDocument();
  });

  it('calls retrySync on button click', () => {
    const retryMock = vi.fn();
    (useInventoryStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      syncStatus: 'error',
      retrySync: retryMock,
    });

    render(<Header />);
    const btn = screen.getByLabelText('Sync Status');
    fireEvent.click(btn);
    expect(retryMock).toHaveBeenCalled();
  });
});
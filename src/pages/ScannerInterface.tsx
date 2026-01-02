import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventoryStore } from '../store/inventoryStore';
import { Scan, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';

export const ScannerInterface: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { batches, scanProduct } = useInventoryStore();
  const [barcode, setBarcode] = useState('');
  const [lastStatus, setLastStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const batch = batches.find(b => b.id === Number(id));

  // Keep focus on input for hardware scanners
  useEffect(() => {
    const focusInterval = setInterval(() => {
      if (document.activeElement?.tagName !== 'INPUT') {
        inputRef.current?.focus();
      }
    }, 2000);
    return () => clearInterval(focusInterval);
  }, []);

  if (!batch) return <div>Batch not found</div>;

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode) return;

    const result = scanProduct(barcode);
    setLastStatus(result.success ? 'success' : 'error');
    setMessage(result.message);
    setBarcode('');

    // Reset status visual after delay
    setTimeout(() => setLastStatus('idle'), 2000);
  };

  // Flatten moves for display
  const moves = batch.pickings.flatMap(p => p.move_lines);
  const todoMoves = moves.filter(m => m.qty_done < m.product_uom_qty);
  const doneMoves = moves.filter(m => m.qty_done >= m.product_uom_qty);

  return (
    <div className={clsx(
      "min-h-[calc(100vh-64px)] p-4 transition-colors duration-300",
      lastStatus === 'success' && "bg-green-50",
      lastStatus === 'error' && "bg-red-50"
    )}>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate('/batches')} className="flex items-center gap-1 text-gray-600">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <span className="font-bold">{batch.name}</span>
      </div>

      {/* Scan Input */}
      <form onSubmit={handleScan} className="mb-6 relative">
        <input
          ref={inputRef}
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Scan Barcode..."
          autoFocus
          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-odoo-teal shadow-sm text-lg focus:outline-none focus:ring-4 focus:ring-odoo-teal/20"
        />
        <Scan className="absolute left-4 top-1/2 -translate-y-1/2 text-odoo-teal w-6 h-6 animate-pulse" />
      </form>

      {/* Status Message */}
      {lastStatus !== 'idle' && (
        <div className={clsx(
          "mb-4 p-4 rounded-lg flex items-center gap-3 animate-bounce-short",
          lastStatus === 'success' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
          {lastStatus === 'success' ? <CheckCircle /> : <AlertTriangle />}
          <span className="font-bold text-lg">{message}</span>
        </div>
      )}

      {/* Priority Bin View */}
      {todoMoves.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg border-l-8 border-odoo-teal overflow-hidden mb-6">
          <div className="bg-gray-50 p-2 border-b text-xs font-bold text-gray-500 uppercase tracking-wider">
            Next Pick • Priority {todoMoves[0].location_id.removal_priority}
          </div>
          <div className="p-6">
             <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-1">{todoMoves[0].location_id.name.split('/').pop()}</h2>
                  <p className="text-gray-500 text-sm">{todoMoves[0].location_id.name}</p>
                </div>
                <div className="text-right">
                   <span className="text-3xl font-bold text-odoo-teal">{todoMoves[0].qty_done}</span>
                   <span className="text-xl text-gray-400 font-medium"> / {todoMoves[0].product_uom_qty}</span>
                </div>
             </div>
             <div className="text-lg font-medium text-gray-800">{todoMoves[0].product_id.name}</div>
             <div className="text-sm text-gray-500 mt-1">Barcode: {todoMoves[0].product_id.barcode}</div>
          </div>
        </div>
      ) : (
        <div className="bg-green-100 p-8 rounded-xl text-center text-green-800 mb-6">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Batch Complete!</h2>
          <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium">Validate All</button>
        </div>
      )}

      {/* Remaining Items List */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-700">Next Up ({todoMoves.length - 1})</h3>
        {todoMoves.slice(1).map(move => (
          <div key={move.id} className="bg-white p-3 rounded-lg border shadow-sm opacity-75">
             <div className="flex justify-between">
                <span className="font-bold">{move.location_id.name.split('/').pop()}</span>
                <span className="text-gray-600">{move.qty_done}/{move.product_uom_qty}</span>
             </div>
             <div className="text-sm truncate">{move.product_id.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
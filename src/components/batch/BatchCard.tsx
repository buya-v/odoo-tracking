import React from 'react';
import { PickingBatch } from '../../types';
import { ChevronRight, Package } from 'lucide-react';
import { clsx } from 'clsx';

interface BatchCardProps {
  batch: PickingBatch;
  onClick: () => void;
}

export const BatchCard: React.FC<BatchCardProps> = ({ batch, onClick }) => {
  const totalItems = batch.pickings.reduce((acc, p) => 
    acc + p.move_lines.reduce((mAcc, m) => mAcc + m.product_uom_qty, 0), 0);
  
  const doneItems = batch.pickings.reduce((acc, p) => 
    acc + p.move_lines.reduce((mAcc, m) => mAcc + m.qty_done, 0), 0);

  const progress = Math.round((doneItems / totalItems) * 100) || 0;

  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-odoo-teal transition-all cursor-pointer active:scale-95"
      role="button"
      aria-label={`Open batch ${batch.name}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{batch.name}</h3>
          <span className={clsx(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            batch.state === 'in_progress' ? "bg-odoo-warning/20 text-yellow-800" : "bg-gray-100 text-gray-600"
          )}>
            {batch.state.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <ChevronRight className="text-gray-400" />
      </div>

      <div className="flex items-center gap-2 mb-3 text-gray-600 text-sm">
        <Package className="w-4 h-4" />
        <span>{batch.pickings.length} Orders</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div 
          className={clsx(
            "h-2.5 rounded-full transition-all duration-300",
            progress === 100 ? "bg-odoo-success" : "bg-odoo-teal"
          )}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-right text-xs text-gray-500 mt-1">
        {doneItems} / {totalItems} units processed
      </div>
    </div>
  );
};
import React from 'react';
import { PickingBatch } from '../types';
import clsx from 'clsx';
import { CheckCircle2, Package } from 'lucide-react';

interface PickingListProps {
  batch: PickingBatch | null;
}

export const PickingList: React.FC<PickingListProps> = ({ batch }) => {
  if (!batch) return <div className="p-8 text-center text-gray-500">Loading items...</div>;

  return (
    <div className="p-4 space-y-3 pb-20">
      {batch.lines.map((line) => {
        const isDone = line.qty_done >= line.qty_demand;
        return (
          <div 
            key={line.id} 
            className={clsx(
              "bg-white rounded-lg p-4 shadow-sm border-l-4 transition-all duration-200",
              isDone ? "border-odoo-teal opacity-60" : "border-odoo-warning"
            )}
            data-testid={`line-item-${line.id}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className={clsx("font-semibold text-lg", isDone && "line-through text-gray-500")}>
                  {line.product_name}
                </h3>
                <p className="text-sm text-gray-500 font-mono mt-1">
                  Ref: {line.product_barcode}
                </p>
              </div>
              <div className="text-right pl-4">
                <div className={clsx(
                  "text-2xl font-bold font-mono",
                  isDone ? "text-odoo-teal" : "text-odoo-dark"
                )}>
                  {line.qty_done} <span className="text-gray-400 text-lg">/ {line.qty_demand}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                <Package className="w-3 h-3" />
                <span>Loc: WH/Stock/Shelf {line.location_dest_id}</span>
              </div>
              {isDone && (
                <div className="flex items-center text-odoo-teal text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  <span>Done</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
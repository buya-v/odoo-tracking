import React from 'react';
import { StockMoveLine } from '../types/odoo';
import { Package } from 'lucide-react';

interface Props {
  lines: StockMoveLine[];
  batchName: string;
}

export const BatchProgressCard: React.FC<Props> = ({ lines, batchName }) => {
  const totalItems = lines.reduce((acc, line) => acc + line.qty_demand, 0);
  const doneItems = lines.reduce((acc, line) => acc + line.qty_done, 0);
  const percentage = totalItems === 0 ? 0 : Math.round((doneItems / totalItems) * 100);

  // SVG Circle calculation
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 text-gray-500 mb-1">
          <Package size={16} />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">Batch ID</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800">{batchName}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {doneItems} / {totalItems} Units Processed
        </p>
      </div>

      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="transform -rotate-90 w-20 h-20">
          <circle
            className="text-gray-200"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
          <circle
            className="text-blue-600 transition-all duration-500 ease-out"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
        </svg>
        <span className="absolute text-sm font-bold text-blue-600">{percentage}%</span>
      </div>
    </div>
  );
};
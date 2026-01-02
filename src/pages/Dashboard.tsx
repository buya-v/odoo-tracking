import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowRightLeft, LayoutDashboard } from 'lucide-react';

const data = [
  { name: 'Shelf 1', value: 4000 },
  { name: 'Shelf 2', value: 3000 },
  { name: 'Shelf 3', value: 2000 },
  { name: 'Dock', value: 2780 },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          onClick={() => navigate('/batches')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="bg-odoo-teal/10 p-3 rounded-lg">
              <ClipboardList className="w-8 h-8 text-odoo-teal" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Batch Operations</h2>
              <p className="text-gray-500">Process active picking batches</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <ArrowRightLeft className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Inter-Company</h2>
              <p className="text-gray-500">4 Pending Transfers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <LayoutDashboard className="w-5 h-5 text-gray-500" />
          <h3 className="font-bold text-gray-700">Inventory Value by Location</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="value" fill="#00A09A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
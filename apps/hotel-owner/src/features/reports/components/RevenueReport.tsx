import { useMemo } from 'react';
import { motion } from '@repo/ui/motion';
import { RevenueReportItem } from '../services/reportService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, DollarSign } from 'lucide-react';

interface RevenueReportProps {
  data: RevenueReportItem[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-xl">
        <p className="text-sm font-bold text-gray-500 mb-2">{new Date(label).toLocaleDateString('vi-VN')}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600 font-medium">{entry.name}:</span>
            <span className="font-bold text-gray-900">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueReport({ data = [] }: RevenueReportProps) {
  // Safety check
  const safeData = Array.isArray(data) ? data : [];

  const totalRevenue = useMemo(() => safeData.reduce((acc, curr) => acc + curr.totalRevenue, 0), [safeData]);
  const formattedData = useMemo(() => safeData.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  })), [safeData]);

  if (!safeData.length) {
    return (
      <div className="p-8 text-center text-gray-400 font-medium bg-gray-50 rounded-[32px] border border-gray-100 border-dashed">
        No revenue data available for this period.
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-16 h-16 text-lime-500" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-anton text-gray-900">{formatCurrency(totalRevenue)}</span>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded mb-1 flex items-center">
              <ArrowUp className="w-3 h-3 mr-0.5" /> +12.5%
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Room Revenue</span>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(safeData.reduce((acc, curr) => acc + curr.roomRevenue, 0))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Service Revenue</span>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(safeData.reduce((acc, curr) => acc + curr.serviceRevenue, 0))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm h-[400px]">
        <h4 className="text-lg font-bold text-gray-900 mb-6">Revenue Trends</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val: number) => `${val / 1000000}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="totalRevenue" name="Total" stroke="#84cc16" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
            <Area type="monotone" dataKey="roomRevenue" name="Room" stroke="#1A1A1A" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table (Placeholder) */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h4 className="text-lg font-bold text-gray-900">Daily Breakdown</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Room Rev</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Service Rev</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Tax</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-900 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {safeData.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{new Date(item.date).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-right">{formatCurrency(item.roomRevenue)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-right">{formatCurrency(item.serviceRevenue)}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 text-right">{formatCurrency(item.tax)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-lime-600 text-right">{formatCurrency(item.totalRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

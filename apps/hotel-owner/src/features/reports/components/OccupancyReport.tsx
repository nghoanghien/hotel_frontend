import { useMemo } from 'react';
import { OccupancyReportItem } from '../services/reportService';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, BedDouble, TrendingUp } from 'lucide-react';

interface OccupancyReportProps {
  data: OccupancyReportItem[];
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
            <span className="font-bold text-gray-900">
              {entry.unit === '%' ? `${entry.value.toFixed(1)}%` :
                entry.name.includes('Rate') || entry.name.includes('Rev') ? formatCurrency(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function OccupancyReport({ data = [] }: OccupancyReportProps) {
  // Safety check for data array
  const safeData = Array.isArray(data) ? data : [];
  const count = safeData.length;

  const averageOccupancy = useMemo(() => count > 0 ? safeData.reduce((acc, curr) => acc + curr.occupancyRate, 0) / count : 0, [safeData, count]);
  const averageADR = useMemo(() => count > 0 ? safeData.reduce((acc, curr) => acc + curr.adr, 0) / count : 0, [safeData, count]);
  const averageRevPAR = useMemo(() => count > 0 ? safeData.reduce((acc, curr) => acc + curr.revPar, 0) / count : 0, [safeData, count]);

  const formattedData = useMemo(() => safeData.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  })), [safeData]);

  if (count === 0) {
    return (
      <div className="p-10 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl">
        No occupancy data available.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-16 h-16 text-blue-500" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg. Occupancy</span>
          <span className="text-3xl font-anton text-gray-900 mt-2">{averageOccupancy.toFixed(1)}%</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ADR (Average Daily Rate)</span>
          <span className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(averageADR)}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">RevPAR</span>
          <span className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(averageRevPAR)}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm h-[450px]">
        <h4 className="text-lg font-bold text-gray-900 mb-6">Occupancy & Rates</h4>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val: number) => `${val}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar yAxisId="left" dataKey="soldRooms" name="Sold Rooms" fill="#1A1A1A" barSize={20} radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="occupancyRate" name="Occupancy %" stroke="#84cc16" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BedDouble className="w-4 h-4" />
            <span className="font-medium">Total Available Rooms: 50</span>
          </div>
        </div>
      </div>

    </div>
  );
}

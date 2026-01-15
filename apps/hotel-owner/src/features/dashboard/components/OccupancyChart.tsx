'use client';

import { OccupancyStats } from "@repo/types";
import { RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from '@repo/ui';

interface OccupancyChartProps {
  stats: any; // Using any for flexibility with slightly different stat structures
}

export function OccupancyChart({ stats }: OccupancyChartProps) {
  const data = [
    { name: "Checked In", value: stats.checkedInBookings, color: "#78C841" }, // Primary green
    { name: "Confirmed", value: stats.confirmedBookings, color: "#3B82F6" }, // Blue
    { name: "Pending", value: stats.pendingBookings, color: "#F59E0B" }, // Warning (Amber/Orange)
    { name: "Cancelled", value: stats.cancelledBookings, color: "#EF4444" }, // Danger (Red)
  ];

  return (
    <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100">
      <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Booking Status</h3>

      <div className="h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              cornerRadius={8}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '8px 12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              cursor={false}
            />
          </RechartsPieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-3xl font-bold text-gray-900">{stats.totalBookings}</div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Total</div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs font-medium text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

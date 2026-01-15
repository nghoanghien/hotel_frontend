import { RechartsAreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from '@repo/ui';
import { ChartDataPoint } from '@repo/types';

interface BookingTrendChartProps {
  data: ChartDataPoint[];
}

export function BookingTrendChart({ data }: BookingTrendChartProps) {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Bookings</h3>
          <p className="text-xs text-gray-500">
            Showing for the last 7 days
          </p>
        </div>
        <select className="bg-gray-50 border-none text-sm font-medium text-gray-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-secondary/20 cursor-pointer outline-none">
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#9ca3af"
              style={{ fontSize: '11px' }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '11px' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '8px 12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              cursor={{ stroke: 'var(--secondary)', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--secondary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBookings)"
              name="Bookings"
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--secondary)]" />
          <span className="text-xs font-medium text-gray-700">Total Bookings</span>
        </div>
      </div>
    </div>
  );
}

import { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, subValue, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <div className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Icon className="w-6 h-6 text-primary" strokeWidth={2.5} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${trend.isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
            }`}>
            {trend.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div>
        <h3 className="text-gray-500 text-sm font-medium tracking-wide uppercase mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 font-feature">{value}</span>
          {subValue && <span className="text-sm text-gray-400 font-medium">{subValue}</span>}
        </div>
      </div>
    </div>
  );
}

import { motion } from "@repo/ui/motion";
import { OccupancyStats } from "@repo/types";
import { CreditCard, MoreHorizontal } from "lucide-react";

interface OccupancyGoalCardProps {
  stats: OccupancyStats;
}

export function OccupancyGoalCard({ stats }: OccupancyGoalCardProps) {
  // Calculate percentage (clamped 0-100)
  const percentage = Math.min(Math.max((stats.occupiedRooms / stats.totalRooms) * 100, 0), 100);

  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between h-48">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Occupancy Rate</h3>
          <div className="text-3xl font-bold text-gray-900 font-feature">
            {percentage.toFixed(1)}% <span className="text-sm text-gray-400 font-normal">/ 100%</span>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{stats.occupiedRooms} Occupied</span>
          <span>{stats.totalRooms} Total Rooms</span>
        </div>

        {/* Progress Bar resembling typical "Spending Limit" bars */}
        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
          {/* Background dashed pattern (optional for style) */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, #fff 50%)', backgroundSize: '10px 100%' }}
          />

          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Target: 85%</span>
          <span className="font-bold text-blue-600">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(stats.averageDailyRate)} ADR
          </span>
        </div>
      </div>
    </div>
  );
}

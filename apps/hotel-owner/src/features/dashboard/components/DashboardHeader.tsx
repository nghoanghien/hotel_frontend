import { Search, ArrowRightLeft, LogOut, Users, BedDouble } from "lucide-react";
import { motion } from "@repo/ui/motion";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  stats: {
    arrivals: number;
    departures: number;
    inHouse: number;
    available: number;
  };
}

export function DashboardHeader({ title, subtitle, stats }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-2">
          {title}
        </h1>
        <p className="text-gray-500 font-medium">{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Real-time Stats Chips mimicking the 'Send', 'Request' style but with useful data */}

        <div className="flex items-center gap-3 p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100/60">
          <div className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer group">
            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
              <ArrowRightLeft size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Arrivals</span>
              <span className="text-sm font-bold text-gray-900 leading-none">{stats.arrivals}</span>
            </div>
          </div>

          <div className="w-[1px] h-8 bg-gray-100"></div>

          <div className="flex items-center gap-2 px-4 py-2 hover:bg-orange-50 rounded-xl transition-colors cursor-pointer group">
            <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600 group-hover:scale-110 transition-transform">
              <LogOut size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Departures</span>
              <span className="text-sm font-bold text-gray-900 leading-none">{stats.departures}</span>
            </div>
          </div>

          <div className="w-[1px] h-8 bg-gray-100"></div>

          <div className="flex items-center gap-2 px-4 py-2 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer group">
            <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600 group-hover:scale-110 transition-transform">
              <Users size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">In House</span>
              <span className="text-sm font-bold text-gray-900 leading-none">{stats.inHouse}</span>
            </div>
          </div>

          <div className="w-[1px] h-8 bg-gray-100"></div>

          <div className="flex items-center gap-2 px-4 py-2 hover:bg-green-50 rounded-xl transition-colors cursor-pointer group">
            <div className="p-1.5 bg-green-100 rounded-lg text-green-600 group-hover:scale-110 transition-transform">
              <BedDouble size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Available</span>
              <span className="text-sm font-bold text-gray-900 leading-none">{stats.available}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

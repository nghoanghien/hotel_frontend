import { InventorySummaryDto, InventoryReportItem } from '../services/reportService';
import { CheckCircle, AlertTriangle, XCircle, SprayCan, Wrench, BedDouble, Lock, PlayCircle, Building2, Warehouse } from 'lucide-react';
import { motion } from '@repo/ui/motion';
import { RoomStatus } from '@repo/types';
import { useState, useMemo } from 'react';

interface InventoryReportProps {
  data: InventorySummaryDto;
}

const RoomCard = ({ item }: { item: InventoryReportItem }) => {
  const statusConfig: Record<RoomStatus, { bg: string; border: string; text: string; icon: any }> = {
    Available: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: CheckCircle },
    Occupied: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: BedDouble },
    Dirty: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: SprayCan },
    Cleaning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: SprayCan },
    Maintenance: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: Wrench },
    OutOfOrder: { bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-700', icon: Lock },
  };

  const config = statusConfig[item.status] || statusConfig['Available'];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`p-4 rounded-2xl border-2 flex flex-col gap-2 ${config.bg} ${config.border}`}
    >
      <div className="flex justify-between items-start">
        <span className="text-2xl font-anton text-gray-900">{item.roomNumber}</span>
        <span className={`p-1.5 rounded-lg bg-white/50 ${config.text}`}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <div className="flex flex-col gap-1 mt-1">
        <span className="text-xs font-bold text-gray-500 uppercase truncate" title={item.roomType}>{item.roomType}</span>
        <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 mt-2 pt-2 border-t border-black/5">
          <span>{item.amenitiesCheck === 'Pass' ? 'Ready' : 'Check'}</span>
          <span className="truncate ml-1 capitalize" title={item.status}>{item.status}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function InventoryReport({ data }: InventoryReportProps) {
  // Safe access for items
  const items = data?.items || [];
  const [filterStatus, setFilterStatus] = useState<RoomStatus | 'All'>('All');

  const filteredItems = useMemo(() => {
    if (filterStatus === 'All') return items;
    return items.filter(item => item.status === filterStatus);
  }, [items, filterStatus]);

  const SummaryCard = ({
    title,
    count,
    icon: Icon,
    status,
    colorClass,
    bgClass,
    borderClass
  }: {
    title: string, count: number, icon: any, status: RoomStatus | 'All', colorClass: string, bgClass: string, borderClass: string
  }) => {
    const isActive = filterStatus === status;

    return (
      <button
        onClick={() => setFilterStatus(status)}
        // Always apply bgClass, borderClass, and colorClass regardless of active state
        className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left w-full h-full flex flex-col justify-between group
                ${bgClass} ${borderClass}
                ${isActive ? 'ring-2 ring-offset-2 ring-lime-500 shadow-md scale-105' : 'hover:shadow-md hover:scale-[1.02]'}
            `}
      >
        <div className="flex justify-between items-start w-full">
          <span className={`text-xs font-bold uppercase tracking-wider ${colorClass}`}>
            {title}
          </span>
          <div className={`p-2 rounded-xl bg-white/50 transition-colors`}>
            <Icon className={`w-5 h-5 ${colorClass}`} />
          </div>
        </div>

        <div className="mt-2">
          <span className={`text-3xl font-anton text-gray-900`}>{count}</span>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <SummaryCard
          title="Total Rooms"
          count={data?.totalRooms || 0}
          icon={Building2}
          status="All"
          bgClass="bg-gray-100"
          borderClass="border-gray-300"
          colorClass="text-gray-700"
        />
        <SummaryCard
          title="Available"
          count={data?.availableRooms || 0}
          icon={CheckCircle}
          status="Available"
          bgClass="bg-green-50"
          borderClass="border-green-200"
          colorClass="text-green-700"
        />
        <SummaryCard
          title="Occupied"
          count={data?.occupiedRooms || 0}
          icon={BedDouble}
          status="Occupied"
          bgClass="bg-blue-50"
          borderClass="border-blue-200"
          colorClass="text-blue-700"
        />
        <SummaryCard
          title="Dirty"
          count={data?.dirtyRooms || 0}
          icon={SprayCan}
          status="Dirty"
          bgClass="bg-orange-50"
          borderClass="border-orange-200"
          colorClass="text-orange-700"
        />
        <SummaryCard
          title="Maintenance"
          count={data?.maintenanceRooms || 0}
          icon={Wrench}
          status="Maintenance"
          bgClass="bg-red-50"
          borderClass="border-red-200"
          colorClass="text-red-700"
        />
      </div>

      {/* Room Grid */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-lg shadow-gray-100/50 min-h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Room Status Overview
            {filterStatus !== 'All' && (
              <span className="bg-black/5 text-black/60 px-2 py-1 rounded text-xs uppercase font-bold">
                Filtered: {filterStatus}
              </span>
            )}
          </h4>
          <span className="text-xs font-bold text-gray-400">{filteredItems.length} rooms showing</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-10 text-gray-400 italic">No room inventory data available.</div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
            <Warehouse className="w-10 h-10 mb-2 opacity-20" />
            <p>No rooms found with status "{filterStatus}"</p>
            <button onClick={() => setFilterStatus('All')} className="text-lime-600 font-bold text-sm mt-2 hover:underline">
              Clear filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredItems.map((item) => (
              <RoomCard key={item.roomId} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

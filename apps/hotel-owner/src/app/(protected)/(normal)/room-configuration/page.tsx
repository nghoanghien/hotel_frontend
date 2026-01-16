'use client';

import React, { useRef } from 'react';
import { Plus } from '@repo/ui/icons';
import RoomConfigurationTable, { RoomConfigurationTableRef } from '../../../../features/rooms/components/configuration/RoomConfigurationTable';

export default function RoomConfigurationPage() {
  const tableRef = useRef<RoomConfigurationTableRef>(null);

  const handleCreate = () => {
    if (tableRef.current) {
      tableRef.current.openCreateForm();
    }
  };

  return (
    <div className="min-h-screen pb-20 px-6 pt-8 w-full max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-4xl font-anton font-bold text-[#1A1A1A] mb-2">Room Configuration</h1>
          <p className="text-gray-500 font-medium text-lg">Set up room types, pricing, and amenities.</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-[#1A1A1A] text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
        >
          <Plus size={20} /> Create New Room
        </button>
      </div>

      {/* Main Content Area */}
      <RoomConfigurationTable ref={tableRef} />

    </div>
  );
}

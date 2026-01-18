'use client';

import React, { useRef } from 'react';
import { Hotel, Plus } from '@repo/ui/icons';
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
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Hotel size={12} />
              Room List
            </span>
          </div>
          <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
            Room Configuration
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage room status, availability and maintenance.</p>
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

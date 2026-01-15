import React, { useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { Plus, Edit, Trash2, Search, Filter } from '@repo/ui/icons';
import { DataTable, ColumnDef, LoadingSpinner, InputField } from '@repo/ui';
import { RoomDto } from '@repo/types';
import { mockRooms } from '../../data/mockRooms';
import RoomForm from './RoomForm';

export default function RoomConfigurationPage() {
  const [data, setData] = useState<RoomDto[]>(mockRooms);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomDto | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;
    const lower = searchQuery.toLowerCase();
    return data.filter(r => r.roomNumber.toLowerCase().includes(lower) || r.type.toLowerCase().includes(lower));
  }, [data, searchQuery]);

  // Handle Sort Function
  const handleSort = (key: string) => {
    // Basic sort implementation
    const sorted = [...data].sort((a, b) => {
      const valA = a[key as keyof RoomDto];
      const valB = b[key as keyof RoomDto];
      if (typeof valA === 'string' && typeof valB === 'string') return valA.localeCompare(valB);
      if (typeof valA === 'number' && typeof valB === 'number') return valA - valB;
      return 0;
    });
    setData(sorted);
  };

  const columns: ColumnDef<RoomDto>[] = [
    {
      label: 'Room',
      key: 'roomNumber',
      className: 'w-[100px]',
      formatter: (val, item) => <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm">{item.roomNumber}</span>
    },
    {
      label: 'Type',
      key: 'type',
      formatter: (val, item) => (
        <div>
          <div className="font-bold text-gray-900">{item.type}</div>
          <div className="text-xs text-gray-400">Floor {item.floor}</div>
        </div>
      )
    },
    {
      label: 'Features',
      key: 'bedType',
      formatter: (val, item) => (
        <div className="text-sm text-gray-600">
          <span className="font-medium">{item.numberOfBeds}x {item.bedType}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span>{item.sizeInSquareMeters}m²</span>
        </div>
      )
    },
    {
      label: 'Base Price',
      key: 'basePrice',
      formatter: (val, item) => (
        <span className="font-bold text-gray-900">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.basePrice)}
        </span>
      )
    }
  ];

  const handleCreate = () => {
    setEditingRoom(null);
    setIsFormOpen(true);
  };

  const handleEdit = (room: RoomDto) => {
    setEditingRoom(room);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this room configuration?')) {
      setData(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleFormSuccess = () => {
    // Reload data here or update local state
    // simple mock reload simulation
    const newData = [...data]; // In real app, fetch fresh data
    setData(newData);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/50 p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-anton font-bold text-gray-900 tracking-tight">Room Configuration</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage room types, pricing, and features.</p>
        </div>

        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-[#1A1A1A] text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
        >
          <Plus size={20} />
          Create New Room
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col flex-1">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-2 focus:ring-gray-100 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 bg-gray-50 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          <DataTable
            data={filteredData}
            columns={columns}
            handleSort={handleSort} // Passed handleSort to fix TS Error
            renderActions={(item) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleEdit(item) }}
                  className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                  title="Edit Configuration"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}
                  className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                  title="Delete Room"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            onRowClick={handleEdit}
            headerClassName="bg-white text-gray-400 border-b border-gray-100 uppercase text-xs font-bold tracking-widest px-6 py-4"
            rowClassName="hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-none"
          />
        </div>
      </div>

      {/* Slide-over Form Drawer */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[80]"
              onClick={() => setIsFormOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white z-[90] shadow-2xl flex flex-col"
            >
              <RoomForm
                initialData={editingRoom}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleFormSuccess}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

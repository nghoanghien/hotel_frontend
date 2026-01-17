import { useState, useMemo, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { DataTable, ColumnDef, useNotification, useSwipeConfirmation, getAmenityIcon } from '@repo/ui';
import { Search, Edit, Lock, Unlock, X } from '@repo/ui/icons';
import { Amenity, AmenityType } from '@repo/types';
import { amenityService } from '../services/amenityService';
import EditAmenityModal from './EditAmenityModal';
import CustomSelect from './CustomSelect';

// Helper to get type label
const getTypeLabel = (type: AmenityType): string => {
  const labels: Record<AmenityType, string> = {
    [AmenityType.General]: 'General',
    [AmenityType.Room]: 'Room',
    [AmenityType.Bathroom]: 'Bathroom',
    [AmenityType.Kitchen]: 'Kitchen',
    [AmenityType.Entertainment]: 'Entertainment',
    [AmenityType.Service]: 'Service',
    [AmenityType.Facilities]: 'Facilities',
  };
  return labels[type];
};

// Helper to get type color
const getTypeColor = (type: AmenityType): string => {
  const colors: Record<AmenityType, string> = {
    [AmenityType.General]: 'bg-gray-50 text-gray-700 border-gray-200',
    [AmenityType.Room]: 'bg-blue-50 text-blue-700 border-blue-200',
    [AmenityType.Bathroom]: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    [AmenityType.Kitchen]: 'bg-orange-50 text-orange-700 border-orange-200',
    [AmenityType.Entertainment]: 'bg-purple-50 text-purple-700 border-purple-200',
    [AmenityType.Service]: 'bg-green-50 text-green-700 border-green-200',
    [AmenityType.Facilities]: 'bg-pink-50 text-pink-700 border-pink-200',
  };
  return colors[type];
};

const columns: ColumnDef<Amenity>[] = [
  {
    label: 'AMENITY',
    key: 'name',
    className: 'min-w-[250px]',
    formatter: (_: any, item: Amenity) => {
      const IconComp = getAmenityIcon(item.name);
      return (
        <div className="flex items-center gap-4 group">
          <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
            <div className="w-11 h-11 rounded-2xl bg-lime-50 flex items-center justify-center shadow-sm border border-lime-100">
              <IconComp size={20} className="text-lime-600" strokeWidth={1.5} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 group-hover:text-lime-700 transition-colors text-[13px] leading-tight">
              {item.name}
            </span>
            {item.description && (
              <span className="text-[11px] font-medium text-gray-400 mt-0.5 line-clamp-1">
                {item.description}
              </span>
            )}
          </div>
        </div>
      );
    }
  },
  {
    label: 'TYPE',
    key: 'type',
    className: 'min-w-[140px]',
    formatter: (_: any, item: Amenity) => (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${getTypeColor(item.type)}`}>
        {getTypeLabel(item.type)}
      </div>
    )
  },
  {
    label: 'STATUS',
    key: 'isActive',
    className: 'min-w-[120px] text-center',
    formatter: (_: any, item: Amenity) => (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${item.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
        {item.isActive ? 'ACTIVE' : 'INACTIVE'}
      </div>
    )
  }
];

interface AmenityListProps {
  refreshTrigger?: number;
}

export default function AmenityList({ refreshTrigger = 0 }: AmenityListProps) {
  const [data, setData] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();
  const [sortConfig, setSortConfig] = useState<{ key: keyof Amenity; direction: 'asc' | 'desc' } | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<AmenityType | 'all'>('all');

  // Modals
  const [selectedAmenityEdit, setSelectedAmenityEdit] = useState<Amenity | null>(null);

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await amenityService.getAllAmenities();
      setData(res);
    } catch (e) {
      showNotification({ message: 'Failed to load amenities', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: string) => {
    const typedKey = key as keyof Amenity;
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === typedKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: typedKey, direction });
  };

  const handleToggleStatus = (amenity: Amenity) => {
    const isDeactivating = amenity.isActive;
    confirm({
      title: isDeactivating ? 'Deactivate Amenity?' : 'Activate Amenity?',
      description: isDeactivating
        ? `Deactivating "${amenity.name}" will hide it from selection options for all hotels.`
        : `Activating "${amenity.name}" will make it available for selection.`,
      confirmText: isDeactivating ? 'SWIPE TO DEACTIVATE' : 'SWIPE TO ACTIVATE',
      type: isDeactivating ? 'danger' : 'success',
      onConfirm: async () => {
        try {
          await amenityService.updateAmenity(amenity.id, { isActive: !amenity.isActive });
          showNotification({ message: `Amenity ${isDeactivating ? 'deactivated' : 'activated'} successfully`, type: 'success' });
          loadData();
        } catch (e) {
          showNotification({ message: 'Failed to update amenity status', type: 'error' });
        }
      }
    });
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchQuery) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(item => item.type === filterType);
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = (a[sortConfig!.key] as any) || '';
        const bVal = (b[sortConfig!.key] as any) || '';
        if (aVal < bVal) return sortConfig!.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig!.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, filterType, sortConfig]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden w-full"
    >
      {/* Header with Actions */}
      <div className="pb-4 p-8 border-b border-gray-50 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-lime-400 rounded-full" />
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Amenities Catalog</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5">Manage standard amenities for all hotels</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-lime-200 focus:bg-white transition-all"
            />
          </div>

          {/* Type Filter */}
          <CustomSelect
            value={filterType}
            onChange={(value) => setFilterType(value === 'all' ? 'all' : value as AmenityType)}
            options={[
              { value: 'all', label: 'All Types' },
              { value: AmenityType.General, label: 'General' },
              { value: AmenityType.Room, label: 'Room' },
              { value: AmenityType.Bathroom, label: 'Bathroom' },
              { value: AmenityType.Kitchen, label: 'Kitchen' },
              { value: AmenityType.Entertainment, label: 'Entertainment' },
              { value: AmenityType.Service, label: 'Service' },
              { value: AmenityType.Facilities, label: 'Facilities' },
            ]}
            placeholder="Filter by type"
            className="w-48"
          />
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        <DataTable<Amenity>
          data={filteredAndSortedData}
          columns={columns}
          handleSort={handleSort}
          sortField={sortConfig?.key}
          sortDirection={sortConfig?.direction}
          renderActions={(item) => (
            <div className="flex items-center gap-2">
              <motion.button
                onClick={(e) => { e.stopPropagation(); setSelectedAmenityEdit(item); }}
                className="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 shadow-sm transition-colors"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                title="Edit Amenity"
              >
                <Edit size={18} />
              </motion.button>

              <motion.button
                onClick={(e) => { e.stopPropagation(); handleToggleStatus(item); }}
                className={`p-2 rounded-xl shadow-sm transition-colors ${item.isActive
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                title={item.isActive ? "Deactivate" : "Activate"}
              >
                {item.isActive ? <Lock size={18} /> : <Unlock size={18} />}
              </motion.button>
            </div>
          )}
          onRowClick={(item) => setSelectedAmenityEdit(item)}
          headerClassName="bg-gray-200 text-gray-900 border-none rounded-xl py-4 mb-2"
          headerCellClassName="text-[11px] font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-300 transition-colors"
          tableContainerClassName="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          rowClassName="hover:bg-gray-100 transition-colors cursor-pointer"
        />
      </div>

      {/* Modals */}
      <EditAmenityModal
        isOpen={!!selectedAmenityEdit}
        amenity={selectedAmenityEdit}
        onClose={() => setSelectedAmenityEdit(null)}
        onSuccess={loadData}
      />
    </motion.div>
  );
}


import { DataTable, ColumnDef, useNotification, LoadingSpinner, ImageWithFallback } from '@repo/ui';
import { motion } from '@repo/ui/motion';
import { Search, Filter, X, MapPin, Star, Building2, Edit, LocateFixed } from '@repo/ui/icons';
import { useState, useMemo } from 'react';
import { HotelWithLocation, HotelUiStatus } from '../services/hotelService';
import HotelFilterModal, { HotelFilterFields } from './HotelFilterModal';
import HotelSearchPopup from './HotelSearchPopup';
import EditHotelModal from './EditHotelModal';

const columns: ColumnDef<HotelWithLocation>[] = [
  {
    label: 'ID',
    key: 'id',
    className: 'w-[80px]',
    formatter: (value: any, item: HotelWithLocation) => (
      <span className="font-mono text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">
        #{item.id.split('-').pop()}
      </span>
    )
  },
  {
    label: 'HOTEL',
    key: 'name',
    className: 'min-w-[240px]',
    formatter: (value: any, item: HotelWithLocation) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 relative">
          <ImageWithFallback
            src={item.imageUrl || ''}
            alt={item.name}
            fill={true}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 text-sm line-clamp-1" title={item.name}>{item.name}</span>
          <div className="text-[10px] text-gray-500 flex items-center gap-1">
            <MapPin size={10} className="text-gray-400" />
            <span className="truncate max-w-[150px]">{item.city}, {item.country}</span>
          </div>
        </div>
      </div>
    )
  },
  {
    label: 'RATING',
    key: 'starRating',
    className: 'min-w-[100px]',
    formatter: (value: any, item: HotelWithLocation) => (
      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 w-fit">
        <Star size={12} className="text-amber-500 fill-amber-500" />
        <span className="text-xs font-bold text-amber-700">{item.starRating}</span>
      </div>
    )
  },
  {
    label: 'ROOMS',
    key: 'totalRooms',
    className: 'min-w-[100px]',
    formatter: (value: any, item: HotelWithLocation) => (
      <div className="flex items-center gap-1.5">
        <Building2 size={14} className="text-gray-400" />
        <span className="text-sm font-bold text-gray-700">{item.totalRooms || 0}</span>
      </div>
    )
  },
  {
    label: 'STATUS',
    key: 'uiStatus',
    formatter: (value: any, item: HotelWithLocation) => {
      const config = {
        Active: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', label: 'Active' },
        Maintenance: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', label: 'Maintenance' },
        Suspended: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', label: 'Suspended' },
      }[item.uiStatus || 'Active'];

      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${config.bg} ${config.text} ${config.border}`}>
          {config.label}
        </span>
      )
    }
  }
];

interface HotelsTableProps {
  data: HotelWithLocation[];
  isLoading: boolean;
  onViewMap: (hotel?: HotelWithLocation) => void;
  onRefresh: () => void;
}

export default function HotelsTable({ data, isLoading, onViewMap, onRefresh }: HotelsTableProps) {
  const { showNotification } = useNotification();
  const [sortConfig, setSortConfig] = useState<{ key: keyof HotelWithLocation; direction: 'asc' | 'desc' } | null>(null);

  // Modals & Local Filter State
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchFields, setSearchFields] = useState({ query: '' });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterFields, setFilterFields] = useState<HotelFilterFields>({
    uiStatus: '',
    starRating: [],
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelWithLocation | null>(null);

  const handleSort = (key: string) => {
    const typedKey = key as keyof HotelWithLocation;
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === typedKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: typedKey, direction });
  };

  const toggleSearch = () => {
    if (!isSearchExpanded) setIsFilterModalOpen(false);
    setIsSearchExpanded(prev => !prev);
  };

  const clearFilters = () => {
    setFilterFields({
      uiStatus: '',
      starRating: [],
    });
  };

  const isFiltered = useMemo(() => {
    return filterFields.uiStatus !== '' || filterFields.starRating.length > 0;
  }, [filterFields]);

  // Handle Actions
  const handleEdit = (e: React.MouseEvent, hotel: HotelWithLocation) => {
    e.stopPropagation();
    setSelectedHotel(hotel);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    onRefresh(); // Trigger parent refresh
  };

  // Filter & Sort Logic (Local)
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply Search
    if (searchFields.query) {
      const query = searchFields.query.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(query) ||
        (item.city || '').toLowerCase().includes(query) ||
        (item.address || '').toLowerCase().includes(query)
      );
    }

    // Apply Filters
    result = result.filter(item => {
      const statusMatch = filterFields.uiStatus === '' || item.uiStatus === filterFields.uiStatus;
      // @ts-ignore
      const ratingMatch = filterFields.starRating.length === 0 || filterFields.starRating.includes(item.starRating);
      return statusMatch && ratingMatch;
    });

    // Apply Sort
    if (sortConfig) {
      result.sort((a, b) => {
        // @ts-ignore
        const aValue = (a[sortConfig.key] ?? '') as string | number;
        // @ts-ignore
        const bValue = (b[sortConfig.key] ?? '') as string | number;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, sortConfig, searchFields, filterFields]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden w-full max-w-[calc(100vw-2rem)] md:max-w-full border border-gray-100"
    >
      {/* Header */}
      <div className="pb-4 p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-lime-400 rounded-full" />
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Hotel Management</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5">
            Manage your hotel chain, properties and statuses
          </p>
        </div>

        {/* Right: Search & Filter */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            onClick={toggleSearch}
            className={`w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group ${isSearchExpanded ? 'bg-lime-100 border-lime-200 text-lime-700' : 'border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200'}`}
            title="Search"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {isFiltered ? (
            <div className="flex items-center gap-1 p-1 pr-2 bg-lime-500 rounded-full shadow-lg shadow-lime-200/50 border border-lime-400 animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-lime-600 rounded-full transition-colors"
              >
                <Filter className="w-4 h-4 text-white fill-current" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">Filtered</span>
              </button>
              <button
                onClick={clearFilters}
                className="p-1.5 hover:bg-lime-600 text-white rounded-full transition-colors"
                title="Clear all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
              title="Filter"
            >
              <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>

      <div className="px-6 relative">
        <HotelSearchPopup
          isOpen={isSearchExpanded}
          onClose={() => setIsSearchExpanded(false)}
          searchFields={searchFields}
          handleSearchChange={(key: string, value: string) => setSearchFields(prev => ({ ...prev, [key]: value }))}
          clearSearchFields={() => setSearchFields({ query: '' })}
        />
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <LoadingSpinner size={40} color="#1A1A1A" />
          </div>
        ) : (
          <DataTable<HotelWithLocation>
            data={filteredAndSortedData}
            columns={columns}
            handleSort={handleSort}
            sortField={sortConfig?.key}
            sortDirection={sortConfig?.direction}
            renderActions={(item) => (
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={(e) => handleEdit(e, item)}
                  className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-[#1A1A1A] hover:text-white shadow-sm transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Edit Hotel"
                >
                  <Edit size={16} />
                </motion.button>

                <motion.button
                  onClick={(e: any) => { e.stopPropagation(); onViewMap(item); }}
                  className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Locate on Map"
                >
                  <LocateFixed size={16} />
                </motion.button>
              </div>
            )}
            headerClassName="bg-gray-100 text-gray-500 border-none rounded-xl py-4 mb-2"
            headerCellClassName="text-[11px] font-bold uppercase tracking-widest hover:text-[#1A1A1A] transition-colors"
            tableContainerClassName="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
            onRowClick={(item) => {
              setSelectedHotel(item);
              setIsEditModalOpen(true);
            }}
          />
        )}
      </div>

      <EditHotelModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        hotel={selectedHotel}
        onSuccess={handleEditSuccess}
      />

      <HotelFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterFields={filterFields}
        onApply={setFilterFields}
      />

    </motion.div>
  );
}

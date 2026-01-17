import { useState, useMemo, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { DataTable, ColumnDef, useNotification, useSwipeConfirmation, LoadingSpinner } from '@repo/ui';
import { Search, Filter, Download, Building2, MapPin, Globe, CheckCircle, XCircle, X, Eye, Edit, Lock, Unlock } from '@repo/ui/icons';
import { brandPartnersService } from '@/features/brand-partners/services/brandPartnersService';
import { Brand } from '@repo/types';
import BrandSearchPopup from './BrandSearchPopup';
import BrandFilterModal, { BrandFilterFields } from './BrandFilterModal';
import BrandExportModal from './BrandExportModal';
import ViewBrandModal from './ViewBrandModal';
import EditBrandModal from './EditBrandModal';

const columns: ColumnDef<Brand>[] = [
  {
    label: 'BRAND IDENTITY',
    key: 'name',
    className: 'min-w-[200px]',
    formatter: (_: any, item: Brand) => {
      // Check if logo is a generic generated avatar or missing
      const isGenericLogo = !item.logoUrl || item.logoUrl.includes('ui-avatars.com');

      return (
        <div className="flex items-center gap-4 group">
          <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
            {!isGenericLogo ? (
              <img
                src={item.logoUrl}
                alt={item.name}
                className="w-11 h-11 rounded-2xl object-cover bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 p-0.5"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-[#1A1A1A] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-800">
                <Building2 size={20} className="text-white" strokeWidth={1.5} />
              </div>
            )}
            {item.isActive && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full bg-lime-500 shadow-sm" title="Active" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 group-hover:text-lime-700 transition-colors text-[13px] leading-tight">
              {item.name}
            </span>
            {item.website && (
              <a
                href={item.website}
                target="_blank"
                onClick={e => e.stopPropagation()}
                className="text-[11px] font-medium text-gray-400 hover:text-blue-500 flex items-center gap-1.5 mt-1 transition-colors w-fit"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <Globe size={8} className="text-gray-500" />
                </div>
                {item.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </a>
            )}
          </div>
        </div>
      );
    }
  },
  {
    label: 'HEADQUARTERS',
    key: 'city',
    className: 'min-w-[150px]',
    formatter: (_: any, item: Brand) => (
      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
        <MapPin size={14} className="text-gray-400" />
        {item.city}, {item.country}
      </div>
    )
  },
  {
    label: 'INVENTORY',
    key: 'hotelCount',
    className: 'min-w-[100px] text-center',
    formatter: (_: any, item: Brand) => (
      <div className="inline-flex flex-col items-center">
        <span className="text-lg font-anton text-gray-900">{item.hotelCount}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Hotels</span>
      </div>
    )
  },
  {
    label: 'STATUS',
    key: 'isActive',
    className: 'min-w-[120px] text-center',
    formatter: (_: any, item: Brand) => (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${item.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
        {item.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
        {item.isActive ? 'ACTIVE' : 'SUSPENDED'}
      </div>
    )
  }
];

interface BrandListProps {
  refreshTrigger?: number;
}

export default function BrandList({ refreshTrigger = 0 }: BrandListProps) {
  const [data, setData] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();
  const [sortConfig, setSortConfig] = useState<{ key: keyof Brand; direction: 'asc' | 'desc' } | null>(null);

  // Search & Filter State
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchFields, setSearchFields] = useState({ query: '', city: '', country: '' });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterFields, setFilterFields] = useState<BrandFilterFields>({
    status: '',
  });

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedBrandView, setSelectedBrandView] = useState<Brand | null>(null);
  const [selectedBrandEdit, setSelectedBrandEdit] = useState<Brand | null>(null);

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await brandPartnersService.getAllBrands();
      setData(res);
    } catch (e) {
      showNotification({ message: 'Failed to load brands', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: string) => {
    const typedKey = key as keyof Brand;
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
    setFilterFields({ status: '' });
  };

  const handleExport = async (format: 'pdf' | 'excel', scope: 'current' | 'all', columns: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Exporting ${scope} data as ${format} with columns: ${columns.join(', ')}`);
    // Implement actual export call
  };

  const handleToggleStatus = (brand: Brand) => {
    const isSuspending = brand.isActive;
    confirm({
      title: isSuspending ? 'Suspend Brand?' : 'Activate Brand?',
      description: isSuspending
        ? `Suspending ${brand.name} will immediately block access for ALL users and hotels associated with this brand.`
        : `Activating ${brand.name} will restore access for all users and hotels.`,
      confirmText: isSuspending ? 'SWIPE TO SUSPEND' : 'SWIPE TO ACTIVATE',
      type: isSuspending ? 'danger' : 'success',
      onConfirm: async () => {
        try {
          await brandPartnersService.updateBrand(brand.id, { isActive: !brand.isActive });
          showNotification({ message: `Brand ${isSuspending ? 'suspended' : 'activated'} successfully`, type: 'success' });
          loadData();
        } catch (e) {
          showNotification({ message: 'Failed to update brand status', type: 'error' });
        }
      }
    });
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Search (Combined logic)
    if (searchFields.query) {
      result = result.filter(item => item.name.toLowerCase().includes(searchFields.query.toLowerCase()));
    }
    if (searchFields.city) {
      result = result.filter(item => item.city?.toLowerCase().includes(searchFields.city.toLowerCase()));
    }
    if (searchFields.country) {
      result = result.filter(item => item.country?.toLowerCase().includes(searchFields.country.toLowerCase()));
    }

    // Filter
    if (filterFields.status) {
      const isActive = filterFields.status === 'Active';
      result = result.filter(item => item.isActive === isActive);
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
  }, [data, filterFields, searchFields, sortConfig]);

  const isFiltered = useMemo(() => {
    return filterFields.status !== '';
  }, [filterFields]);

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
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Brand Portfolio</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5">Overview of all partner brands and performance</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Toggle */}
          <button
            onClick={toggleSearch}
            className={`w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group ${isSearchExpanded ? 'bg-lime-100 border-lime-200 text-lime-700' : 'border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200'}`}
            title="Search"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Filter Toggle */}
          {isFiltered ? (
            <div className="flex items-center gap-1 p-1 pr-2 bg-lime-500 rounded-xl shadow-lg shadow-lime-200/50 border border-lime-400 group transition-all animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-lime-600 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4 text-white fill-current" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">Filtered</span>
              </button>
              <div className="w-px h-4 bg-lime-400 mx-0.5" />
              <button
                onClick={clearFilters}
                className="p-1.5 hover:bg-lime-600 text-white rounded-lg transition-colors"
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

          {/* Export Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="w-12 h-12 rounded-full bg-gray-100 border border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm flex items-center justify-center group"
            title="Export"
          >
            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

        </div>
      </div>

      {/* Search Popup Area */}
      <div className="px-6 relative">
        <BrandSearchPopup
          isOpen={isSearchExpanded}
          onClose={() => setIsSearchExpanded(false)}
          onSearch={(filters) => setSearchFields(prev => ({ ...prev, ...filters }))}
        />
      </div>

      {/* Filters Display */}
      {isFiltered && (
        <div className="px-8 pt-4 pb-0 flex flex-wrap items-center gap-2 animate-in slide-in-from-top-2 duration-300">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">Active Filters:</span>
          {filterFields.status && (
            <button onClick={() => setFilterFields(prev => ({ ...prev, status: '' }))} className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all">
              <span>Status: <span className="text-lime-600 font-extrabold group-hover:text-red-500 transition-colors uppercase">{filterFields.status}</span></span>
              <X className="w-3 h-3 opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 ease-out" />
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="p-4">
        <DataTable<Brand>
          data={filteredAndSortedData}
          columns={columns}
          handleSort={handleSort}
          sortField={sortConfig?.key}
          sortDirection={sortConfig?.direction}
          renderActions={(item) => (
            <div className="flex items-center gap-2">
              <motion.button
                onClick={(e) => { e.stopPropagation(); setSelectedBrandView(item); }}
                className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm transition-colors"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                title="View Profile"
              >
                <Eye size={18} />
              </motion.button>

              <motion.button
                onClick={(e) => { e.stopPropagation(); setSelectedBrandEdit(item); }}
                className="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 shadow-sm transition-colors"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                title="Edit Details"
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
                title={item.isActive ? "Suspend Access" : "Activate Access"}
              >
                {item.isActive ? <Lock size={18} /> : <Unlock size={18} />}
              </motion.button>
            </div>
          )}
          onRowClick={(item) => setSelectedBrandView(item)}
          headerClassName="bg-gray-200 text-gray-900 border-none rounded-xl py-4 mb-2"
          headerCellClassName="text-[11px] font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-300 transition-colors"
          tableContainerClassName="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          rowClassName="hover:bg-gray-100 transition-colors cursor-pointer"
        />
      </div>

      {/* Modals */}
      <BrandFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterFields={filterFields}
        onApply={setFilterFields}
      />

      <BrandExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        previewData={filteredAndSortedData}
      />

      <EditBrandModal
        isOpen={!!selectedBrandEdit}
        brand={selectedBrandEdit}
        onClose={() => setSelectedBrandEdit(null)}
        onSuccess={loadData}
      />

      <ViewBrandModal
        isOpen={!!selectedBrandView}
        brand={selectedBrandView}
        onClose={() => setSelectedBrandView(null)}
      />

    </motion.div>
  );
}

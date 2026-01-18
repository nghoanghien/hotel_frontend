
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  Building2, Search, Filter, Plus, FileText, Tag,
  Trash2, Edit, Play, Pause, AlertCircle, Calendar, Globe, X
} from '@repo/ui/icons';
import { DataTable, LoadingSpinner, StatusBadge, useNotification, ColumnDef, useSwipeConfirmation } from '@repo/ui';
import { Promotion, PromotionStatus, promotionService, DiscountType } from '../services/promotionService';
import PromotionSearchPopup from './PromotionSearchPopup';
import PromotionFilterModal, { PromotionFilterFields } from './PromotionFilterModal';
import { format } from 'date-fns';

interface PromotionsTableProps {
  data: Promotion[];
  isLoading: boolean;
  onRefresh: () => void;
  onEdit: (promo: Promotion) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: PromotionStatus) => void;
}

export default function PromotionsTable({ data, isLoading, onRefresh, onEdit, onDelete, onToggleStatus }: PromotionsTableProps) {
  const { confirm } = useSwipeConfirmation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchFields, setSearchFields] = useState({ query: '' });
  const [filterFields, setFilterFields] = useState<PromotionFilterFields>({
    status: '',
    hotelId: ''
  });

  const handleActionRequest = (promo: Promotion, type: 'delete' | 'toggle_status') => {
    const isDelete = type === 'delete';
    const isPause = type === 'toggle_status' && promo.status === PromotionStatus.Active;

    confirm({
      title: isDelete ? 'Delete Campaign?' : (isPause ? 'Pause Campaign?' : 'Activate Campaign?'),
      description: isDelete
        ? "This action cannot be undone. The campaign will be permanently removed."
        : (isPause
          ? "Pausing will prevent users from applying this code."
          : "Activating will allow users to apply this code immediately."),
      confirmText: isDelete ? "Slide to Recycle" : "Slide to Confirm",
      type: isDelete ? 'danger' : 'warning',
      confirmDetails: {
        "Campaign": promo.name,
        "Code": promo.code
      },
      onConfirm: async () => {
        if (type === 'delete') {
          await onDelete(promo.id);
        } else {
          await onToggleStatus(promo.id, promo.status);
        }
      }
    });

  };

  const filteredData = useMemo(() => {
    return data.filter(promo => {
      // Search
      const searchLower = searchFields.query.toLowerCase();
      const matchesSearch = !searchFields.query ||
        promo.name.toLowerCase().includes(searchLower) ||
        promo.code.toLowerCase().includes(searchLower);

      // Filter Status
      const matchesStatus = !filterFields.status || filterFields.status === 'All' || promo.status === filterFields.status;

      // Filter Hotel
      const matchesHotel = !filterFields.hotelId || filterFields.hotelId === 'All' ||
        (promo.applyToAllHotels) ||
        (promo.appliedHotelIds.includes(filterFields.hotelId));

      return matchesSearch && matchesStatus && matchesHotel;
    });
  }, [data, searchFields, filterFields]);

  const activeFiltersCount = [
    filterFields.status,
    filterFields.hotelId
  ].filter(Boolean).length;

  const columns: ColumnDef<Promotion>[] = [
    {
      label: 'Campaign Info',
      key: 'name',
      formatter: (_, active: Promotion) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-lime-100 text-lime-600 flex items-center justify-center shadow-lg shadow-lime-100">
            <Tag size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="font-bold text-[#1A1A1A] text-base">{active.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs font-bold text-lime-700 bg-lime-50 px-1.5 py-0.5 rounded border border-lime-200 uppercase tracking-wider">{active.code}</span>
              <span className="text-xs text-gray-400 truncate max-w-[150px]">{active.description}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'Value',
      key: 'discountValue',
      formatter: (_, active: Promotion) => (
        <div>
          <div className="font-anton text-xl text-[#1A1A1A]">
            {active.discountType === DiscountType.Percentage ? `${active.discountValue}%` : `$${(active.discountValue / 1000).toFixed(0)}k`}
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {active.discountType === DiscountType.Percentage ? 'OFF' : 'FIXED'}
          </div>
        </div>
      )
    },
    {
      label: 'Usage Limit',
      key: 'maxUsage',
      formatter: (_, active: Promotion) => {
        const percent = Math.min(100, (active.usageCount / active.maxUsage) * 100);
        const isNearFull = percent > 80;
        return (
          <div className="w-[120px]">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className={isNearFull ? "text-orange-500" : "text-gray-600"}>{active.usageCount} used</span>
              <span className="text-gray-400">/ {active.maxUsage}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isNearFull ? 'bg-orange-500' : 'bg-lime-500'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      label: 'Scope & Period',
      key: 'startDate',
      formatter: (_, active: Promotion) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            {active.applyToAllHotels ? (
              <><Globe size={12} className="text-blue-500" /> Global (All Hotels)</>
            ) : (
              <><Building2 size={12} className="text-orange-500" /> {active.appliedHotelIds.length} Locations</>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
            <Calendar size={10} />
            {format(new Date(active.startDate), 'MMM d')} - {format(new Date(active.endDate), 'MMM d, yyyy')}
          </div>
        </div>
      )
    },
    {
      label: 'Status',
      key: 'status',
      formatter: (_, active: Promotion) => {
        const config = {
          [PromotionStatus.Active]: { bg: 'bg-lime-100', text: 'text-lime-700', label: 'Running' },
          [PromotionStatus.Paused]: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Paused' },
          [PromotionStatus.Expired]: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Ended' },
          [PromotionStatus.Draft]: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Draft' },
        }[active.status];

        return (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        );
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header with Title and Search/Filter actions */}
      <div className="pb-4 p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-lime-400 rounded-full" />
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Active Campaigns</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5">
            Monitor and manage your marketing promotions efficiently.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group ${isSearchOpen ? 'bg-lime-100 border-lime-200 text-lime-700' : 'border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200'}`}
            title="Search"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {activeFiltersCount > 0 ? (
            <div className="flex items-center gap-1 p-1 pr-2 bg-lime-500 rounded-2xl shadow-lg shadow-lime-200/50 border border-lime-400 animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-lime-600 rounded-2xl transition-colors"
              >
                <Filter className="w-4 h-4 text-white fill-current" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">Filtered</span>
              </button>
              <button
                onClick={() => setFilterFields({ status: '', hotelId: '' })}
                className="p-1.5 hover:bg-lime-600 text-white rounded-2xl transition-colors"
                title="Clear all"
              >
                <X size={16} className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
              title="Filter"
            >
              <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="py-20 flex justify-center"><LoadingSpinner /></div>
        ) : (
          <DataTable<Promotion>
            data={filteredData}
            columns={columns}
            handleSort={(key) => console.log('Sort by', key)}
            renderActions={(promo) => (
              <div className="flex items-center gap-2">
                {/* Main Action based on Status */}
                {promo.status === PromotionStatus.Active ? (
                  <button
                    onClick={() => handleActionRequest(promo, 'toggle_status')}
                    className="p-2 rounded-xl text-amber-500 bg-amber-50 hover:bg-amber-100 transition-colors tooltip"
                    title="Pause Campaign"
                  >
                    <Pause size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleActionRequest(promo, 'toggle_status')}
                    className="p-2 rounded-xl text-lime-500 bg-lime-50 hover:bg-lime-100 transition-colors tooltip"
                    title="Activate Campaign"
                  >
                    <Play size={18} />
                  </button>
                )}

                <button
                  onClick={() => onEdit(promo)}
                  className="p-2 rounded-xl bg-lime-50 text-lime-500 hover:text-lime-600 hover:bg-lime-100 transition-colors"
                  title="Edit details"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleActionRequest(promo, 'delete')}
                  className="p-2 rounded-xl bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
            headerClassName="bg-gray-100 text-gray-500 border-none rounded-xl py-4 mb-2"
            headerCellClassName="text-[11px] font-bold uppercase tracking-widest hover:text-[#1A1A1A] transition-colors"
            tableContainerClassName="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
          />
        )}
      </div>

      {/* Modals */}
      <PromotionSearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchFields={searchFields}
        handleSearchChange={(key, val) => setSearchFields(prev => ({ ...prev, [key]: val }))}
        clearSearchFields={() => setSearchFields({ query: '' })}
      />

      <PromotionFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterFields={filterFields}
        onApply={setFilterFields}
      />
    </motion.div>
  );
}

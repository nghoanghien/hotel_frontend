'use client';

import { DataTable, ColumnDef, useNotification, StatusBadge, useSwipeConfirmation } from '@repo/ui';
import { motion } from '@repo/ui/motion';
import { Search, Plus, Trash2, Edit2, Shield, User, Smartphone, UserCog, Filter, Download, X, Check, CheckCircle, Ban, Clock, AlertCircle } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { UserDto } from '@repo/types';
import { staffService } from '../services/staffService';
import CreateStaffModal from './CreateStaffModal';
import UpdateStaffModal from './UpdateStaffModal';
import StaffSearchPopup from './StaffSearchPopup';
import StaffFilterModal, { StaffFilterFields } from './StaffFilterModal';
import StaffExportModal from './StaffExportModal';

export default function StaffOperationsTable() {
  const [data, setData] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<UserDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Advanced Features
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchFields, setSearchFields] = useState({ query: '' });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterFields, setFilterFields] = useState<StaffFilterFields>({
    roles: [],
    status: ''
  });

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sorting
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await staffService.getStaffs('hotel-kh-001');
      setData(res);
    } catch (e) {
      showNotification({ message: 'Failed to load staff list', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, staff: UserDto) => {
    e.stopPropagation();

    confirm({
      title: 'Delete Staff Member?',
      description: `This will permanently remove ${staff.firstName} ${staff.lastName} from your staff list. This action cannot be undone.`,
      confirmText: 'SWIPE TO DELETE',
      type: 'danger',
      onConfirm: async () => {
        try {
          await staffService.deleteStaff(staff.id);
          showNotification({ message: 'Staff deleted successfully', type: 'success', format: "Xóa nhân viên thành công" });
          loadData();
        } catch (err) {
          showNotification({ message: 'Failed to delete staff', type: 'error', format: "Xóa nhân viên thất bại" });
        }
      }
    });
  };

  const handleEdit = (e: React.MouseEvent, staff: UserDto) => {
    e.stopPropagation();
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
  };

  const handleRowClick = (staff: UserDto) => {
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
  };

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' ? { key, direction: 'desc' } : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const toggleSearch = () => {
    if (!isSearchExpanded) setIsFilterModalOpen(false);
    setIsSearchExpanded(prev => !prev);
  };

  const openFilterModal = () => {
    setIsSearchExpanded(false);
    setIsFilterModalOpen(true);
  };

  const clearFilters = () => {
    setFilterFields({ roles: [], status: '' });
  };

  const handleExport = async (format: 'pdf' | 'excel', scope: 'current' | 'all', columns: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Exporting ${scope} data as ${format} with columns: ${columns.join(', ')}`);
    // Actual export logic placeholder
  };

  const isFiltered = useMemo(() => {
    return filterFields.roles.length > 0 || filterFields.status !== '';
  }, [filterFields]);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchFields.query) {
      const lower = searchFields.query.toLowerCase();
      result = result.filter(s =>
        s.firstName.toLowerCase().includes(lower) ||
        s.lastName.toLowerCase().includes(lower) ||
        s.email.toLowerCase().includes(lower)
      );
    }

    // Filter
    if (filterFields.roles.length > 0) {
      result = result.filter(s => filterFields.roles.includes(s.role));
    }
    if (filterFields.status) {
      result = result.filter(s => s.status === filterFields.status);
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const getKeyValues = (obj: any, k: string) => {
          if (k === 'email') return obj.firstName + ' ' + obj.lastName; // Sort by name for staff member column
          if (k.includes('.')) return k.split('.').reduce((o: any, i) => (o ? o[i] : null), obj);
          return obj[k];
        };

        const aVal = getKeyValues(a, sortConfig.key);
        const bVal = getKeyValues(b, sortConfig.key);

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchFields, filterFields, sortConfig]);

  const columns: ColumnDef<UserDto>[] = [
    {
      label: 'STAFF MEMBER',
      key: 'email',
      className: 'min-w-[250px]',
      sortable: true,
      formatter: (value: any, item: UserDto) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#1A1A1A] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {item.firstName?.[0]}{item.lastName?.[0]}
          </div>
          <div>
            <div className="font-bold text-gray-900">{item.firstName} {item.lastName}</div>
            <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
              <User size={12} />
              {item.email}
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'ROLE',
      key: 'role',
      className: 'min-w-[150px]',
      sortable: true,
      formatter: (value: any, item: UserDto) => {
        const isReceptionist = item.role === 'Receptionist';
        return (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold ${isReceptionist ? 'bg-lime-50 border-lime-200 text-lime-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
            {isReceptionist ? <Shield size={14} className="fill-current" /> : <UserCog size={14} />}
            {item.role}
          </div>
        );
      }
    },
    {
      label: 'CONTACT',
      key: 'phoneNumber',
      sortable: false,
      formatter: (value: any, item: UserDto) => (
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <Smartphone size={16} />
          </div>
          {item.phoneNumber || 'N/A'}
        </div>
      )
    },
    {
      label: 'STATUS',
      key: 'status',
      sortable: true,
      formatter: (value: any, item: UserDto) => {
        const config = {
          Active: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle, label: 'Active' },
          Inactive: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', icon: Ban, label: 'Inactive' },
          Suspended: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: AlertCircle, label: 'Suspended' },
        }[item.status || 'Active'] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: Clock, label: item.status };

        const Icon = config.icon;

        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border tracking-wide shadow-sm ${config.bg} ${config.text} ${config.border}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
          </span>
        )
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden w-full flex flex-col h-full relative"
    >
      {/* Header */}
      <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white shrink-0 z-20 relative">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-lime-400 rounded-full" />
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Staff Management</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5">
            Manage your hotel team, assign roles & permissions
          </p>
        </div>

        <div className="flex items-center gap-3">
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
                onClick={openFilterModal}
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
              onClick={openFilterModal}
              className="w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
              title="Filter"
            >
              <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          )}

          {/* Export */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all flex items-center gap-2 shadow-sm hover:shadow active:scale-95 ml-2 font-bold"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wide">Export</span>
          </button>

          {/* Create Button (Enhanced) */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-lime-500 hover:bg-lime-600 text-white transition-all flex items-center gap-2 shadow-lg shadow-lime-200 active:scale-95 overflow-hidden relative group ml-2"
            title="Recruit New Staff"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
            <Plus className="w-5 h-5" strokeWidth={3} />
            <span className="text-sm font-bold uppercase tracking-wide whitespace-nowrap">Recruit New</span>
          </button>
        </div>
      </div>

      <div className="px-6 relative z-10">
        <StaffSearchPopup
          isOpen={isSearchExpanded}
          onClose={() => setIsSearchExpanded(false)}
          searchFields={searchFields}
          handleSearchChange={(key: string, value: string) => setSearchFields(prev => ({ ...prev, [key]: value }))}
          clearSearchFields={() => setSearchFields({ query: '' })}
        />
      </div>

      {/* Active Filters Display */}
      {isFiltered && (
        <div className="px-8 pt-4 pb-0 flex flex-wrap items-center gap-2 animate-in slide-in-from-top-2 duration-300">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">Active Filters:</span>

          {filterFields.status && (
            <button
              onClick={() => setFilterFields(prev => ({ ...prev, status: '' }))}
              className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <span>Status: <span className="text-lime-600 font-extrabold group-hover:text-red-500 transition-colors uppercase">{filterFields.status}</span></span>
              <X className="w-3 h-3 opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 ease-out" />
            </button>
          )}

          {filterFields.roles.length > 0 && (
            <button
              onClick={() => setFilterFields(prev => ({ ...prev, roles: [] }))}
              className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <span>Role: <span className="text-lime-600 font-extrabold group-hover:text-red-500 transition-colors">{filterFields.roles.join(', ')}</span></span>
              <X className="w-3 h-3 opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 ease-out" />
            </button>
          )}
        </div>
      )}

      <div className="p-4 flex-1 overflow-hidden flex flex-col relative z-0">
        <DataTable<UserDto>
          data={filteredData}
          columns={columns}
          sortField={sortConfig?.key}
          sortDirection={sortConfig?.direction}
          handleSort={handleSort}
          onRowClick={handleRowClick}
          renderActions={(item) => (
            <div className="flex items-center gap-2">
              <motion.button
                onClick={(e) => handleEdit(e, item)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-[#1A1A1A] hover:text-white shadow-sm transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Edit Profile"
              >
                <Edit2 size={16} />
              </motion.button>

              <motion.button
                onClick={(e) => handleDelete(e, item)}
                className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white shadow-sm transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Remove Staff"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          )}
          headerClassName="bg-gray-200 text-gray-900 border-none rounded-xl py-4 mb-2"
          headerCellClassName="text-[11px] font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-300 transition-colors"
          tableContainerClassName="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          rowClassName="hover:bg-gray-100 transition-colors cursor-pointer"
        />
      </div>

      <CreateStaffModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadData}
      />

      <UpdateStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        staff={selectedStaff}
        onSuccess={loadData}
      />

      <StaffFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterFields={filterFields}
        onApply={setFilterFields}
      />

      <StaffExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        previewData={filteredData}
      />

    </motion.div>
  );
}


import { DataTable, ColumnDef, LoadingSpinner, ImageWithFallback } from '@repo/ui';
import { motion } from '@repo/ui/motion';
import { Search, Filter, X, Edit, User, Building2, Phone } from '@repo/ui/icons';
import { useState, useMemo } from 'react';
import { UserDto, UserRole } from '../services/staffService';
import StaffFilterModal, { StaffFilterFields } from './StaffFilterModal';
import StaffSearchPopup from './StaffSearchPopup';
import EditStaffModal from './EditStaffModal';

const columns: ColumnDef<UserDto>[] = [
  {
    label: 'PERSONNEL',
    key: 'firstName',
    className: 'min-w-[280px]',
    formatter: (value: any, item: UserDto) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 relative border border-gray-100">
          {item.avatarUrl ? (
            <ImageWithFallback
              src={item.avatarUrl}
              alt={item.firstName}
              fill={true}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-bold">
              {item.firstName.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 text-sm line-clamp-1">{item.firstName} {item.lastName}</span>
          <div className="text-[10px] text-gray-500 flex items-center gap-1 font-medium">
            {item.email}
          </div>
        </div>
      </div>
    )
  },
  {
    label: 'ROLE',
    key: 'role',
    className: 'min-w-[140px]',
    formatter: (value: any, item: UserDto) => {
      // Color config
      const color = {
        [UserRole.HotelManager]: 'bg-purple-100 text-purple-700 border-purple-200',
        [UserRole.BrandAdmin]: 'bg-slate-800 text-white border-slate-700',
        [UserRole.Receptionist]: 'bg-blue-50 text-blue-600 border-blue-100',
        [UserRole.Staff]: 'bg-gray-50 text-gray-600 border-gray-100',
        [UserRole.SuperAdmin]: 'bg-rose-100 text-rose-700 border-rose-200',
      }[item.role] || 'bg-gray-50 text-gray-600';

      return (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wide border ${color}`}>
          {item.role === UserRole.HotelManager ? 'Branch Manager' : item.role}
        </span>
      )
    }
  },
  {
    label: 'ASSIGNMENT',
    key: 'hotelId',
    className: 'min-w-[180px]',
    formatter: (value: any, item: UserDto) => (
      <div className="flex items-center gap-2 text-gray-600">
        <Building2 size={14} className="text-gray-400" />
        <span className="text-xs font-bold truncate max-w-[200px]" title={item.hotelName || 'Headquarters'}>
          {item.hotelName || 'Headquarters'}
        </span>
      </div>
    )
  },
  {
    label: 'PHONE',
    key: 'phoneNumber',
    formatter: (value: any, item: UserDto) => (
      <div className="flex items-center gap-1.5 text-gray-500">
        <Phone size={12} />
        <span className="text-xs font-mono">{item.phoneNumber || 'N/A'}</span>
      </div>
    )
  },
  {
    label: 'STATUS',
    key: 'status',
    formatter: (value: any, item: UserDto) => {
      const config = {
        Active: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
        Suspended: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' },
        Pending: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
      }[item.status || 'Active'];

      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${config.bg} ${config.text} ${config.border}`}>
          {item.status}
        </span>
      )
    }
  }
];

interface StaffTableProps {
  data: UserDto[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function StaffTable({ data, isLoading, onRefresh }: StaffTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof UserDto; direction: 'asc' | 'desc' } | null>(null);

  // Local Filter State
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchFields, setSearchFields] = useState({ query: '' });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterFields, setFilterFields] = useState<StaffFilterFields>({
    role: '',
    status: '',
    hotelId: ''
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  const handleSort = (key: string) => {
    const typedKey = key as keyof UserDto;
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
      role: '',
      status: '',
      hotelId: ''
    });
  };

  const isFiltered = useMemo(() => {
    return filterFields.role !== '' || filterFields.status !== '' || filterFields.hotelId !== '';
  }, [filterFields]);

  // Handle Actions
  const handleEdit = (e: React.MouseEvent, user: UserDto) => {
    e.stopPropagation();
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Filter & Sort Logic
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply Search
    if (searchFields.query) {
      const query = searchFields.query.toLowerCase();
      result = result.filter(item =>
        item.firstName.toLowerCase().includes(query) ||
        item.lastName.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        (item.phoneNumber || '').includes(query)
      );
    }

    // Apply Filters
    result = result.filter(item => {
      const roleMatch = filterFields.role === '' || item.role === filterFields.role;
      const statusMatch = filterFields.status === '' || item.status === filterFields.status;
      const hotelMatch = filterFields.hotelId === '' || item.hotelId === filterFields.hotelId;
      return roleMatch && statusMatch && hotelMatch;
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
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Personnel List</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5">
            Overview of all staff members and their assignments.
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
        <StaffSearchPopup
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
          <DataTable<UserDto>
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
                  title="Edit Personnel"
                >
                  <Edit size={16} />
                </motion.button>
              </div>
            )}
            headerClassName="bg-gray-100 text-gray-500 border-none rounded-xl py-4 mb-2"
            headerCellClassName="text-[11px] font-bold uppercase tracking-widest hover:text-[#1A1A1A] transition-colors"
            tableContainerClassName="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
            onRowClick={(item) => {
              setSelectedUser(item);
              setIsEditModalOpen(true);
            }}
          />
        )}
      </div>

      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onSuccess={onRefresh}
      />

      <StaffFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterFields={filterFields}
        onApply={setFilterFields}
      />

    </motion.div>
  );
}

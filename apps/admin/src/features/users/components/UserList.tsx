import { useState, useMemo, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { DataTable, ColumnDef, useNotification, useSwipeConfirmation } from '@repo/ui';
import { Search, Filter, Edit, Lock, Unlock, User as UserIcon, MoreVertical, Trash2, CheckCircle, XCircle, AlertCircle, Clock } from '@repo/ui/icons';
import { User, SystemUserRole, SystemUserStatus } from '@repo/types';
import { userService } from '../services/userService';
import EditUserModal from './EditUserModal';
import UserSearchPopup from './UserSearchPopup';
import UserFilterModal, { UserFilterFields } from './UserFilterModal';

// Mock avatars colors
const avatarColors = [
  'bg-red-100 text-red-600',
  'bg-blue-100 text-blue-600',
  'bg-green-100 text-green-600',
  'bg-amber-100 text-amber-600',
  'bg-purple-100 text-purple-600',
  'bg-pink-100 text-pink-600',
];

const getRoleLabel = (role: SystemUserRole) => {
  switch (role) {
    case SystemUserRole.SuperAdmin: return { label: 'Super Admin', color: 'bg-indigo-100 text-indigo-700' };
    case SystemUserRole.BrandAdmin: return { label: 'Brand Admin', color: 'bg-purple-100 text-purple-700' };
    case SystemUserRole.HotelManager: return { label: 'Hotel Manager', color: 'bg-blue-100 text-blue-700' };
    case SystemUserRole.Receptionist: return { label: 'Receptionist', color: 'bg-cyan-100 text-cyan-700' };
    case SystemUserRole.Staff: return { label: 'Staff', color: 'bg-slate-100 text-slate-700' };
    case SystemUserRole.Guest: return { label: 'Guest', color: 'bg-green-100 text-green-700' };
    default: return { label: 'Unknown', color: 'bg-gray-100 text-gray-700' };
  }
};

const getStatusLabel = (status: SystemUserStatus) => {
  switch (status) {
    case SystemUserStatus.Active: return 'Active';
    case SystemUserStatus.Inactive: return 'Inactive';
    case SystemUserStatus.Suspended: return 'Suspended';
    case SystemUserStatus.PendingVerification: return 'Pending';
    default: return 'Unknown';
  }
}

interface UserListProps {
  refreshTrigger?: number;
}

export default function UserList({ refreshTrigger = 0 }: UserListProps) {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);

  // Search & Filter State
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({ email: '', name: '', phone: '' });
  const [filterCriteria, setFilterCriteria] = useState<UserFilterFields>({ role: 'all', status: 'all', brandId: '', hotelId: '' });


  // Modals
  const [selectedUserEdit, setSelectedUserEdit] = useState<User | null>(null);

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await userService.getAllUsers();
      setData(res);
    } catch (e) {
      showNotification({ message: 'Failed to load users', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: string) => {
    const typedKey = key as keyof User;
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === typedKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: typedKey, direction });
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchCriteria.email) {
      result = result.filter(u => u.email.toLowerCase().includes(searchCriteria.email.toLowerCase()));
    }
    if (searchCriteria.name) {
      result = result.filter(u =>
        (u.firstName + ' ' + u.lastName).toLowerCase().includes(searchCriteria.name.toLowerCase())
      );
    }
    if (searchCriteria.phone) {
      result = result.filter(u => u.phoneNumber?.includes(searchCriteria.phone));
    }

    // Filter
    if (filterCriteria.role !== 'all') {
      result = result.filter(u => u.role === filterCriteria.role);
    }
    if (filterCriteria.status !== 'all') {
      result = result.filter(u => u.status === filterCriteria.status);
    }
    // Brand/Hotel context filters logic if needed

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
  }, [data, searchCriteria, filterCriteria, sortConfig]);

  const columns: ColumnDef<User>[] = [
    {
      label: 'USER IDENTITY',
      key: 'email',
      className: 'min-w-[280px]',
      formatter: (_, item) => {
        const colorIndex = (item.firstName.length + item.lastName.length) % avatarColors.length;
        const colorClass = avatarColors[colorIndex];
        return (
          <div className="flex items-center gap-4 group">
            <div className={`w-12 h-12 rounded-2xl ${item.avatarUrl ? '' : colorClass} flex items-center justify-center text-sm font-bold shadow-sm overflow-hidden flex-shrink-0 border border-black/5`}>
              {item.avatarUrl ? (
                <img src={item.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span>{item.firstName[0]}{item.lastName[0]}</span>
              )}
            </div>
            <div>
              <div className="font-bold text-gray-900 group-hover:text-lime-600 transition-colors">
                {item.firstName} {item.lastName}
              </div>
              <div className="text-[11px] font-medium text-gray-500 mt-0.5">{item.email}</div>
              {item.phoneNumber && (
                <div className="text-[10px] text-gray-400 mt-0.5">{item.phoneNumber}</div>
              )}
            </div>
          </div>
        );
      }
    },
    {
      label: 'ROLE & ACCESS',
      key: 'role',
      className: 'min-w-[150px]',
      formatter: (_, item) => {
        const { label, color } = getRoleLabel(item.role);
        return (
          <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${color}`}>
            {label}
          </div>
        );
      }
    },
    {
      label: 'CONTEXT',
      key: 'brandId',
      className: 'min-w-[150px]',
      formatter: (_, item) => (
        <div className="flex flex-col text-xs font-medium text-gray-500">
          {item.brandId ? (
            <div className="flex items-center gap-1.5" title="Brand ID">
              <span className="w-4 h-4 rounded-full bg-purple-50 flex items-center justify-center text-[8px] text-purple-600 font-bold">B</span>
              <span>{item.brandId.substring(0, 8)}...</span>
            </div>
          ) : (
            <span className="text-gray-300">-</span>
          )}
          {item.hotelId && (
            <div className="flex items-center gap-1.5 mt-1" title="Hotel ID">
              <span className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center text-[8px] text-blue-600 font-bold">H</span>
              <span>{item.hotelId.substring(0, 8)}...</span>
            </div>
          )}
        </div>
      )
    },
    {
      label: 'STATUS',
      key: 'status',
      className: 'min-w-[120px] text-center',
      formatter: (_, item) => {
        const getStatusConfig = (s: SystemUserStatus) => {
          switch (s) {
            case SystemUserStatus.Active:
              return { color: 'bg-green-100 text-green-700', icon: <CheckCircle size={10} strokeWidth={3} /> };
            case SystemUserStatus.Inactive:
              return { color: 'bg-gray-100 text-gray-700', icon: <XCircle size={10} strokeWidth={3} /> };
            case SystemUserStatus.Suspended:
              return { color: 'bg-red-100 text-red-700', icon: <AlertCircle size={10} strokeWidth={3} /> };
            case SystemUserStatus.PendingVerification:
              return { color: 'bg-amber-100 text-amber-700', icon: <Clock size={10} strokeWidth={3} /> };
            default:
              return { color: 'bg-gray-100 text-gray-700', icon: <XCircle size={10} strokeWidth={3} /> };
          }
        };

        const config = getStatusConfig(item.status);

        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
            {config.icon}
            <span>{getStatusLabel(item.status)}</span>
          </div>
        );
      }
    },
    {
      label: 'LAST LOGIN',
      key: 'lastLoginAt',
      className: 'min-w-[150px]',
      formatter: (_, item) => (
        item.lastLoginAt ? (
          <div className="text-xs font-bold text-gray-700">
            {new Date(item.lastLoginAt).toLocaleDateString()}
            <span className="block text-[10px] font-medium text-gray-400 font-mono mt-0.5">
              {new Date(item.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-300 italic">Never</span>
        )
      )
    }
  ];

  const activeFiltersCount = (filterCriteria.role !== 'all' ? 1 : 0) + (filterCriteria.status !== 'all' ? 1 : 0);
  const hasActiveSearch = !!searchCriteria.email || !!searchCriteria.name || !!searchCriteria.phone;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden w-full border border-gray-100/50"
    >
      {/* Table Toolbar */}
      <div className="pb-4 p-8 border-b border-gray-50 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-lime-400 rounded-full" />
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">System Users</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5">Manage access across entire platform</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSearchPopupOpen(true)}
            className={`h-11 px-5 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all border ${hasActiveSearch
              ? 'bg-lime-50 text-lime-700 border-lime-200 shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
          >
            <Search size={18} />
            <span>{hasActiveSearch ? 'Search Active' : 'Search'}</span>
          </button>

          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`h-11 px-5 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all border ${activeFiltersCount > 0
              ? 'bg-lime-50 text-lime-700 border-lime-200 shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
          >
            <Filter size={18} />
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-lime-500 text-white flex items-center justify-center text-[10px] ml-1">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        <DataTable<User>
          data={filteredData}
          columns={columns}
          handleSort={handleSort}
          sortField={sortConfig?.key}
          sortDirection={sortConfig?.direction}
          renderActions={(item) => (
            <div className="flex items-center gap-2">
              <motion.button
                onClick={(e) => { e.stopPropagation(); setSelectedUserEdit(item); }}
                className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-lime-50 hover:text-lime-600 transition-colors"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                title="Edit User (God Mode)"
              >
                <Edit size={16} />
              </motion.button>
            </div>
          )}
          onRowClick={(item) => setSelectedUserEdit(item)}
          headerClassName="bg-gray-50 text-gray-900 border-none rounded-xl py-4 mb-2"
          headerCellClassName="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
          tableContainerClassName="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          rowClassName="hover:bg-gray-50 transition-colors cursor-pointer group"
        />
      </div>

      {/* Popups */}
      <UserSearchPopup
        isOpen={isSearchPopupOpen}
        onClose={() => setIsSearchPopupOpen(false)}
        onSearch={(fields) => setSearchCriteria(fields)}
      />

      <UserFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterFields={filterCriteria}
        onApply={(fields) => setFilterCriteria(fields)}
      />

      <EditUserModal
        isOpen={!!selectedUserEdit}
        user={selectedUserEdit}
        onClose={() => setSelectedUserEdit(null)}
        onSuccess={loadData}
      />

    </motion.div>
  );
}

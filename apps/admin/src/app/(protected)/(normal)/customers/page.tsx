'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Download,
  FileText,
  Phone,
  Mail,
  MapPin,
  Lock,
  LockOpen
} from 'lucide-react';
import SearchFilterBar from '@repo/ui/search/SearchFilterBar';
import DataTable from '@repo/ui/tables/DataTable';
import type { ColumnDef } from '@repo/ui/tables/DataTable';
import ExportDataModal from '@repo/ui/modals/ExportDataModal';
import ExportNotification from '@repo/ui/feedback/ExportNotification';
import { useSwipeConfirmation } from '@repo/ui/providers/SwipeConfirmationProvider';
import { useNotification } from '@repo/ui/providers/NotificationProvider';

// Customer type definition
interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  dateOfBirth: string;
  address: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'blocked';
  totalBookings: number;
  totalSpent: number;
}

// Sample data for customers
const sampleCustomers: Customer[] = [
  {
    id: 1,
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    phone: '0901234567',
    idNumber: '079201234567',
    dateOfBirth: '15/03/1990',
    address: 'Quận 1, TP. Hồ Chí Minh',
    registrationDate: '01/01/2024',
    status: 'active',
    totalBookings: 5,
    totalSpent: 15000000
  },
  {
    id: 2,
    fullName: 'Trần Thị Bình',
    email: 'tranthibinh@email.com',
    phone: '0912345678',
    idNumber: '079201234568',
    dateOfBirth: '22/07/1985',
    address: 'Quận 3, TP. Hồ Chí Minh',
    registrationDate: '05/01/2024',
    status: 'active',
    totalBookings: 3,
    totalSpent: 8000000
  },
  {
    id: 3,
    fullName: 'Lê Văn Cường',
    email: 'levancuong@email.com',
    phone: '0923456789',
    idNumber: '079201234569',
    dateOfBirth: '10/12/1992',
    address: 'Quận 5, TP. Hồ Chí Minh',
    registrationDate: '10/01/2024',
    status: 'inactive',
    totalBookings: 1,
    totalSpent: 2000000
  }
];

// Format currency helper
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

// Format date helper  
const formatDate = (dateString: string): string => {
  return dateString;
};

export default function CustomersManagement() {
  // Hooks
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();

  // Loading states
  const [isLoadingSearch, setIsLoadingSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // State for filter, sort, search
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [sortField, setSortField] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchFields, setSearchFields] = useState({
    id: '',
    idNumber: '',
    fullName: '',
    phone: '',
    email: ''
  });

  // State for export
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState<Customer[]>([]);
  const [exportNotification, setExportNotification] = useState({
    visible: false,
    type: 'success' as 'success' | 'error',
    message: '',
    format: ''
  });

  // useEffect to simulate loading states
  useEffect(() => {
    // Simulate loading for search filtering
    setTimeout(() => {
      setIsLoadingSearch(false);
    }, 2000);

    // Simulate loading for data
    setTimeout(() => {
      setCustomers(sampleCustomers);
      setIsLoading(false);
    }, 1500);
  }, []);

  // useEffect filter + sort
  useEffect(() => {
    let result = [...customers];

    // Filter
    result = result.filter(customer => {
      const idMatch = searchFields.id === '' || String(customer.id).includes(searchFields.id);
      const idNumberMatch = searchFields.idNumber === '' || customer.idNumber.toLowerCase().includes(searchFields.idNumber.toLowerCase());
      const nameMatch = searchFields.fullName === '' || customer.fullName.toLowerCase().includes(searchFields.fullName.toLowerCase());
      const phoneMatch = searchFields.phone === '' || customer.phone.toLowerCase().includes(searchFields.phone.toLowerCase());
      const emailMatch = searchFields.email === '' || customer.email.toLowerCase().includes(searchFields.email.toLowerCase());
      return idMatch && idNumberMatch && nameMatch && phoneMatch && emailMatch;
    });

    // Sort
    result.sort((a, b) => {
      const valueA = a[sortField as keyof Customer];
      const valueB = b[sortField as keyof Customer];

      if (typeof valueA === 'string') {
        const strA = valueA.toLowerCase();
        const strB = (valueB as string).toLowerCase();
        if (sortDirection === 'asc') return strA > strB ? 1 : -1;
        else return strA < strB ? 1 : -1;
      }

      if (sortDirection === 'asc') return valueA > valueB ? 1 : -1;
      else return valueA < valueB ? 1 : -1;
    });

    setFilteredCustomers(result);
  }, [customers, searchFields, sortField, sortDirection]);

  // Table columns
  const customerColumns: ColumnDef<Customer>[] = [
    {
      key: 'id',
      label: 'Mã KH',
      sortable: true,
      formatter: (value, item) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <User size={16} />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{value}</div>
          </div>
        </div>
      )
    },
    {
      key: 'fullName',
      label: 'Họ và tên',
      sortable: true,
      formatter: (value) => <div className="text-sm font-medium text-gray-900">{value}</div>
    },
    {
      key: 'idNumber',
      label: 'CCCD',
      sortable: true,
      className: 'hidden md:table-cell',
      formatter: (value) => <div className="text-sm text-gray-600">{value}</div>
    },
    {
      key: 'phone',
      label: 'Số điện thoại',
      sortable: true,
      className: 'hidden sm:table-cell',
      formatter: (value) => <div className="text-sm text-gray-600">{value}</div>
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      className: 'hidden lg:table-cell',
      formatter: (value) => <div className="text-sm text-gray-600">{value}</div>
    },
    {
      key: 'status',
      label: 'Trạng thái',
      sortable: true,
      type: 'status'
    }
  ];

  // Handle toggle status
  const handleToggleStatus = async (customer: Customer) => {
    const isBlocked = customer.status === 'blocked';
    const actionText = isBlocked ? 'kích hoạt' : 'vô hiệu hóa';
    const newStatus = isBlocked ? 'active' : 'blocked';

    confirm({
      title: `Xác nhận ${actionText} tài khoản`,
      description: `Bạn có chắc chắn muốn ${actionText} tài khoản của khách hàng "${customer.fullName}"?`,
      confirmText: `Vuốt để ${actionText}`,
      type: isBlocked ? "success" : "danger",
      onConfirm: async () => {
        // Simulate loading 1.5s
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update status
        setCustomers(prev => prev.map(c =>
          c.id === customer.id ? { ...c, status: newStatus } : c
        ));

        // Show notification
        showNotification({
          title: 'Thành công!',
          message: `Đã ${actionText} tài khoản khách hàng "${customer.fullName}" thành công.`,
          type: 'success',
          duration: 3000
        });
      }
    });
  };

  // Render action for each row
  const renderActions = (customer: Customer) => (
    <div className="flex justify-end space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          alert('Xem chi tiết khách hàng: ' + customer.fullName);
        }}
        className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
        title="Xem chi tiết"
      >
        <FileText size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggleStatus(customer);
        }}
        className={`p-1 rounded-full transition-colors ${customer.status === 'blocked'
            ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
            : 'text-amber-600 hover:text-amber-900 hover:bg-amber-50'
          }`}
        title={customer.status === 'blocked' ? 'Kích hoạt tài khoản' : 'Vô hiệu hóa tài khoản'}
      >
        {customer.status === 'blocked' ? (
          <LockOpen size={16} />
        ) : (
          <Lock size={16} />
        )}
      </button>
    </div>
  );

  // SearchFilterBar config
  const searchFieldsConfig = [
    { key: 'id', label: 'Mã KH', icon: FileText, placeholder: 'Tìm theo mã KH...' },
    { key: 'idNumber', label: 'Số CCCD', icon: FileText, placeholder: 'Tìm theo CCCD...' },
    { key: 'fullName', label: 'Họ tên', icon: User, placeholder: 'Tìm theo họ tên...' },
    { key: 'phone', label: 'Số điện thoại', icon: Phone, placeholder: 'Tìm theo SĐT...' },
    { key: 'email', label: 'Email', icon: Mail, placeholder: 'Tìm theo email...' }
  ];

  // Handle search change
  const handleSearchChange = (field: string, value: string) => {
    setSearchFields(prev => ({ ...prev, [field]: value }));
  };

  const clearSearchFields = () => {
    setSearchFields({ id: '', idNumber: '', fullName: '', phone: '', email: '' });
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Export
  const handleExportData = (data: Customer[], format: string) => {
    // Simulate export process
    const isSuccess = Math.random() > 0.2;

    if (isSuccess) {
      setExportNotification({
        visible: true,
        type: 'success',
        message: `Xuất ${data.length} bản ghi thành công!`,
        format
      });
    } else {
      setExportNotification({
        visible: true,
        type: 'error',
        message: 'Có lỗi khi xuất dữ liệu. Vui lòng thử lại!',
        format
      });
    }

    // Auto hide notification after 5 seconds
    setTimeout(() => {
      setExportNotification(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  // Render UI
  return (
    <div className="container mx-auto p-8 px-12 pr-16">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Quản lý khách hàng</h2>
            <p className="text-gray-500 text-sm">Tra cứu và xem thông tin chi tiết các khách hàng</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="group flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-600 via-lime-500 to-green-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Download size={16} className="text-white group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium text-sm">Xuất dữ liệu</span>
            </button>
          </div>
        </div>

        {isLoadingSearch ? (
          <div className="animate-pulse">
            <div className="h-20 bg-gradient-to-br from-green-50/80 to-white rounded-2xl border border-green-100"></div>
          </div>
        ) : (
          <SearchFilterBar
            searchFields={searchFields}
            handleSearchChange={handleSearchChange}
            clearSearchFields={clearSearchFields}
            searchFieldsConfig={searchFieldsConfig}
            title="Tìm kiếm khách hàng"
            subtitle="Nhập thông tin để tìm kiếm khách hàng"
          />
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-96 bg-white rounded-2xl border border-green-100 shadow-[0_4px_24px_rgba(34,197,94,0.08)]"></div>
        </div>
      ) : (
        <DataTable
          data={filteredCustomers}
          columns={customerColumns}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          onRowClick={(customer) => {
            alert('Xem chi tiết: ' + customer.fullName);
          }}
          keyField="id"
          className="mb-6"
          headerClassName="bg-gradient-to-r from-green-500 to-lime-600"
          renderActions={renderActions}
          statusFilters={{
            status: ['active', 'inactive', 'blocked']
          }}
          dateRangeFilters={{
            registrationDate: { label: 'Ngày đăng ký' }
          }}
          changeTableData={setExportData}
        />
      )}

      {/* Export notification */}
      <ExportNotification
        isVisible={exportNotification.visible}
        format={exportNotification.format}
        onClose={() => setExportNotification(prev => ({ ...prev, visible: false }))}
        message={exportNotification.message}
        type={exportNotification.type}
        autoHideDuration={5000}
        position="center"
      />

      {/* Export Data Modal */}
      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={exportData}
        onExport={handleExportData}
        title="Xuất dữ liệu khách hàng"
        initialSelectedColumns={[
          'id',
          'fullName',
          'idNumber',
          'dateOfBirth',
          'email',
          'phone',
          'address',
          'registrationDate',
          'status',
          'totalBookings',
          'totalSpent'
        ]}
        columnLabels={{
          id: 'Mã khách hàng',
          fullName: 'Họ và tên',
          idNumber: 'Số CCCD',
          dateOfBirth: 'Ngày sinh',
          email: 'Email',
          phone: 'Số điện thoại',
          address: 'Địa chỉ',
          registrationDate: 'Ngày đăng ký',
          status: 'Trạng thái',
          totalBookings: 'Tổng số đặt phòng',
          totalSpent: 'Tổng chi tiêu'
        }}
        formatData={(value, column) => {
          if (column === 'totalSpent') return formatCurrency(value as number);
          if (column === 'status') {
            if (value === 'active') return 'Hoạt động';
            if (value === 'inactive') return 'Không hoạt động';
            if (value === 'blocked') return 'Đã khóa';
          }
          return value;
        }}
        defaultFormat="excel"
        customColumnCategories={{
          personal: ['id', 'fullName', 'idNumber', 'dateOfBirth'],
          contact: ['email', 'phone', 'address'],
          other: ['registrationDate', 'status', 'totalBookings', 'totalSpent']
        }}
        enableGrouping={true}
      />
    </div>
  );
}

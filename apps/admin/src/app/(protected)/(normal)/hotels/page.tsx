'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Download,
  FileText,
  Phone,
  Mail,
  MapPin,
  Star,
  Users,
  Bed
} from 'lucide-react';
import SearchFilterBar from '@repo/ui/search/SearchFilterBar';
import DataTable from '@repo/ui/tables/DataTable';
import type { ColumnDef } from '@repo/ui/tables/DataTable';
import ExportDataModal from '@repo/ui/modals/ExportDataModal';
import ExportNotification from '@repo/ui/feedback/ExportNotification';

// Hotel type definition
interface Hotel {
  id: number;
  name: string;
  address: string;
  city: string;
  district: string;
  totalRooms: number;
  availableRooms: number;
  rating: number;
  status: 'active' | 'inactive' | 'maintenance';
  contactPhone: string;
  contactEmail: string;
  managerName: string;
  registeredDate: string;
  amenities: string[];
  priceRange: string;
}

// Sample data for hotels
const sampleHotels: Hotel[] = [
  {
    id: 1,
    name: 'Khách sạn Sài Gòn Palace',
    address: '123 Nguyễn Huệ',
    city: 'Hồ Chí Minh',
    district: 'Quận 1',
    totalRooms: 150,
    availableRooms: 45,
    rating: 4.8,
    status: 'active',
    contactPhone: '028-3822-2222',
    contactEmail: 'info@saigonpalace.com',
    managerName: 'Nguyễn Văn A',
    registeredDate: '15/01/2020',
    amenities: ['WiFi', 'Hồ bơi', 'Gym', 'Spa', 'Nhà hàng'],
    priceRange: '1.500.000đ - 5.000.000đ'
  },
  {
    id: 2,
    name: 'Grand Hotel Hanoi',
    address: '456 Hoàn Kiếm',
    city: 'Hà Nội',
    district: 'Quận Hoàn Kiếm',
    totalRooms: 200,
    availableRooms: 80,
    rating: 4.9,
    status: 'active',
    contactPhone: '024-3826-6919',
    contactEmail: 'reservation@grandhanoi.vn',
    managerName: 'Trần Thị B',
    registeredDate: '20/03/2019',
    amenities: ['WiFi', 'Hồ bơi', 'Nhà hàng', 'Bar', 'Phòng họp'],
    priceRange: '2.000.000đ - 8.000.000đ'
  },
  {
    id: 3,
    name: 'Resort Đà Nẵng Beach',
    address: '789 Võ Nguyên Giáp',
    city: 'Đà Nẵng',
    district: 'Ngũ Hành Sơn',
    totalRooms: 180,
    availableRooms: 120,
    rating: 4.7,
    status: 'active',
    contactPhone: '0236-3959-555',
    contactEmail: 'contact@danangbeach.com',
    managerName: 'Lê Văn C',
    registeredDate: '10/06/2021',
    amenities: ['WiFi', 'Bãi biển', 'Hồ bơi', 'Spa', 'Kids Club'],
    priceRange: '1.800.000đ - 6.500.000đ'
  },
  {
    id: 4,
    name: 'Boutique Hotel Hội An',
    address: '321 Trần Phú',
    city: 'Quảng Nam',
    district: 'Hội An',
    totalRooms: 50,
    availableRooms: 15,
    rating: 4.6,
    status: 'active',
    contactPhone: '0235-3861-234',
    contactEmail: 'info@hoianboutique.vn',
    managerName: 'Phạm Thị D',
    registeredDate: '05/11/2022',
    amenities: ['WiFi', 'Nhà hàng', 'Xe đạp miễn phí', 'Tour'],
    priceRange: '1.200.000đ - 3.500.000đ'
  },
  {
    id: 5,
    name: 'Mountain View Sapa',
    address: '567 Fansipan',
    city: 'Lào Cai',
    district: 'Sa Pa',
    totalRooms: 80,
    availableRooms: 35,
    rating: 4.5,
    status: 'maintenance',
    contactPhone: '0214-3871-999',
    contactEmail: 'booking@sapamountain.com',
    managerName: 'Hoàng Văn E',
    registeredDate: '12/08/2020',
    amenities: ['WiFi', 'Nhà hàng', 'Sưởi ấm', 'View núi'],
    priceRange: '800.000đ - 2.500.000đ'
  },
  {
    id: 6,
    name: 'Business Hotel Phú Mỹ Hưng',
    address: '234 Nguyễn Văn Linh',
    city: 'Hồ Chí Minh',
    district: 'Quận 7',
    totalRooms: 120,
    availableRooms: 60,
    rating: 4.4,
    status: 'active',
    contactPhone: '028-5412-8888',
    contactEmail: 'info@phumyhunghotel.com',
    managerName: 'Võ Thị F',
    registeredDate: '18/02/2023',
    amenities: ['WiFi', 'Gym', 'Phòng họp', 'Bãi đỗ xe'],
    priceRange: '1.000.000đ - 3.000.000đ'
  }
];

// Format currency helper
const formatCurrency = (value: string): string => {
  return value;
};

// Format date helper  
const formatDate = (dateString: string): string => {
  return dateString;
};

export default function HotelsManagement() {
  // Loading states
  const [isLoadingSearch, setIsLoadingSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // State for filter, sort, search
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [sortField, setSortField] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchFields, setSearchFields] = useState({
    id: '',
    name: '',
    city: '',
    phone: '',
    email: ''
  });

  // State for export
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState<Hotel[]>([]);
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
      setHotels(sampleHotels);
      setIsLoading(false);
    }, 1500);
  }, []);

  // useEffect filter + sort
  useEffect(() => {
    let result = [...hotels];

    // Filter
    result = result.filter(hotel => {
      const idMatch = searchFields.id === '' || String(hotel.id).includes(searchFields.id);
      const nameMatch = searchFields.name === '' || hotel.name.toLowerCase().includes(searchFields.name.toLowerCase());
      const cityMatch = searchFields.city === '' || hotel.city.toLowerCase().includes(searchFields.city.toLowerCase());
      const phoneMatch = searchFields.phone === '' || hotel.contactPhone.toLowerCase().includes(searchFields.phone.toLowerCase());
      const emailMatch = searchFields.email === '' || hotel.contactEmail.toLowerCase().includes(searchFields.email.toLowerCase());
      return idMatch && nameMatch && cityMatch && phoneMatch && emailMatch;
    });

    // Sort
    result.sort((a, b) => {
      const valueA = a[sortField as keyof Hotel];
      const valueB = b[sortField as keyof Hotel];

      if (typeof valueA === 'string') {
        const strA = valueA.toLowerCase();
        const strB = (valueB as string).toLowerCase();
        if (sortDirection === 'asc') return strA > strB ? 1 : -1;
        else return strA < strB ? 1 : -1;
      }

      if (sortDirection === 'asc') return valueA > valueB ? 1 : -1;
      else return valueA < valueB ? 1 : -1;
    });

    setFilteredHotels(result);
  }, [hotels, searchFields, sortField, sortDirection]);

  // Table columns
  const hotelColumns: ColumnDef<Hotel>[] = [
    {
      key: 'id',
      label: 'Mã KS',
      sortable: true,
      formatter: (value, item) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Building2 size={16} />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{value}</div>
          </div>
        </div>
      )
    },
    {
      key: 'name',
      label: 'Tên khách sạn',
      sortable: true,
      formatter: (value) => <div className="text-sm font-medium text-gray-900">{value}</div>
    },
    {
      key: 'city',
      label: 'Thành phố',
      sortable: true,
      className: 'hidden md:table-cell',
      formatter: (value) => <div className="text-sm text-gray-600">{value}</div>
    },
    {
      key: 'totalRooms',
      label: 'Số phòng',
      sortable: true,
      className: 'hidden sm:table-cell',
      formatter: (value, item) => (
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed size={14} className="text-green-500" />
            <span>{value} phòng</span>
          </div>
          <div className="text-xs text-gray-400">Còn trống: {item.availableRooms}</div>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Đánh giá',
      sortable: true,
      className: 'hidden lg:table-cell',
      formatter: (value) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      sortable: true,
      type: 'status'
    }
  ];

  // Render action for each row
  const renderActions = (hotel: Hotel) => (
    <div className="flex justify-end space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          alert('Xem chi tiết khách sạn: ' + hotel.name);
        }}
        className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
      >
        <FileText size={16} />
      </button>
    </div>
  );

  // SearchFilterBar config
  const searchFieldsConfig = [
    { key: 'id', label: 'Mã KS', icon: FileText, placeholder: 'Tìm theo mã KS...' },
    { key: 'name', label: 'Tên KS', icon: Building2, placeholder: 'Tìm theo tên khách sạn...' },
    { key: 'city', label: 'Thành phố', icon: MapPin, placeholder: 'Tìm theo thành phố...' },
    { key: 'phone', label: 'Số điện thoại', icon: Phone, placeholder: 'Tìm theo SĐT...' },
    { key: 'email', label: 'Email', icon: Mail, placeholder: 'Tìm theo email...' }
  ];

  // Handle search change
  const handleSearchChange = (field: string, value: string) => {
    setSearchFields(prev => ({ ...prev, [field]: value }));
  };

  const clearSearchFields = () => {
    setSearchFields({ id: '', name: '', city: '', phone: '', email: '' });
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
  const handleExportData = (data: Hotel[], format: string) => {
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
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Quản lý khách sạn</h2>
            <p className="text-gray-500 text-sm">Tra cứu và xem thông tin chi tiết các khách sạn</p>
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
            title="Tìm kiếm khách sạn"
            subtitle="Nhập thông tin để tìm kiếm khách sạn"
          />
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-96 bg-white rounded-2xl border border-green-100 shadow-[0_4px_24px_rgba(34,197,94,0.08)]"></div>
        </div>
      ) : (
        <DataTable
          data={filteredHotels}
          columns={hotelColumns}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          onRowClick={(hotel) => {
            alert('Xem chi tiết: ' + hotel.name);
          }}
          keyField="id"
          className="mb-6"
          headerClassName="bg-gradient-to-r from-green-500 to-lime-600"
          renderActions={renderActions}
          statusFilters={{
            status: ['active', 'inactive', 'maintenance']
          }}
          dateRangeFilters={{
            registeredDate: { label: 'Ngày đăng ký' }
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
        title="Xuất dữ liệu khách sạn"
        initialSelectedColumns={[
          'id',
          'name',
          'address',
          'city',
          'district',
          'totalRooms',
          'availableRooms',
          'rating',
          'contactPhone',
          'contactEmail',
          'managerName',
          'registeredDate',
          'status',
          'priceRange'
        ]}
        columnLabels={{
          id: 'Mã khách sạn',
          name: 'Tên khách sạn',
          address: 'Địa chỉ',
          city: 'Thành phố',
          district: 'Quận/Huyện',
          totalRooms: 'Tổng số phòng',
          availableRooms: 'Phòng còn trống',
          rating: 'Đánh giá',
          contactPhone: 'Số điện thoại',
          contactEmail: 'Email liên hệ',
          managerName: 'Người quản lý',
          registeredDate: 'Ngày đăng ký',
          status: 'Trạng thái',
          priceRange: 'Khoảng giá',
          amenities: 'Tiện ích'
        }}
        formatData={(value, column) => {
          if (column === 'status') {
            if (value === 'active') return 'Hoạt động';
            if (value === 'inactive') return 'Không hoạt động';
            if (value === 'maintenance') return 'Bảo trì';
          }
          if (column === 'amenities' && Array.isArray(value)) {
            return value.join(', ');
          }
          return value;
        }}
        defaultFormat="excel"
        customColumnCategories={{
          basic: ['id', 'name', 'address', 'city', 'district'],
          rooms: ['totalRooms', 'availableRooms', 'rating'],
          contact: ['contactPhone', 'contactEmail', 'managerName'],
          other: ['registeredDate', 'status', 'priceRange']
        }}
        enableGrouping={true}
      />
    </div>
  );
}

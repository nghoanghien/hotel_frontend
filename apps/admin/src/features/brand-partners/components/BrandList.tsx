import { useState, useMemo, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { DataTable, ColumnDef, useNotification, useSwipeConfirmation, LoadingSpinner } from '@repo/ui';
import { Search, Filter, Download, Building2, MapPin, Globe, CheckCircle, XCircle, X, Eye, Edit, Lock, Unlock, Trash2 } from '@repo/ui/icons';
import { brandPartnersService } from '@/features/brand-partners/services/brandPartnersService';
import { Brand } from '@repo/types';
import BrandSearchPopup from './BrandSearchPopup';
import BrandFilterModal, { BrandFilterFields } from './BrandFilterModal';
import BrandExportModal from './BrandExportModal';
import ViewBrandModal from './ViewBrandModal';
import EditBrandModal from './EditBrandModal';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';


interface BrandListProps {
  refreshTrigger?: number;
}

export default function BrandList({ refreshTrigger = 0 }: BrandListProps) {
  const [data, setData] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [brokenLogos, setBrokenLogos] = useState<Record<string, boolean>>({});
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();
  const [sortConfig, setSortConfig] = useState<{ key: keyof Brand; direction: 'asc' | 'desc' } | null>(null);

  const columns = useMemo<ColumnDef<Brand>[]>(() => [
    {
      label: 'BRAND IDENTITY',
      key: 'name',
      className: 'min-w-[200px]',
      formatter: (_: any, item: Brand) => {
        // Robust logo check: fallback if missing, whitespace-only, or failed to load
        const hasLogo = item.logoUrl && item.logoUrl.trim().length > 0;
        const isGenericLogo = !hasLogo ||
          item.logoUrl?.includes('ui-avatars.com') ||
          brokenLogos[item.id];

        return (
          <div className="flex items-center gap-4 group">
            <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
              {!isGenericLogo ? (
                <img
                  src={item.logoUrl}
                  alt={item.name}
                  onError={() => setBrokenLogos(prev => ({ ...prev, [item.id]: true }))}
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
      label: 'SUBSCRIPTION',
      key: 'subscription',
      className: 'min-w-[140px]',
      formatter: (_: any, item: Brand) => {
        const plan = item.subscriptionPlan || 'No Plan';
        const status = item.subscriptionStatus || 'Trial';

        const statusColors: Record<string, string> = {
          Active: 'bg-green-100 text-green-700 border-green-200',
          'Expiring Soon': 'bg-amber-100 text-amber-700 border-amber-200',
          Expired: 'bg-red-100 text-red-700 border-red-200',
          Trial: 'bg-blue-100 text-blue-700 border-blue-200'
        };

        const dotColors: Record<string, string> = {
          Active: 'bg-green-500',
          'Expiring Soon': 'bg-amber-500',
          Expired: 'bg-red-500',
          Trial: 'bg-blue-500'
        };

        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-gray-900">{plan}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[status] || statusColors.Trial}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status] || dotColors.Trial}`} />
              {status}
            </span>
          </div>
        );
      }
    },
  ], [brokenLogos]);

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

  const handleExport = async (exportFormat: 'pdf' | 'excel', scope: 'current' | 'all', columnsToExport: string[]) => {
    setIsLoading(true);
    try {
      // 1. Get the data to export
      let dataToExport: Brand[] = [];
      if (scope === 'all') {
        dataToExport = await brandPartnersService.getAllBrands();
      } else {
        dataToExport = filteredAndSortedData;
      }

      const fileName = `brands_export_${format(new Date(), 'yyyyMMdd_HHmmss')}`;

      if (exportFormat === 'excel') {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Brands');

        // Define columns
        worksheet.columns = columnsToExport.map(col => ({
          header: col.charAt(0).toUpperCase() + col.slice(1).replace(/([A-Z])/g, ' $1'),
          key: col,
          width: 25
        }));

        // Add data
        dataToExport.forEach(item => {
          const rowData: any = {};
          columnsToExport.forEach(col => {
            let val: any = (item as any)[col];
            if (col === 'isActive') val = item.isActive ? 'Active' : 'Inactive';
            if (col === 'commissionRate') val = `${item.commissionRate}%`;
            rowData[col] = val;
          });
          worksheet.addRow(rowData);
        });

        // Style header
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
        worksheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4F46E5' } // Indigo color
        };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).height = 25;

        // Auto-filter
        worksheet.autoFilter = {
          from: { row: 1, column: 1 },
          to: { row: 1, column: columnsToExport.length }
        };

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.xlsx`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const doc = new jsPDF({
          orientation: columnsToExport.length > 5 ? 'landscape' : 'portrait'
        });

        // Add Title
        doc.setFontSize(20);
        doc.setTextColor(31, 41, 55); // Gray-800
        doc.text('Brand Portfolio Report', 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128); // Gray-500
        doc.text(`Generated on: ${format(new Date(), 'PPP p')}`, 14, 28);
        doc.text(`Scope: ${scope === 'all' ? 'Full Portfolio' : 'Current Filters'}`, 14, 34);

        const tableHeaders = columnsToExport.map(col => col.charAt(0).toUpperCase() + col.slice(1).replace(/([A-Z])/g, ' $1'));
        const tableData = dataToExport.map(item => {
          return columnsToExport.map(col => {
            let val: any = (item as any)[col];
            if (col === 'isActive') val = item.isActive ? 'Active' : 'Inactive';
            if (col === 'commissionRate') val = `${item.commissionRate}%`;
            return val ?? 'N/A';
          });
        });

        autoTable(doc, {
          startY: 45,
          head: [tableHeaders],
          body: tableData,
          headStyles: {
            fillColor: [79, 70, 229],
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'center'
          },
          bodyStyles: {
            fontSize: 9,
            textColor: 55
          },
          alternateRowStyles: {
            fillColor: [249, 250, 251]
          },
          margin: { top: 40 },
          styles: {
            cellPadding: 3,
            valign: 'middle'
          }
        });

        doc.save(`${fileName}.pdf`);
      }

      showNotification({
        message: `Brand list exported as ${exportFormat === 'excel' ? 'Excel (.xlsx)' : 'PDF (.pdf)'} successfully`,
        type: 'success',
        format: exportFormat,
        isExport: true
      });
    } catch (e) {
      console.error('Export error:', e);
      showNotification({ message: 'Failed to export data', type: 'error' });
    } finally {
      setIsLoading(false);
    }
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

  const handleDeleteBrand = (brand: Brand) => {
    confirm({
      title: 'Delete Brand?',
      description: `Are you sure you want to delete ${brand.name}? This action can be undone by an administrator if needed, as it is a soft delete.`,
      confirmText: 'SWIPE TO DELETE',
      type: 'danger',
      onConfirm: async () => {
        try {
          await brandPartnersService.deleteBrand(brand.id);
          showNotification({ message: 'Brand deleted successfully', type: 'success' });
          loadData();
        } catch (e) {
          showNotification({ message: 'Failed to delete brand', type: 'error' });
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

              <motion.button
                onClick={(e) => { e.stopPropagation(); handleDeleteBrand(item); }}
                className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 shadow-sm transition-colors"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                title="Delete Brand"
              >
                <Trash2 size={18} />
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

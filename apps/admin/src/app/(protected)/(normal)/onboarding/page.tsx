'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { Search, Filter, ArrowLeft, ChevronLeft, ChevronRight, FileText, CheckCircle, XCircle, Clock, AlertCircle } from '@repo/ui/icons';
import { useNotification, LoadingSpinner, Badge, Button } from '@repo/ui';
import { onboardingService, PaginatedResponse, OnboardingSearchParams } from '../../../../features/onboarding/services/onboardingService';
import { OnboardingSummary, OnboardingStatus } from '@repo/types';
import OnboardingDetailModal from '../../../../features/onboarding/components/OnboardingDetailModal';

type FilterTab = 'all' | 'pending' | 'underReview' | 'changes' | 'approved' | 'rejected';

const statusConfig: Record<OnboardingStatus, { label: string; color: string; icon: typeof FileText }> = {
  Draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: FileText },
  Submitted: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700', icon: Clock },
  UnderReview: { label: 'Under Review', color: 'bg-blue-100 text-blue-700', icon: FileText },
  DocumentsRequired: { label: 'Changes Requested', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
  Approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  Rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  Active: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  Suspended: { label: 'Suspended', color: 'bg-red-100 text-red-700', icon: XCircle }
};

const filterTabs: { key: FilterTab; label: string; status?: OnboardingStatus }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending', status: 'Submitted' },
  { key: 'underReview', label: 'Under Review', status: 'UnderReview' },
  { key: 'changes', label: 'Changes', status: 'DocumentsRequired' },
  { key: 'approved', label: 'Approved', status: 'Approved' },
  { key: 'rejected', label: 'Rejected', status: 'Rejected' }
];

export default function OnboardingPage() {
  const [applications, setApplications] = useState<OnboardingSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { showNotification } = useNotification();
  const pageSize = 10;

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: OnboardingSearchParams = {
        query: searchQuery,
        page: currentPage,
        pageSize,
        sortBy: 'submittedAt',
        sortDescending: true
      };

      if (activeFilter !== 'all') {
        const tab = filterTabs.find(t => t.key === activeFilter);
        if (tab?.status) {
          params.status = tab.status;
        }
      }

      const response = await onboardingService.searchApplications(params);
      setApplications(response.data || []);
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      showNotification({ message: 'Failed to load applications', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, currentPage, searchQuery, showNotification]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchApplications();
  };

  const handleViewApplication = (id: string) => {
    setSelectedApplication(id);
    setIsDetailModalOpen(true);
  };

  const handleStatusChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => window.history.back()}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-500" />
            </button>
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider">
              Partner Portal
            </span>
          </div>
          <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
            Onboarding Applications
          </h1>
          <p className="text-gray-500 font-medium mt-1">Review and manage new partner registration applications.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filterTabs.slice(1).map(tab => {
          const count = (applications || []).filter(a => {
            if (!tab.status) return false;
            return a.status === tab.status;
          }).length || 0;

          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveFilter(tab.key);
                setCurrentPage(1);
              }}
              className={`p-4 rounded-xl border-2 transition-all text-left ${activeFilter === tab.key
                ? 'border-lime-500 bg-lime-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
            >
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-500">{tab.label}</div>
            </button>
          );
        })}
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by hotel or brand name..."
            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-lime-500 focus:outline-none transition-colors bg-white"
          />
        </form>
        <button className="h-12 px-5 rounded-xl border-2 border-gray-200 hover:border-lime-500 hover:bg-lime-50 text-gray-500 hover:text-lime-700 font-bold text-sm transition-all flex items-center gap-2 bg-white">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : (!applications || applications.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FileText size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No applications found</p>
            <p className="text-sm">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {(applications || []).map((app) => {
              const config = statusConfig[app.status];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleViewApplication(app.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{app.hotelName}</h3>
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1 ${config.color}`}>
                          <StatusIcon size={12} />
                          {config.label}
                        </span>
                      </div>
                      <p className="text-gray-500 font-medium mb-1">{app.brandName}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{app.city}, {app.country}</span>
                        <span>•</span>
                        <span>{app.totalRooms} rooms</span>
                        <span>•</span>
                        <span>{'⭐'.repeat(app.starRating)}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                      <p>Submitted</p>
                      <p className="font-medium text-gray-600">
                        {new Date(app.submittedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, total)} of {total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === pageNum
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedApplication && (
          <OnboardingDetailModal
            applicationId={selectedApplication}
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedApplication(null);
            }}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

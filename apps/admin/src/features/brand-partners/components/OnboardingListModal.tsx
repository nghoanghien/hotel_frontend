import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { Search, Eye, FileText, CheckCircle, XCircle, Clock, AlertCircle, X, Users, Filter, LayoutGrid, FileSearch } from '@repo/ui/icons';
import { brandPartnersService } from '../services/brandPartnersService';
import { OnboardingSummary, OnboardingStatus } from '@repo/types';
import { format } from 'date-fns';
import { LoadingSpinner } from '@repo/ui';
import OnboardingDetailView from './OnboardingDetailView';

interface OnboardingListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'list' | 'detail';

export default function OnboardingListModal({ isOpen, onClose }: OnboardingListModalProps) {
  const [applications, setApplications] = useState<OnboardingSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OnboardingStatus | 'All'>('PendingReview');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>('list');

  useEffect(() => {
    if (isOpen && view === 'list') {
      fetchApplications();
    }
  }, [isOpen, statusFilter, view]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = await brandPartnersService.getAllApplications(statusFilter === 'All' ? undefined : statusFilter);
      setApplications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewClick = (appId: string) => {
    setSelectedAppId(appId);
    setView('detail');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedAppId(null);
  };

  const handleStatusUpdate = () => {
    // Data will be refetched by useEffect when view changes back to 'list'
    // or we can manually trigger it if we stay in list?
    // useEffect deps include 'view', so going back to 'list' triggers fetch.
  };

  const statusConfig: Record<string, { color: string, bg: string, border: string, icon: any }> = {
    Draft: { color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', icon: FileText },
    PendingReview: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Clock },
    DocumentsRequired: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertCircle },
    ChangesRequested: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: AlertCircle },
    Approved: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle },
    Rejected: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle },
  };

  const tabs: { id: OnboardingStatus | 'All', label: string, icon: any }[] = [
    { id: 'All', label: 'All Requests', icon: LayoutGrid },
    { id: 'PendingReview', label: 'Pending', icon: Clock },
    { id: 'DocumentsRequired', label: 'Docs Info', icon: FileSearch },
    { id: 'Approved', label: 'Approved', icon: CheckCircle },
    { id: 'Rejected', label: 'Rejected', icon: XCircle },
  ];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl h-[90vh] bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* View Switcher */}
            {view === 'list' && (
              <>
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 bg-lime-100 text-lime-700 rounded-xl">
                        <Users size={20} />
                      </div>
                      <h2 className="text-2xl font-anton text-gray-900 uppercase">Onboarding Requests</h2>
                    </div>
                    <p className="text-sm text-gray-500 font-medium ml-1">Manage new brand registration applications</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Toolbar */}
                <div className="px-8 py-4 border-b border-gray-100 flex items-center gap-4 overflow-x-auto no-scrollbar bg-white">
                  {/* Filter Icon Label */}
                  <div className="flex items-center gap-2 pr-4 border-r border-gray-100 mr-2 shrink-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400">
                      <Filter size={14} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Filters</span>
                  </div>

                  {tabs.map(tab => {
                    const TabIcon = tab.icon;
                    const isActive = statusFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border flex items-center gap-2 group
                                            ${isActive
                            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg shadow-gray-200 scale-105'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'}
                                        `}
                      >
                        <TabIcon size={14} className={isActive ? 'text-lime-400' : 'text-gray-400 group-hover:text-gray-600'} />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-auto bg-gray-50/30 p-8 custom-scrollbar">
                  <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden min-h-[400px] relative">

                    {isLoading ? (
                      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white">
                        <LoadingSpinner size={50} color="#84cc16" />
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full h-full"
                      >
                        <table className="w-full">
                          <thead className="bg-gray-50/50">
                            <tr>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Hotel / Brand</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Applicant</th>
                              <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">Scale</th>
                              <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">Submission</th>
                              <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {applications.map((app) => {
                              const config = statusConfig[app.status] || statusConfig['Draft'];
                              const StatusIcon = config.icon;
                              return (
                                <tr key={app.id} className="group hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4">
                                    <div>
                                      <div className="font-bold text-gray-900 group-hover:text-lime-700 transition-colors">{app.hotelName}</div>
                                      <div className="text-xs font-medium text-gray-400 mt-0.5">{app.brandName} • {app.city}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                        {app.applicantName.charAt(0)}
                                      </div>
                                      <div>
                                        <div className="text-sm font-bold text-gray-700">{app.applicantName}</div>
                                        <div className="text-[10px] text-gray-400">{app.applicantEmail}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <div className="inline-flex flex-col">
                                      <span className="text-sm font-bold text-gray-900">{app.totalRooms} Rooms</span>
                                      <span className="text-[10px] text-gray-500">{app.starRating} Stars</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <div className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                                      <Clock size={12} />
                                      {app.submittedAt ? format(new Date(app.submittedAt), 'dd/MM/yyyy') : '-'}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${config.bg} ${config.color} ${config.border} shadow-sm`}>
                                      <StatusIcon size={12} />
                                      {app.status.replace(/([A-Z])/g, ' $1').trim()}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button
                                      onClick={() => handleReviewClick(app.id)}
                                      className="inline-flex items-center gap-2 bg-gray-900 hover:bg-lime-500 hover:text-white text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
                                    >
                                      <Eye size={14} />
                                      Review
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        {applications.length === 0 && (
                          <div className="py-20 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                              <FileText className="text-gray-300 w-8 h-8" />
                            </div>
                            <p className="text-gray-900 font-bold">No applications found</p>
                            <p className="text-gray-400 text-xs mt-1">There are no {statusFilter !== 'All' ? statusFilter.replace(/([A-Z])/g, ' $1').toLowerCase() : ''} applications at the moment.</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                  </div>
                </div>
              </>
            )}

            {view === 'detail' && selectedAppId && (
              <OnboardingDetailView
                applicationId={selectedAppId}
                onBack={handleBackToList}
                onStatusUpdate={handleStatusUpdate}
              />
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

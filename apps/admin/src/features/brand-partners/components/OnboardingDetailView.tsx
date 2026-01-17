import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  ArrowLeft, Building2, MapPin, Globe, User, Phone, Mail,
  FileText, CheckCircle, XCircle, AlertCircle, Clock,
  Download, Eye, Check, X, Shield, CreditCard, Calendar
} from '@repo/ui/icons';
import { OnboardingApplication, DocumentStatus, OnboardingStatus } from '@repo/types';
import { brandPartnersService } from '../services/brandPartnersService';
import { useNotification, Button, LoadingSpinner, useSwipeConfirmation } from '@repo/ui';

interface OnboardingDetailViewProps {
  applicationId: string;
  onBack: () => void;
  onStatusUpdate: () => void;
}

export default function OnboardingDetailView({ applicationId, onBack, onStatusUpdate }: OnboardingDetailViewProps) {
  const [application, setApplication] = useState<OnboardingApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'subscription'>('overview');
  const [processingAction, setProcessingAction] = useState<string | null>(null); // 'approve', 'reject', 'request_changes', 'doc_review_{id}'
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();

  // Interaction States
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    loadData();
  }, [applicationId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await brandPartnersService.getApplicationById(applicationId);
      setApplication(data);
    } catch (e) {
      showNotification({ message: 'Failed to load application details', type: 'error' });
      onBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewDocument = async (docId: string, status: DocumentStatus) => {
    setProcessingAction(`doc_review_${docId}`);
    try {
      await brandPartnersService.reviewDocument(docId, status);
      // Update local state
      setApplication(prev => prev ? ({
        ...prev,
        documents: prev.documents.map(d => d.id === docId ? { ...d, status } : d)
      }) : null);
      showNotification({ message: `Document ${status.toLowerCase()}`, type: 'success' });
    } catch (e) {
      showNotification({ message: 'Failed to update document status', type: 'error' });
    } finally {
      setProcessingAction(null);
    }
  };

  const executeApproveApplication = async () => {
    try {
      await brandPartnersService.approveApplication(applicationId);
      showNotification({ message: 'Application Approved Successfully. Brand & User created.', type: 'success' });
      onStatusUpdate();
      onBack();
    } catch (e) {
      showNotification({ message: 'Failed to approve application', type: 'error' });
    }
  };

  const handleApproveClick = () => {
    // Check if all documents are approved
    const pendingDocs = application?.documents.some(d => d.status !== 'Approved');
    const warningText = pendingDocs ? '⚠️ WARNING: Some documents are NOT approved yet. ' : '';

    confirm({
      title: 'Approve & Activate',
      description: `${warningText}This will activate ${application?.brandName} and convert the application into a live Brand Partner account.`,
      confirmText: 'SWIPE TO APPROVE',
      type: 'success',
      onConfirm: async () => {
        await executeApproveApplication();
      }
    });
  };

  const handleRejectApplication = async () => {
    if (!noteContent.trim()) {
      showNotification({ message: 'Please provide a rejection reason', type: 'error' });
      return;
    }
    setProcessingAction('reject');
    try {
      await brandPartnersService.rejectApplication(applicationId, noteContent);
      showNotification({ message: 'Application Rejected', type: 'success' });
      onStatusUpdate();
      onBack();
    } catch (e) {
      showNotification({ message: 'Failed to reject application', type: 'error' });
    } finally {
      setProcessingAction(null);
    }
  };

  const handleRequestChanges = async () => {
    if (!noteContent.trim()) {
      showNotification({ message: 'Please provide feedback notes', type: 'error' });
      return;
    }
    setProcessingAction('request_changes');
    try {
      await brandPartnersService.reviewApplication(applicationId, 'ChangesRequested', noteContent);
      showNotification({ message: 'Changes requested successfully', type: 'success' });
      onStatusUpdate();
      onBack();
    } catch (e) {
      showNotification({ message: 'Failed to request changes', type: 'error' });
    } finally {
      setProcessingAction(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size={40} color="#84cc16" />
      </div>
    );
  }

  if (!application) return null;

  return (
    <div className="flex flex-col h-full bg-gray-50/30">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {application.hotelName}
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${application.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                application.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-yellow-50 text-yellow-700 border-yellow-200'
                }`}>
                {application.status}
              </span>
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Application ID: {application.id}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {application.status === 'PendingReview' && (
            <>
              <button onClick={() => setShowRejectDialog(true)} className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all">
                Reject
              </button>
              <button onClick={() => setShowRequestDialog(true)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold transition-all">
                Request Changes
              </button>
              <button
                onClick={handleApproveClick}
                className="px-6 py-2 rounded-xl bg-[#1A1A1A] text-white hover:bg-lime-600 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <Check size={16} />
                Approve & Activate
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-8 pt-4 bg-white border-b border-gray-100 flex gap-6">
          {['overview', 'documents', 'subscription'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 text-sm font-bold capitalize transition-all border-b-2 ${activeTab === tab ? 'border-lime-500 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-8 custom-scrollbar">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Hotel Info */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Building2 size={16} /> Hotel Information
                </h3>
                <div className="space-y-3">
                  <InfoRow label="Hotel Name" value={application.hotelName} />
                  <InfoRow label="Brand" value={application.brandName} />
                  <InfoRow label="Address" value={`${application.address}, ${application.city}, ${application.country}`} />
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow label="Rooms" value={application.totalRooms} />
                    <InfoRow label="Rating" value={`${application.starRating} Stars`} />
                  </div>
                  <InfoRow label="Description" value={application.hotelDescription || '-'} />
                </div>
              </div>

              {/* Applicant & Business */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <User size={16} /> Applicant Details
                  </h3>
                  <div className="space-y-3">
                    <InfoRow label="Full Name" value={application.applicantName} />
                    <InfoRow label="Email" value={application.applicantEmail} />
                    <InfoRow label="Contact Name" value={application.contactName} />
                    <InfoRow label="Phone" value={application.contactPhone} />
                    <InfoRow label="Position" value={application.contactPosition || '-'} />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Shield size={16} /> Business Information
                  </h3>
                  <div className="space-y-3">
                    <InfoRow label="Legal Name" value={application.legalBusinessName} />
                    <InfoRow label="Tax ID" value={application.taxId || '-'} />
                    <InfoRow label="Reg Number" value={application.businessRegistrationNumber || '-'} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Document Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">File Name</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {application.documents.map(doc => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{doc.type.replace(/([A-Z])/g, ' $1')}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-2">
                        <FileText size={14} /> {doc.fileName}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${doc.status === 'Approved' ? 'bg-green-50 text-green-700' :
                          doc.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                            'bg-yellow-50 text-yellow-700'
                          }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="View PDF">
                          <Eye size={16} />
                        </button>

                        {(application.status === 'PendingReview' || application.status === 'DocumentsRequired') && (
                          <>
                            {doc.status !== 'Approved' && (
                              <button
                                onClick={() => handleReviewDocument(doc.id, 'Approved')}
                                disabled={processingAction === `doc_review_${doc.id}`}
                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 border border-green-200"
                                title="Approve"
                              >
                                <Check size={16} />
                              </button>
                            )}
                            {doc.status !== 'Rejected' && (
                              <button
                                onClick={() => handleReviewDocument(doc.id, 'Rejected')}
                                disabled={processingAction === `doc_review_${doc.id}`}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200"
                                title="Reject"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center text-lime-600">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Subscription Plan</h3>
                  <p className="text-gray-500 text-sm">Selected billing details</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 grid grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Plan Name</label>
                  <div className="text-lg font-bold text-gray-900">{application.selectedPlanName || 'Standard Plan'}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Billing Cycle</label>
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <Calendar size={18} className="text-gray-400" />
                    {application.selectedBillingCycle || 'Monthly'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog
        isOpen={showRejectDialog} onClose={() => setShowRejectDialog(false)}
        title="Reject Application"
        actionLabel="Reject Application"
        isDestructive
        onAction={handleRejectApplication}
      >
        <textarea
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm min-h-[120px]"
          placeholder="Enter rejection reason..."
          value={noteContent}
          onChange={e => setNoteContent(e.target.value)}
        />
      </Dialog>

      <Dialog
        isOpen={showRequestDialog} onClose={() => setShowRequestDialog(false)}
        title="Request Changes"
        actionLabel="Send Request"
        onAction={handleRequestChanges}
      >
        <p className="text-sm text-gray-500 mb-3">Specify which information needs to be updated or corrected.</p>
        <textarea
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 outline-none text-sm min-h-[120px]"
          placeholder="Enter feedback notes..."
          value={noteContent}
          onChange={e => setNoteContent(e.target.value)}
        />
      </Dialog>

    </div>
  );
}

function InfoRow({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className="text-sm font-bold text-gray-900 text-right">{value}</span>
    </div>
  )
}

function Dialog({ isOpen, onClose, title, children, actionLabel, onAction, isDestructive }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-[500px] max-w-full rounded-2xl shadow-2xl relative z-10 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
          <button onClick={onAction} className={`px-4 py-2 rounded-xl text-sm font-bold text-white shadow-md active:scale-95 ${isDestructive ? 'bg-red-500 hover:bg-red-600' : 'bg-[#1A1A1A] hover:bg-lime-600'}`}>
            {actionLabel}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

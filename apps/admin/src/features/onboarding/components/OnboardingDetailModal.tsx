'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, CheckCircle, XCircle, Clock, FileText, AlertCircle, ChevronLeft, ChevronRight } from '@repo/ui/icons';
import { useNotification, LoadingSpinner, Button } from '@repo/ui';
import { onboardingService } from '../services/onboardingService';
import { OnboardingApplication, OnboardingStatus, DocumentStatus } from '@repo/types';

interface OnboardingDetailModalProps {
  applicationId: string;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: () => void;
}

const statusSteps: { status: OnboardingStatus; label: string }[] = [
  { status: 'Submitted', label: 'Pending Review' },
  { status: 'UnderReview', label: 'Under Review' },
  { status: 'DocumentsRequired', label: 'Changes Requested' },
  { status: 'Approved', label: 'Approved' },
  { status: 'Rejected', label: 'Rejected' }
];

const documentTypeLabels: Record<string, string> = {
  BusinessLicense: 'Business License',
  FireSafetyCertificate: 'Fire Safety Certificate',
  TaxRegistration: 'Tax Registration',
  HotelPhotos: 'Hotel Photos',
  ManagerId: 'Manager ID',
  Other: 'Other Documents'
};

export default function OnboardingDetailModal({ applicationId, isOpen, onClose, onStatusChange }: OnboardingDetailModalProps) {
  const [application, setApplication] = useState<OnboardingApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { showNotification } = useNotification();

  useEffect(() => {
    if (isOpen && applicationId) {
      fetchApplication();
    }
  }, [isOpen, applicationId]);

  const fetchApplication = async () => {
    setIsLoading(true);
    try {
      const data = await onboardingService.getApplicationById(applicationId);
      setApplication(data);
    } catch (error) {
      showNotification({ message: 'Failed to load application details', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    setIsActionLoading(true);
    try {
      const result = await onboardingService.approveApplication(applicationId);
      showNotification({ message: result.message, type: 'success' });
      onStatusChange();
      onClose();
    } catch (error) {
      showNotification({ message: 'Failed to approve application', type: 'error' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    setIsActionLoading(true);
    try {
      await onboardingService.rejectApplication(applicationId, 'Application does not meet requirements');
      showNotification({ message: 'Application rejected', type: 'success' });
      onStatusChange();
      onClose();
    } catch (error) {
      showNotification({ message: 'Failed to reject application', type: 'error' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRequestChanges = async () => {
    setIsActionLoading(true);
    try {
      await onboardingService.reviewApplication(applicationId, 'DocumentsRequired', 'Please provide additional documents');
      showNotification({ message: 'Changes requested', type: 'success' });
      onStatusChange();
      fetchApplication();
    } catch (error) {
      showNotification({ message: 'Failed to request changes', type: 'error' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleStartReview = async () => {
    setIsActionLoading(true);
    try {
      await onboardingService.reviewApplication(applicationId, 'UnderReview');
      showNotification({ message: 'Review started', type: 'success' });
      onStatusChange();
      fetchApplication();
    } catch (error) {
      showNotification({ message: 'Failed to start review', type: 'error' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDocumentReview = async (docId: string, status: DocumentStatus) => {
    try {
      await onboardingService.reviewDocument(docId, status);
      showNotification({ message: 'Document reviewed', type: 'success' });
      fetchApplication();
    } catch (error) {
      showNotification({ message: 'Failed to review document', type: 'error' });
    }
  };

  const getStatusIndex = (status: OnboardingStatus) => {
    return statusSteps.findIndex(s => s.status === status);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {isLoading ? 'Loading...' : application?.hotelName}
                </h2>
                <p className="text-sm text-gray-500">
                  {isLoading ? '...' : application?.brandName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isLoading && application && getStatusIndex(application.status) >= 0 && (
                <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-700 text-sm font-medium">
                  {statusSteps[getStatusIndex(application.status)]?.label}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size={48} />
              </div>
            ) : application ? (
              <div className="space-y-8">
                {/* Status Timeline */}
                <div className="flex items-center justify-between px-4">
                  {statusSteps.map((step, index) => {
                    const currentIndex = application ? getStatusIndex(application.status) : -1;
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                      <div key={step.status} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted || isCurrent
                            ? 'bg-[#1A1A1A] text-white'
                            : 'bg-gray-200 text-gray-400'
                          }`}>
                          {isCompleted ? <CheckCircle size={16} /> : <Clock size={16} />}
                        </div>
                        <span className={`ml-2 text-sm font-medium ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                          {step.label}
                        </span>
                        {index < statusSteps.length - 1 && (
                          <div className={`w-16 h-0.5 mx-4 ${index < currentIndex ? 'bg-[#1A1A1A]' : 'bg-gray-200'
                            }`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column - Hotel Info */}
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Hotel Information</h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm text-gray-500">Hotel Name</dt>
                          <dd className="font-medium">{application.hotelName}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Star Rating</dt>
                          <dd>{'⭐'.repeat(application.starRating)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Total Rooms</dt>
                          <dd className="font-medium">{application.totalRooms}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Address</dt>
                          <dd className="font-medium">{application.address}, {application.city}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Person</h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm text-gray-500">Name</dt>
                          <dd className="font-medium">{application.contactName}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Position</dt>
                          <dd className="font-medium">{application.contactPosition}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Email</dt>
                          <dd className="font-medium">{application.contactEmail}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Phone</dt>
                          <dd className="font-medium">{application.contactPhone}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Selected Plan</h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm text-gray-500">Plan</dt>
                          <dd className="font-medium">{application.selectedPlanName}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Billing Cycle</dt>
                          <dd className="font-medium">{application.selectedBillingCycle}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Price</dt>
                          <dd className="font-medium text-green-600">
                            Custom Pricing
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Right Column - Documents & Actions */}
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Documents</h3>
                      <div className="space-y-3">
                        {application.documents.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                              <FileText size={20} className="text-gray-400" />
                              <div>
                                <p className="font-medium text-sm">{documentTypeLabels[doc.type] || doc.type}</p>
                                <p className="text-xs text-gray-400">{doc.fileName}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {doc.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => handleDocumentReview(doc.id, 'Approved')}
                                    className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                    title="Approve"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDocumentReview(doc.id, 'Rejected')}
                                    className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                    title="Reject"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </>
                              )}
                              {doc.status === 'Approved' && (
                                <span className="px-2 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-medium">
                                  Approved
                                </span>
                              )}
                              {doc.status === 'Rejected' && (
                                <span className="px-2 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-medium">
                                  Rejected
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Legal Information</h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm text-gray-500">Business Name</dt>
                          <dd className="font-medium">{application.legalBusinessName}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Tax ID</dt>
                          <dd className="font-medium">{application.taxId}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">BRN</dt>
                          <dd className="font-medium">{application.businessRegistrationNumber}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <AlertCircle size={48} className="mb-4" />
                <p>Application not found</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              Submitted: {application?.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : '-'}
            </div>
            <div className="flex items-center gap-3">
              {application && application.status === 'Submitted' && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleRequestChanges}
                    loading={isActionLoading}
                  >
                    Request Changes
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleStartReview}
                    loading={isActionLoading}
                  >
                    Start Review
                  </Button>
                </>
              )}
              {application && application.status === 'UnderReview' && (
                <>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    loading={isActionLoading}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleApprove}
                    loading={isActionLoading}
                  >
                    Approve
                  </Button>
                </>
              )}
              <Button
                variant="secondary"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, Building2, User, FileText, Check, XCircle, Clock, MapPin } from '@repo/ui/icons';
import { brandPartnersService } from '../services/brandPartnersService';
import { OnboardingSummary, OnboardingStatus } from '@repo/types';

interface ReviewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: OnboardingSummary | null;
  onStatusChange: () => void;
}

export default function ReviewApplicationModal({ isOpen, onClose, application, onStatusChange }: ReviewApplicationModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!application || typeof document === 'undefined') return null;

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await brandPartnersService.approveApplication(application.id);
      onStatusChange();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await brandPartnersService.rejectApplication(application.id, 'Does not meet requirements');
      onStatusChange();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-xl font-anton text-gray-900 uppercase">Review Application</h2>
                <p className="text-sm text-gray-500 font-medium">Review details and approve membership</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-6">
              {/* Summary Card */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{application.hotelName}</h3>
                    <p className="text-sm text-gray-500">{application.brandName}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs font-medium text-gray-400">
                      <MapPin size={12} />
                      {application.city}, {application.country}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-anton text-gray-900">{application.totalRooms}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase">Rooms</span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Applicant</label>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{application.applicantName}</div>
                      <div className="text-xs text-gray-400">{application.applicantEmail}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Documents</label>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white cursor-pointer hover:border-lime-200 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-lime-50 flex items-center justify-center">
                      <FileText size={18} className="text-lime-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">View Documents</div>
                      <div className="text-xs text-lime-600">3 Attachments</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              {application.status === 'PendingReview' ? (
                <>
                  <button
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="px-6 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-all flex items-center gap-2"
                  >
                    <XCircle size={18} />
                    Reject Logic
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-lime-600 hover:bg-lime-700 shadow-lg hover:shadow-lime-200 transition-all flex items-center gap-2"
                  >
                    {isProcessing ? <Clock size={18} className="animate-spin" /> : <Check size={18} />}
                    Approve & Onboard
                  </button>
                </>
              ) : (
                <span className="text-sm font-bold text-gray-400 py-3">
                  Application is {application.status}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

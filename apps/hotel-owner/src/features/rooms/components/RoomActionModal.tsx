import React, { useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { RoomDto, RoomStatus } from '@repo/types';
import { X, CheckCircle, AlertTriangle, Settings, BedDouble, Layers, Zap, Droplets, Armchair, Wrench, HelpCircle } from '@repo/ui/icons';
import CustomSelect from './CustomSelect';
import { useSwipeConfirmation, useNotification } from '@repo/ui';

interface RoomActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomDto | null;
  onUpdateStatus: (roomId: string, status: RoomStatus) => Promise<void>;
  onReportMaintenance: (roomId: string, reason: string, description: string) => Promise<void>;
}

export default function RoomActionModal({ isOpen, onClose, room, onUpdateStatus, onReportMaintenance }: RoomActionModalProps) {
  const [actionType, setActionType] = useState<'status' | 'maintenance'>('status');
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus>(room?.status || 'Available');
  const [maintenanceReason, setMaintenanceReason] = useState('');
  const [maintenanceDesc, setMaintenanceDesc] = useState('');

  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();

  // Reset state when room changes
  React.useEffect(() => {
    if (room) {
      setSelectedStatus(room.status);
      setActionType('status'); // Default to status change
      setMaintenanceReason('');
      setMaintenanceDesc('');
    }
  }, [room]);

  const handleSubmit = () => {
    if (!room) return;
    if (actionType === 'maintenance' && !maintenanceReason) return;

    confirm({
      title: actionType === 'status' ? 'Confirm Status Update' : 'Confirm Maintenance Report',
      description: actionType === 'status'
        ? `Are you sure you want to change room status to ${selectedStatus}?`
        : `This will mark room ${room.roomNumber} as requiring maintenance.`,
      confirmText: "Swipe to Confirm",
      type: actionType === 'status' ? 'info' : 'danger',
      onConfirm: async () => {
        try {
          if (actionType === 'status') {
            await onUpdateStatus(room.id, selectedStatus);
            showNotification({ message: `Room ${room.roomNumber} status updated to ${selectedStatus} `, type: 'success', format: "Dữ liệu cập nhật thành công." });
          } else {
            await onReportMaintenance(room.id, maintenanceReason, maintenanceDesc);
            showNotification({ message: `Maintenance reported for Room ${room.roomNumber}`, type: 'success', format: "Báo cáo bảo trì thành công." });
          }
          onClose(); // Close the Action Modal on success
        } catch (error) {
          console.error("Action failed", error);
          showNotification({ message: 'Action failed. Please try again.', type: 'error', format: "Action failed. Please try again." });
        }
      }
    });
  };

  if (!room) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-[500px] rounded-[32px] p-8 shadow-2xl relative pointer-events-auto"
              >
                <button onClick={onClose} className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="mb-6">
                  <h2 className="text-2xl font-anton font-bold text-[#1A1A1A]">Manage Room {room.roomNumber}</h2>
                  <p className="text-gray-500 text-sm mt-1">Update status or report issues</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                  <button
                    onClick={() => setActionType('status')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${actionType === 'status' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => setActionType('maintenance')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${actionType === 'maintenance' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Report Issue
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  {actionType === 'status' ? (
                    <div className="grid grid-cols-2 gap-3">
                      {(['Available', 'Occupied', 'Cleaning', 'Dirty'] as RoomStatus[]).map(status => {
                        const config = {
                          Available: { activeBg: 'bg-lime-50', activeText: 'text-lime-700', activeBorder: 'border-lime-500', icon: CheckCircle },
                          Occupied: { activeBg: 'bg-blue-50', activeText: 'text-blue-700', activeBorder: 'border-blue-500', icon: BedDouble },
                          Cleaning: { activeBg: 'bg-orange-50', activeText: 'text-orange-700', activeBorder: 'border-orange-500', icon: Layers },
                          Dirty: { activeBg: 'bg-orange-100', activeText: 'text-orange-800', activeBorder: 'border-orange-600', icon: Layers },
                          Maintenance: { activeBg: 'bg-red-50', activeText: 'text-red-700', activeBorder: 'border-red-500', icon: Settings },
                          OutOfOrder: { activeBg: 'bg-gray-100', activeText: 'text-gray-700', activeBorder: 'border-gray-500', icon: AlertTriangle },
                        }[status] || { activeBg: 'bg-gray-50', activeText: 'text-gray-700', activeBorder: 'border-gray-500', icon: CheckCircle };

                        const Icon = config.icon;
                        const isSelected = selectedStatus === status;

                        return (
                          <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`p-4 rounded-xl border-2 text-left transition-all group flex items-center gap-3
                                      ${isSelected
                                ? `${config.activeBg} ${config.activeText} ${config.activeBorder} shadow-md`
                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-600'
                              }`}
                          >
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/50' : 'bg-gray-100 group-hover:bg-white transition-colors'}`}>
                              <Icon size={18} />
                            </div>
                            <div>
                              <div className="font-bold">{status}</div>
                            </div>
                            {isSelected && <CheckCircle className="ml-auto w-5 h-5" />}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <CustomSelect
                          label="Issue Type"
                          value={maintenanceReason}
                          onChange={setMaintenanceReason}
                          placeholder="Select a reason..."
                          options={[
                            { value: 'broken_appliance', label: 'Broken Appliance (AC, TV, etc.)', icon: <Wrench size={16} /> },
                            { value: 'plumbing', label: 'Plumbing / Water Issue', icon: <Droplets size={16} /> },
                            { value: 'electrical', label: 'Electrical Issue', icon: <Zap size={16} /> },
                            { value: 'furniture', label: 'Broken Furniture', icon: <Armchair size={16} /> },
                            { value: 'other', label: 'Other', icon: <HelpCircle size={16} /> }
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all min-h-[100px]"
                          placeholder="Describe the issue in detail..."
                          value={maintenanceDesc}
                          onChange={(e) => setMaintenanceDesc(e.target.value)}
                        />
                      </div>
                      <div className="p-3 bg-red-50 rounded-xl flex gap-3 text-red-700 text-sm">
                        <AlertTriangle className="shrink-0 mt-0.5" size={16} />
                        <div>
                          Warning: This will set the room status to <strong>Maintenance</strong> or <strong>OutOfOrder</strong> and make it unavailable for booking.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-end gap-3">
                  <button onClick={onClose} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={actionType === 'maintenance' && !maintenanceReason}
                    className={`px-8 py-3 font-bold text-white rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                                          ${actionType === 'status' ? 'bg-[#1A1A1A] hover:bg-black shadow-gray-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'}
`}
                  >
                    {actionType === 'status' ? 'Update Status' : 'Submit Report'}
                  </button>
                </div>

              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

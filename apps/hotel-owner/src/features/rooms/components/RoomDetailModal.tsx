import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, AlertCircle } from '@repo/ui/icons';
import { RoomDetailDto } from '@repo/types';
import { roomService } from '../services/roomService';
import RoomGallery from './detail/RoomGallery';
import RoomBasicInfo from './detail/RoomBasicInfo';
import RoomAmenities from './detail/RoomAmenities';
import { LoadingSpinner } from '@repo/ui';

interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string | null;
}

export default function RoomDetailModal({ isOpen, onClose, roomId }: RoomDetailModalProps) {
  const [room, setRoom] = useState<RoomDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && roomId) {
      loadRoomDetails(roomId);
    } else {
      setRoom(null);
      setError(null);
    }
  }, [isOpen, roomId]);

  const loadRoomDetails = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await roomService.getRoomDetail(id);
      setRoom(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load room details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
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
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl relative pointer-events-auto flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10">
                <div>
                  <h2 className="text-2xl font-anton font-bold text-[#1A1A1A]">Room Details</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {roomId ? `Viewing detailed information for room` : 'Select a room'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
                    <LoadingSpinner size={48} />
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-full text-red-500 gap-3">
                    <AlertCircle size={48} />
                    <p className="font-medium">{error}</p>
                    <button
                      onClick={() => roomId && loadRoomDetails(roomId)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-bold text-sm"
                    >
                      Retry
                    </button>
                  </div>
                ) : room ? (
                  <div className="space-y-8">
                    {/* Gallery Section */}
                    <section>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Gallery
                      </h3>
                      <RoomGallery images={room.images || []} />
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column: Basic Info */}
                      <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500" />
                          General Information
                        </h3>
                        <RoomBasicInfo room={room} />
                      </section>

                      {/* Right Column: Amenities */}
                      <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          Amenities & Features
                        </h3>
                        <RoomAmenities amenities={room.amenities || []} />
                      </section>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

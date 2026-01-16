import { motion, AnimatePresence } from '@repo/ui/motion';
import { useState, useEffect } from 'react';
import { BookingDto } from '@repo/types';
import { LoadingSpinner, useNotification, InputField, ImageWithFallback } from '@repo/ui';
import { receptionService } from '../services/receptionService';
import { X, Key, CheckCircle, AlertCircle, Search, Home, Wind, Wifi, Coffee, Star, Tv, MapPin, ArrowRight, User, Image as ImageIcon, ShieldCheck } from '@repo/ui/icons';

interface RoomOption {
  id: string;
  roomNumber: string;
  floor: number;
  status: 'Available';
  type: string;
  price: number;
  view?: string;
  features: string[];
  description: string;
  images: string[];
  size: number; // m2
}

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDto | null;
  onSuccess: () => void;
}

export default function CheckInModal({ isOpen, onClose, booking, onSuccess }: CheckInModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<RoomOption[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { showNotification } = useNotification();

  useEffect(() => {
    if (isOpen && booking) {
      fetchAvailableRooms();
    }
  }, [isOpen, booking]);

  const fetchAvailableRooms = async () => {
    if (!booking?.roomType) return;
    setLoadingRooms(true);
    try {
      // Mock Data Generation with richer details
      await new Promise(resolve => setTimeout(resolve, 800));
      const floors = [1, 2, 3, 4, 5];
      const rooms: RoomOption[] = [];
      const roomImages = [
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80',
      ];

      floors.forEach(floor => {
        const count = 3 + Math.floor(Math.random() * 3);
        for (let i = 1; i <= count; i++) {
          rooms.push({
            id: `r-${floor}0${i}`,
            roomNumber: `${floor}0${i}`,
            floor: floor,
            status: 'Available',
            type: booking.roomType || 'Standard',
            price: booking.totalAmount / (Math.max(1, Math.round((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 3600 * 24)))),
            view: Math.random() > 0.5 ? 'City Skyline View' : 'Tropical Garden View',
            features: ['Non-smoking', Math.random() > 0.5 ? 'Private Balcony' : 'Panoramic Window', 'Free High-Speed Wi-Fi', 'Smart TV 55"', 'Minibar'],
            description: `Experience ultimate comfort in this spacious ${booking.roomType} suite located on floor ${floor}. Adjusted for maximum natural light and featuring premium bedding for a restful sleep.`,
            images: roomImages,
            size: 35 + Math.floor(Math.random() * 15)
          });
        }
      });

      setAvailableRooms(rooms);
      if (rooms.length > 0) setSelectedRoomId(rooms[0].id);

    } catch (e) {
      showNotification({ message: 'Failed to load rooms', type: 'error' });
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleCheckIn = async () => {
    if (!booking || !selectedRoomId) return;
    setIsLoading(true);
    try {
      await receptionService.checkIn(booking.id);
      const room = availableRooms.find(r => r.id === selectedRoomId);
      showNotification({
        message: `Successfully checked in guest to Room ${room?.roomNumber}`,
        type: 'success',
        format: 'Check-in thành công!'
      });
      onSuccess();
      onClose();
    } catch (e) {
      showNotification({ message: 'Failed to check in.', type: 'error', format: 'Lỗi check-in' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRooms = availableRooms.filter(r =>
    r.roomNumber.includes(searchQuery) ||
    r.view?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedRoom = availableRooms.find(r => r.id === selectedRoomId);

  if (!booking) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#F8F9FA] w-full max-w-[1400px] h-[90vh] rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto border border-white/20 grid grid-cols-[35%_65%] gap-0"
            >
              {/* LEFT PANEL: Room Selection */}
              <div className="bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] mb-1">SELECT ROOM</h2>
                  <p className="text-xs text-gray-500 font-medium mb-4">Available rooms for <span className="text-[#1A1A1A] font-bold">{booking.roomType}</span></p>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search room number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                  {loadingRooms ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400">
                      <LoadingSpinner size={24} />
                      <span className="text-xs font-bold uppercase tracking-wider">Finding Available Rooms...</span>
                    </div>
                  ) : filteredRooms.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <Home className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm font-medium">No rooms found</p>
                    </div>
                  ) : (
                    filteredRooms.map(room => (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`w-full p-4 rounded-2xl border transition-all duration-200 text-left group relative overflow-hidden
                                                ${selectedRoomId === room.id
                            ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-lg scale-[1.02]'
                            : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-md'
                          }
                                            `}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-anton tracking-wide ${selectedRoomId === room.id ? 'text-white' : 'text-[#1A1A1A]'}`}>{room.roomNumber}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${selectedRoomId === room.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>Floor {room.floor}</span>
                          </div>
                          {selectedRoomId === room.id && <CheckCircle className="w-5 h-5 text-lime-400" />}
                        </div>

                        <div className={`space-y-1 ${selectedRoomId === room.id ? 'text-gray-300' : 'text-gray-500'}`}>
                          <div className="flex items-center gap-2 text-xs font-medium">
                            <Wind size={12} /> {room.view}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium">
                            <div className="flex gap-1 flex-wrap">
                              {room.features.slice(0, 3).map((f, i) => (
                                <span key={i} className={`px-1.5 py-0.5 rounded text-[9px] uppercase border ${selectedRoomId === room.id ? 'border-white/20' : 'border-gray-200'}`}>
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* RIGHT PANEL: Detail & Check In */}
              <div className="bg-[#F8F9FA] flex flex-col h-full overflow-hidden relative">
                <button onClick={onClose} className="absolute right-6 top-6 z-20 p-3 rounded-full bg-white/80 backdrop-blur hover:bg-white transition-colors shadow-sm">
                  <X className="w-5 h-5 text-gray-900" />
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                  <div className="max-w-3xl mx-auto space-y-8 pt-4">

                    {selectedRoom ? (
                      <>
                        {/* Room Gallery */}
                        <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[320px] rounded-[32px] overflow-hidden shadow-sm relative">
                          <div className="col-span-2 row-span-2 relative bg-gray-200">
                            <ImageWithFallback src={selectedRoom.images[0]} fill className="object-cover" alt="Main view" />
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-[#1A1A1A] font-anton text-3xl shadow-lg">
                              Room {selectedRoom.roomNumber}
                            </div>
                          </div>
                          <div className="col-span-2 row-span-1 relative bg-gray-200">
                            <ImageWithFallback src={selectedRoom.images[1]} fill className="object-cover" alt="Detail" />
                          </div>
                          <div className="col-span-2 row-span-1 relative bg-gray-200">
                            <ImageWithFallback src={selectedRoom.images[2]} fill className="object-cover" alt="Detail" />
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md flex items-center gap-1">
                              <ImageIcon size={12} /> +4 Photos
                            </div>
                          </div>
                        </div>

                        {/* Info Columns */}
                        <div className="grid grid-cols-2 gap-8">
                          {/* Left Info Col */}
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">{booking.roomType} Suite</h3>
                              <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                                <div className="flex items-center gap-1.5"><MapPin size={16} /> Floor {selectedRoom.floor}</div>
                                <div className="flex items-center gap-1.5"><Wind size={16} /> {selectedRoom.size}m²</div>
                                <div className="flex items-center gap-1.5"><User size={16} /> Max 2 Guests</div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</h4>
                              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                {selectedRoom.description}
                              </p>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Amenities</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {selectedRoom.features.map((feat, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white border border-gray-100 p-2 rounded-lg">
                                    <Star size={12} className="text-yellow-500" />
                                    {feat}
                                  </div>
                                ))}
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white border border-gray-100 p-2 rounded-lg">
                                  <Wifi size={12} className="text-blue-500" /> Free Wifi
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white border border-gray-100 p-2 rounded-lg">
                                  <Coffee size={12} className="text-brown-500" /> Coffee Maker
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Info Col (Booking & Action) */}
                          <div className="space-y-6">
                            <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Current Booking</h4>
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                                    {booking.guest?.fullName?.charAt(0) || 'G'}
                                  </div>
                                  <div>
                                    <div className="font-bold text-[#1A1A1A]">{booking.guest?.fullName || 'Guest'}</div>
                                    <div className="text-xs text-gray-500">{booking.bookingCode}</div>
                                  </div>
                                </div>
                                <div className="h-px bg-gray-100" />
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Check In</span>
                                  <span className="font-bold text-[#1A1A1A]">{new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Duration</span>
                                  <span className="font-bold text-[#1A1A1A]">
                                    {Math.max(1, Math.round((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 3600 * 24)))} Nights
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Quick Policies */}
                            <div className="bg-blue-50/50 p-4 rounded-[20px] border border-blue-100 flex gap-3 text-sm text-blue-800">
                              <ShieldCheck size={20} className="shrink-0 text-blue-600" />
                              <div>
                                <span className="font-bold">Check-in Policy:</span> Valid ID required upon arrival.
                                Room inspection will be conducted before handover.
                              </div>
                            </div>

                            <button
                              onClick={handleCheckIn}
                              disabled={isLoading}
                              className="w-full py-4 bg-lime-500 hover:bg-lime-600 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-lime-200 transition-all flex items-center justify-center gap-3 text-lg"
                            >
                              {isLoading ? <LoadingSpinner size={24} color='white' /> : (
                                <>
                                  <Key size={24} /> Confirm Check In
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 pt-20">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
                          <Key size={40} className="opacity-50" />
                        </div>
                        <p className="font-medium">Select a room from the left to view details</p>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

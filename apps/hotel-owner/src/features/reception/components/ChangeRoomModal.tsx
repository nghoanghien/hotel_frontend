import { motion, AnimatePresence } from '@repo/ui/motion';
import { useState, useEffect } from 'react';
import { BookingDto, AdditionalChargeDto } from '@repo/types';
import { LoadingSpinner, useNotification, useSwipeConfirmation, ImageWithFallback } from '@repo/ui';
import { receptionService } from '../services/receptionService';
import { X, CheckCircle, Search, Home, Wind, Wifi, Star, ArrowRight, ArrowLeftRight, ShieldCheck, MapPin, User, Coffee, Image as ImageIcon } from '@repo/ui/icons';

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
  size: number;
}

interface ChangeRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDto | null;
  onSuccess: () => void;
}

export default function ChangeRoomModal({ isOpen, onClose, booking, onSuccess }: ChangeRoomModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<RoomOption[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();

  useEffect(() => {
    if (isOpen && booking) {
      fetchAvailableRooms();
    }
  }, [isOpen, booking]);

  const fetchAvailableRooms = async () => {
    setLoadingRooms(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const floors = [1, 2, 3, 4, 5];
      const rooms: RoomOption[] = [];
      const roomImages = [
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80',
      ];

      const types = ['Standard', 'Deluxe', 'Suite', 'Presidential'];

      floors.forEach(floor => {
        const count = 3;
        for (let i = 1; i <= count; i++) {
          const type = types[Math.floor(Math.random() * types.length)];
          const basePrice = 500000 * (types.indexOf(type) + 1);

          if (booking?.roomNumber !== `${floor}0${i}`) {
            rooms.push({
              id: `r-${floor}0${i}`,
              roomNumber: `${floor}0${i}`,
              floor: floor,
              status: 'Available',
              type: type,
              price: basePrice,
              view: Math.random() > 0.5 ? 'City Skyline View' : 'Ocean View',
              features: ['Non-smoking', Math.random() > 0.5 ? 'Private Balcony' : 'Panoramic Window', 'Free High-Speed Wi-Fi', 'Smart TV 55"', 'Minibar'],
              description: `Upgrade your stay with this premium ${type} room. Featuring modern amenities and a breathtaking view.`,
              images: roomImages,
              size: 30 + (types.indexOf(type) * 10)
            });
          }
        }
      });

      setAvailableRooms(rooms);
    } catch (e) {
      showNotification({ message: 'Failed to load rooms', type: 'error' });
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleChangeRoom = async () => {
    if (!booking || !selectedRoomId) return;

    confirm({
      title: 'Confirm Room Change',
      description: `Are you sure you want to move guest to Room ${availableRooms.find(r => r.id === selectedRoomId)?.roomNumber}?`,
      confirmText: 'Swipe to Move',
      type: 'info',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          // Mock API call
          await new Promise(r => setTimeout(r, 1000));

          showNotification({
            message: `Successfully moved guest to Room ${availableRooms.find(r => r.id === selectedRoomId)?.roomNumber}`,
            type: 'success',
            format: 'Đổi phòng thành công!'
          });
          onSuccess();
          onClose();
        } catch (e) {
          showNotification({ message: 'Failed to change room', type: 'error' });
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const filteredRooms = availableRooms.filter(r =>
    r.roomNumber.includes(searchQuery) ||
    r.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedRoom = availableRooms.find(r => r.id === selectedRoomId);
  const nights = booking ? Math.max(1, Math.round((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 3600 * 24))) : 1;
  const differencePrice = selectedRoom && booking ? (selectedRoom.price - (booking.totalAmount / nights)) : 0;

  if (!booking) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
          />

          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#F8F9FA] w-full max-w-[1400px] h-[90vh] rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto border border-white/20 grid grid-cols-[35%_65%] gap-0"
            >
              {/* LEFT: Room Selection */}
              <div className="bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] mb-1">CHANGE ROOM</h2>
                  <p className="text-xs text-gray-500 font-medium mb-4">Move guest from <span className="text-red-500 font-bold">{booking.roomNumber}</span> to:</p>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search room or type..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                  {loadingRooms ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400">
                      <LoadingSpinner size={24} />
                      <span className="text-xs font-bold uppercase tracking-wider">Loading Inventory...</span>
                    </div>
                  ) : filteredRooms.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <Home className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm font-medium">No rooms available</p>
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
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${selectedRoomId === room.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{room.type}</span>
                          </div>
                          {selectedRoomId === room.id && <CheckCircle className="w-5 h-5 text-lime-400" />}
                        </div>

                        <div className={`text-xs font-medium mb-1 ${selectedRoomId === room.id ? 'text-gray-300' : 'text-gray-500'}`}>
                          Floor {room.floor} • {room.size}m²
                        </div>
                        <div className={`text-sm font-bold ${selectedRoomId === room.id ? 'text-lime-400' : 'text-[#1A1A1A]'}`}>
                          {room.price.toLocaleString()} đ <span className="text-[10px] font-normal opacity-70">/night</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* RIGHT: Detail & Comparison */}
              <div className="bg-[#F8F9FA] flex flex-col h-full overflow-hidden relative">
                <button onClick={onClose} className="absolute right-6 top-6 z-20 p-3 rounded-full bg-white/80 backdrop-blur hover:bg-white transition-colors shadow-sm">
                  <X className="w-5 h-5 text-gray-900" />
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                  <div className="max-w-3xl mx-auto space-y-6 pt-6">

                    {/* Header Comparison */}
                    {selectedRoom ? (
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-6">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center opacity-60">
                          <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Current Room</div>
                          <div className="text-2xl font-anton text-gray-800">{booking.roomNumber}</div>
                          <div className="text-xs text-gray-500">{booking.roomType}</div>
                        </div>
                        <div className="flex items-center justify-center text-gray-400">
                          <ArrowRight size={24} />
                        </div>
                        <div className="bg-white p-4 rounded-2xl border-2 border-[#1A1A1A] text-center shadow-lg relative">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Moving To</div>
                          <div className="text-2xl font-anton text-[#1A1A1A]">{selectedRoom.roomNumber}</div>
                          <div className="text-xs text-gray-500">{selectedRoom.type}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-20 text-gray-400 flex flex-col items-center">
                        <Home className="w-16 h-16 mb-4 opacity-20" />
                        <p className="font-medium">Select a room to view details & comparison</p>
                      </div>
                    )}

                    {selectedRoom && (
                      <div className="space-y-6">
                        {/* Room Gallery */}
                        <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[300px] rounded-[32px] overflow-hidden shadow-sm relative">
                          <div className="col-span-2 row-span-2 relative bg-gray-200">
                            <ImageWithFallback src={selectedRoom.images[0]} fill className="object-cover" alt="Main view" />
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

                        {/* Details Columns */}
                        <div className="grid grid-cols-2 gap-6">
                          {/* Left: Info */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-4 text-sm font-medium text-gray-500 bg-white p-4 rounded-2xl border border-gray-100">
                              <div className="flex items-center gap-1.5"><MapPin size={16} /> Floor {selectedRoom.floor}</div>
                              <div className="flex items-center gap-1.5"><Wind size={16} /> {selectedRoom.size}m²</div>
                              <div className="flex items-center gap-1.5"><User size={16} /> Max 2</div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">About Room</h4>
                              <p className="text-sm text-gray-600 leading-relaxed font-medium bg-white p-4 rounded-2xl border border-gray-100">
                                {selectedRoom.description}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Amenities</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedRoom.features.map((feat, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-gray-700 bg-white border border-gray-100 px-3 py-2 rounded-xl">
                                    <Star size={12} className="text-yellow-500" />
                                    {feat}
                                  </div>
                                ))}
                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-700 bg-white border border-gray-100 px-3 py-2 rounded-xl">
                                  <Wifi size={12} className="text-blue-500" /> Free Wifi
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right: Price & Action */}
                          <div className="space-y-4">
                            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Financial Summary</h4>

                              {/* Price Diff */}
                              <div className="p-4 rounded-2xl bg-gray-50 mb-6 flex flex-col gap-2 relative overflow-hidden">
                                <div className="flex justify-between items-center z-10">
                                  <div className="flex items-center gap-2">
                                    <ArrowLeftRight size={16} className="text-blue-500" />
                                    <span className="text-sm font-bold text-gray-700">Rate Difference</span>
                                  </div>
                                  <span className={`font-bold text-lg ${differencePrice > 0 ? 'text-gray-900' : 'text-green-600'}`}>
                                    {differencePrice > 0 ? '+' : ''}{differencePrice.toLocaleString()} đ
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400 font-medium z-10 text-right">
                                  per night
                                </div>
                              </div>

                              <button
                                onClick={handleChangeRoom}
                                disabled={isLoading}
                                className="w-full py-4 bg-[#1A1A1A] text-white font-bold rounded-2xl shadow-xl hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-3"
                              >
                                {isLoading ? <LoadingSpinner size={24} color='white' /> : (
                                  <>
                                    <ArrowLeftRight size={20} />
                                    <span>Confirm Move</span>
                                  </>
                                )}
                              </button>

                              <p className="text-center text-gray-400 text-[10px] mt-4 flex items-center justify-center gap-1 font-medium">
                                <ShieldCheck size={12} /> System will update inventory & charges
                              </p>
                            </div>
                          </div>
                        </div>
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

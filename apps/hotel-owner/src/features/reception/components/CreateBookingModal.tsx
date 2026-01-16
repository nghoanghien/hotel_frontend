import { useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, Calendar, Search, User, Phone, Mail, CreditCard, ArrowRight, CheckCircle, MapPin, Users } from '@repo/ui/icons';
import { InputField, LoadingSpinner, useNotification, ImageWithFallback } from '@repo/ui';
import { receptionService } from '../services/receptionService';
import { CreateBookingDto } from '@repo/types';
import DateRangePicker from '../../rooms/components/DateRangePicker';
import { ChevronDown, Filter } from '@repo/ui/icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBookingModal({ isOpen, onClose, onSuccess }: Props) {
  const { showNotification } = useNotification();
  const [step, setStep] = useState(1); // 1: Search & Select, 2: Guest Details & Confirm
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Search State
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: new Date(),
    to: new Date(Date.now() + 86400000)
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [roomTypeFilter, setRoomTypeFilter] = useState('All');
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Selection State
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);

  // Guest State
  const [guestInfo, setGuestInfo] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    idCard: '',
    notes: ''
  });

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const rooms = await receptionService.getAvailableRooms('hotel-1', {
        checkIn: dateRange.from ? dateRange.from.toISOString().split('T')[0] : '',
        checkOut: dateRange.to ? dateRange.to.toISOString().split('T')[0] : ''
      });
      setAvailableRooms(rooms);
      setHasSearched(true);
    } catch (error) {
      showNotification({ message: 'Failed to search rooms', type: 'error' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!selectedRoom) return;
    if (!guestInfo.fullName || !guestInfo.phoneNumber) {
      showNotification({ message: 'Please fill in guest details', type: 'error', format: "Điền đầy đủ thông tin trước khi tạo booking." });
      return;
    }

    setIsLoading(true);
    try {
      const payload: CreateBookingDto = {
        hotelId: 'hotel-1',
        checkInDate: dateRange.from?.toISOString() || '',
        checkOutDate: dateRange.to?.toISOString() || '',
        rooms: [{
          roomId: selectedRoom.id,
          numberOfAdults: selectedRoom.capacity,
          numberOfChildren: 0,
          numberOfInfants: 0,
          guestName: guestInfo.fullName
        }],
        guestName: guestInfo.fullName,
        guestPhoneNumber: guestInfo.phoneNumber,
        guestEmail: guestInfo.email,
        specialRequests: guestInfo.notes || undefined,
        paymentMethod: 'Cash', // Default for walk-in
      };

      await receptionService.createBooking(payload);
      showNotification({ message: 'Booking created successfully!', type: 'success', format: "Tạo booking thành công!" });
      onSuccess();
      onClose();
    } catch (error) {
      showNotification({ message: 'Failed to create booking', type: 'error', format: "Thất bại khi tạo booking!" });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate nights
  const nights = dateRange.from && dateRange.to
    ? Math.max(1, Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 3600 * 24)))
    : 0;
  const totalAmount = selectedRoom ? selectedRoom.price * nights : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[50]"
          />

          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-[#F8F9FA] w-full max-w-5xl h-[85vh] rounded-[40px] overflow-hidden shadow-2xl pointer-events-auto flex border border-white/20"
            >
              {/* LEFT PANEL: Room Selection (60%) */}
              <div className="w-[60%] bg-white border-r border-gray-200 flex flex-col relative z-10">
                {/* Header */}
                <div className="p-8 pb-4 border-b border-gray-100">
                  <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] mb-2">NEW WALK-IN BOOKING</h3>
                  <p className="text-gray-500 text-sm">Select dates and find available rooms for the guest.</p>

                  {/* Search Bar */}
                  {/* Search Bar with Custom Date Range Picker */}
                  <div className="mt-6 flex gap-3 relative z-30">
                    <div
                      className="flex-1 bg-gray-50 rounded-2xl border border-gray-100 p-2 flex items-center cursor-pointer hover:bg-gray-100 transition-colors relative"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    >
                      <div className="flex-1 px-4 border-r border-gray-200">
                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Check In</label>
                        <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                          <Calendar size={14} className="text-lime-600" />
                          {dateRange.from ? dateRange.from.toLocaleDateString('vi-VN') : 'Select Date'}
                        </div>
                      </div>
                      <div className="flex-1 px-4">
                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Check Out</label>
                        <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          {dateRange.to ? dateRange.to.toLocaleDateString('vi-VN') : 'Select Date'}
                        </div>
                      </div>
                      <div className="pr-4">
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    <button
                      onClick={handleSearch}
                      disabled={isSearching || !dateRange.from || !dateRange.to}
                      className="bg-[#1A1A1A] text-white px-6 rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center gap-2 disabled:opacity-70 h-auto"
                    >
                      {isSearching ? <LoadingSpinner size={16} color="white" /> : <Search size={16} />}
                      Check
                    </button>

                    {/* Date Picker Popover */}
                    <AnimatePresence>
                      {isCalendarOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98, x: '-50%' }}
                          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                          exit={{ opacity: 0, y: 10, scale: 0.98, x: '-50%' }}
                          className="absolute top-full left-1/2 mt-2 z-50 shadow-2xl rounded-3xl"
                        >
                          <div className="bg-white rounded-3xl p-1 shadow-2xl border border-gray-100">
                            <DateRangePicker
                              dateRange={dateRange}
                              onChange={(range) => {
                                setDateRange(range);
                                // Close calendar if both dates are selected (optional, nice UX)
                                // if (range.from && range.to) setIsCalendarOpen(false); 
                              }}
                            />
                            <div className="p-4 border-t border-gray-50 flex justify-end">
                              <button
                                onClick={(e) => { e.stopPropagation(); setIsCalendarOpen(false); }}
                                className="px-4 py-2 bg-[#1A1A1A] text-white rounded-xl text-xs font-bold hover:bg-black"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Room Type Filter Chips */}
                  {hasSearched && availableRooms.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 items-center">
                      <div className="mr-2 p-2 rounded-full bg-gray-100 text-gray-400">
                        <Filter size={14} />
                      </div>
                      {['All', ...Array.from(new Set(availableRooms.map(r => r.type)))].map((type) => (
                        <button
                          key={type}
                          onClick={() => setRoomTypeFilter(type as string)}
                          className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border
                                      ${roomTypeFilter === type
                              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg shadow-gray-200 transform scale-105'
                              : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-600 shadow-sm'
                            }
                                  `}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Room Grid */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50/30">
                  {!hasSearched ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                        <Calendar size={40} className="text-gray-300" />
                      </div>
                      <p className="font-medium text-sm">Select dates and click Check to find rooms</p>
                    </div>
                  ) : availableRooms.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                      <p className="font-medium text-sm">No rooms available for selected dates</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {availableRooms
                        .filter(room => roomTypeFilter === 'All' || room.type === roomTypeFilter)
                        .map((room) => <div
                          key={room.id}
                          onClick={() => setSelectedRoom(room)}
                          className={`bg-white p-3 rounded-3xl border-2 border-gray-200 cursor-pointer transition-all group relative overflow-hidden
                                            ${selectedRoom?.id === room.id
                              ? 'border-[#1A1A1A] shadow-lg ring-1 ring-[#1A1A1A]'
                              : 'border-gray-100 hover:border-gray-300 hover:shadow-md'
                            }
                                        `}
                        >
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-gray-100 relative">
                            <ImageWithFallback
                              src={room.image}
                              alt={room.number}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                              {room.type}
                            </div>
                          </div>
                          <div className="flex justify-between items-end">
                            <div>
                              <div className="font-bold text-lg text-[#1A1A1A]">Room {room.number}</div>
                              <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                                <Users size={12} /> {room.capacity} Guests
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-[#1A1A1A]">{room.price.toLocaleString()} đ</div>
                              <div className="text-[10px] text-gray-400">/night</div>
                            </div>
                          </div>
                        </div>
                        )}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANEL: Guest Info & Confirm (40%) */}
              <div className="w-[40%] bg-[#F8F9FA] flex flex-col h-full relative z-20">
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-gray-900 text-lg">Guest Information</h4>
                    <button onClick={onClose} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4 mb-4">
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center gap-3 transition-colors focus-within:border-lime-500/50 focus-within:ring-2 focus-within:ring-lime-100">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <User className="text-gray-400 w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5 tracking-wider">Full Name</label>
                        <input
                          type="text"
                          className="w-full text-sm font-bold text-gray-900 placeholder:text-gray-300 outline-none bg-transparent p-0"
                          placeholder="Enter guest name"
                          value={guestInfo.fullName}
                          onChange={(e) => setGuestInfo({ ...guestInfo, fullName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center gap-3 transition-colors focus-within:border-lime-500/50 focus-within:ring-2 focus-within:ring-lime-100">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <Phone className="text-gray-400 w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5 tracking-wider">Phone Number</label>
                        <input
                          type="tel"
                          className="w-full text-sm font-bold text-gray-900 placeholder:text-gray-300 outline-none bg-transparent p-0"
                          placeholder="Enter phone number"
                          value={guestInfo.phoneNumber}
                          onChange={(e) => setGuestInfo({ ...guestInfo, phoneNumber: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center gap-3 transition-colors focus-within:border-lime-500/50 focus-within:ring-2 focus-within:ring-lime-100">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <Mail className="text-gray-400 w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5 tracking-wider">Email (Optional)</label>
                        <input
                          type="email"
                          className="w-full text-sm font-bold text-gray-900 placeholder:text-gray-300 outline-none bg-transparent p-0"
                          placeholder="guest@example.com"
                          value={guestInfo.email}
                          onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                        />
                      </div>
                    </div>               <div className="bg-white p-3 rounded-2xl border border-gray-100">
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Notes / Special Requests</label>
                      <textarea
                        className="w-full text-sm font-medium text-gray-900 placeholder:text-gray-300 resize-none outline-none min-h-[80px]"
                        placeholder="Arrival time, special needs..."
                        value={guestInfo.notes}
                        onChange={(e) => setGuestInfo({ ...guestInfo, notes: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Booking Summary */}
                  {selectedRoom && (
                    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                          <CheckCircle size={24} className="text-[#1A1A1A]" />
                        </div>
                        <div>
                          <div className="font-bold text-[#1A1A1A] text-lg">Summary</div>
                          <div className="text-xs text-gray-500 font-medium">Please review details</div>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Room</span>
                          <span className="font-bold text-gray-900">{selectedRoom.number} - {selectedRoom.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Duration</span>
                          <span className="font-bold text-gray-900">{nights} nights</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Dates</span>
                          <span className="font-bold text-gray-900">
                            {dateRange.from?.toLocaleDateString()} - {dateRange.to?.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="h-px bg-gray-100 my-2"></div>
                        <div className="flex justify-between items-end">
                          <span className="text-gray-500 font-bold">Total Due</span>
                          <span className="font-anton text-2xl text-[#1A1A1A]">{totalAmount.toLocaleString()} đ</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="p-8 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
                  <button
                    onClick={handleCreateBooking}
                    disabled={!selectedRoom || !guestInfo.fullName || !guestInfo.phoneNumber || isLoading}
                    className="w-full py-4 bg-lime-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-lime-600 transition-all shadow-lg shadow-lime-200 disabled:opacity-50 disabled:shadow-none active:scale-[0.98]"
                  >
                    {isLoading ? <LoadingSpinner size={20} color="white" /> : (
                      <>
                        <span>Create Booking & Check In</span>
                        <ArrowRight size={18} className="stroke-[3]" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

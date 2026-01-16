import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, AlertCircle, Maximize2, Users, Bed, Sparkles, Wifi, Wind, Coffee, Tv, Bath, ChevronLeft, ChevronRight, CheckCircle, BedDouble, Layers, Settings, AlertTriangle } from '@repo/ui/icons';
import { RoomDetailDto, RoomStatus } from '@repo/types';
import { roomService } from '../services/roomService';
import { ImageWithFallback, StatusBadge, RoomDetailModalShimmer } from '@repo/ui';
import { formatVnd } from '@repo/lib';

interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string | null;
}

export default function RoomDetailModal({ isOpen, onClose, roomId }: RoomDetailModalProps) {
  const [room, setRoom] = useState<RoomDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gallery State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (isOpen && roomId) {
      loadRoomDetails(roomId);
      setCurrentImageIndex(0);
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

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0
    })
  };

  // Helper to safely get images array
  const getImages = (): string[] => {
    if (!room) return [];
    if (room.images && room.images.length > 0) {
      return room.images.map(img => typeof img === 'string' ? img : img.imageUrl);
    }
    return room.imageUrl ? [room.imageUrl] : [];
  };

  const roomImages = getImages();

  const nextImage = () => {
    if (roomImages.length <= 1) return;
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % roomImages.length);
  };

  const prevImage = () => {
    if (roomImages.length <= 1) return;
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
  };

  const statusConfig = {
    Available: { color: 'bg-lime-100 text-lime-700 border-lime-200', icon: CheckCircle, label: 'Available' },
    Occupied: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: BedDouble, label: 'Occupied' },
    Cleaning: { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Layers, label: 'Cleaning' },
    Dirty: { color: 'bg-orange-50 text-orange-800 border-orange-200', icon: Layers, label: 'Dirty' },
    Maintenance: { color: 'bg-red-100 text-red-700 border-red-200', icon: Settings, label: 'Maintenance' },
    OutOfOrder: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: AlertTriangle, label: 'Out of Order' },
  };

  const getStatusInfo = (status: RoomStatus) => statusConfig[status] || statusConfig.Available;




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
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#F7F7F7] w-[1100px] max-w-[95vw] h-[85vh] rounded-[40px] shadow-2xl relative overflow-hidden flex pointer-events-auto border border-white/20"
            >
              {isLoading ? (
                <RoomDetailModalShimmer />
              ) : error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-50 gap-4">
                  <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                    <AlertCircle size={32} />
                  </div>
                  <p className="text-gray-600 font-medium">{error}</p>
                  <button onClick={() => roomId && loadRoomDetails(roomId)} className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold">Retry</button>
                  <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-gray-100"><X size={20} /></button>
                </div>
              ) : room ? (
                <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] w-full h-full">

                  {/* Left Column: Info */}
                  <div className="relative h-full bg-white lg:bg-[#F7F7F7] border-r border-gray-100 flex flex-col">
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-8">

                      <div className="">
                        {/* Title & Status */}
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{room.hotelName}</div>
                        <div className="flex items-center gap-4 mb-2 flex-wrap">
                          <h1 className="text-[42px] font-anton font-extrabold text-[#1A1A1A] leading-tight">
                            Room {room.roomNumber}
                          </h1>
                          {/* Status Badge */}
                          {(() => {
                            const info = getStatusInfo(room.status);
                            const Icon = info.icon;
                            return (
                              <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 ${info.color} mt-1`}>
                                <Icon size={14} strokeWidth={2.5} />
                                <span className="text-xs font-bold uppercase tracking-wider">{info.label}</span>
                              </div>
                            )
                          })()}
                        </div>

                        <p className="text-xl font-medium text-gray-500 mb-6">{room.type}</p>

                        {/* Price */}
                        <div className="mb-8 pl-1">
                          <div className="text-3xl font-extrabold text-[var(--primary)] flex items-baseline gap-1">
                            {formatVnd(room.basePrice)}
                            <span className="text-sm font-medium text-gray-400 font-sans uppercase">/ night</span>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1 hover:border-gray-300 transition-colors">
                            <div className="text-gray-400"><Maximize2 size={18} /></div>
                            <div className="font-bold text-lg text-gray-800">{room.sizeInSquareMeters}<span className="text-sm font-normal text-gray-400 ml-1">m²</span></div>
                            <div className="text-xs text-gray-400 font-medium uppercase">Size</div>
                          </div>
                          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1 hover:border-gray-300 transition-colors">
                            <div className="text-gray-400"><Users size={18} /></div>
                            <div className="font-bold text-lg text-gray-800">{room.maxOccupancy}<span className="text-sm font-normal text-gray-400 ml-1">Guests</span></div>
                            <div className="text-xs text-gray-400 font-medium uppercase">Max Occupancy</div>
                          </div>
                          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1 hover:border-gray-300 transition-colors">
                            <div className="text-gray-400"><Bed size={18} /></div>
                            <div className="font-bold text-lg text-gray-800">{room.numberOfBeds}<span className="text-sm font-normal text-gray-400 ml-1">x {room.bedType}</span></div>
                            <div className="text-xs text-gray-400 font-medium uppercase">Bed Config</div>
                          </div>
                          {/* Floor Stat */}
                          {room.floor && (
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1 hover:border-gray-300 transition-colors">
                              <div className="text-gray-400"><Layers size={18} /></div>
                              <div className="font-bold text-lg text-gray-800">{room.floor}</div>
                              <div className="text-xs text-gray-400 font-medium uppercase">Floor</div>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {room.description && (
                          <div className="mb-8 p-5 bg-white rounded-3xl border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                              <Sparkles size={16} className="text-yellow-500" />
                              Description
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{room.description}</p>
                          </div>
                        )}

                        {/* Amenities */}
                        {room.amenities && room.amenities.length > 0 && (
                          <div className="pb-8">
                            <h3 className="font-anton font-bold text-xl text-[#1A1A1A] mb-4">AMENITIES</h3>
                            <div className="flex flex-wrap gap-2">
                              {room.amenities.map(amenity => {
                                const n = amenity.name.toLowerCase();
                                let Icon = Sparkles;
                                if (n.includes('wifi')) Icon = Wifi;
                                else if (n.includes('ac') || n.includes('air')) Icon = Wind;
                                else if (n.includes('tv')) Icon = Tv;
                                else if (n.includes('coffee')) Icon = Coffee;
                                else if (n.includes('bath')) Icon = Bath;

                                return (
                                  <div key={amenity.id} className="px-3 py-2 bg-white border border-gray-200 rounded-xl flex items-center gap-2 text-sm font-medium text-gray-600 shadow-sm">
                                    <Icon size={14} className="text-gray-400" />
                                    {amenity.name}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Gallery */}
                  <div className="relative bg-black h-full overflow-hidden group">
                    {/* Close Button - Moved here */}
                    <button
                      onClick={onClose}
                      className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-black flex items-center justify-center shadow-lg transition-all hover:scale-105"
                    >
                      <X className="w-5 h-5" strokeWidth={2.5} />
                    </button>

                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                      <motion.div
                        key={currentImageIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: "spring", stiffness: 200, damping: 30 },
                          opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0 z-0 bg-gray-900"
                      >
                        <ImageWithFallback
                          src={roomImages[currentImageIndex] || ''}
                          alt={`Room ${room.roomNumber} - Photo ${currentImageIndex + 1}`}
                          fill
                          className="object-cover opacity-90"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Gallery Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                    {/* Navigation Controls - Always Visible if > 1 image */}
                    {roomImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all hover:scale-110 shadow-lg z-20"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all hover:scale-110 shadow-lg z-20"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-8 right-8 bg-black/50 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-xs font-bold tracking-widest z-20">
                      {currentImageIndex + 1} / {Math.max(roomImages.length, 1)}
                    </div>

                    {/* Thumbnails */}
                    {roomImages.length > 1 && (
                      <div className="absolute bottom-8 left-8 right-32 flex gap-3 overflow-x-auto no-scrollbar pointer-events-auto z-20 pb-2">
                        {roomImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => { setDirection(idx > currentImageIndex ? 1 : -1); setCurrentImageIndex(idx); }}
                            className={`relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all border-2 cursor-pointer
                                        ${idx === currentImageIndex ? 'border-white shadow-xl ring-2 ring-black/50' : 'border-white/30 opacity-60 hover:opacity-100 hover:border-white/80'}
                                    `}
                          >
                            <ImageWithFallback src={img} alt="thumb" fill className="object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

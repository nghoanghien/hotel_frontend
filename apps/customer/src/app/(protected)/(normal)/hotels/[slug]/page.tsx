"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ImageWithFallback } from "@repo/ui";
import { Star, MapPin, ArrowLeft, ChevronLeft, ChevronRight, Heart } from "@repo/ui/icons";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useLoading, useNotification, useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import type { HotelDetailDto as Hotel, RoomAvailabilityDto } from "@repo/types";
import { getHotelBySlug, getRoomsByHotelId } from "@/features/search/data/mockHotelData";
import RoomDetailDrawer from "@/features/cart/components/RoomDetailDrawer";
import FloatingHotelCart from "@/features/cart/components/FloatingHotelCart";
import { useBookingStore } from "@/features/booking/store/bookingStore";
import { HotelReviews } from "@/features/hotel/components/HotelReviews";
import { OverviewTab } from '@/features/hotel/components/tabs/OverviewTab';
import { RoomsTab } from '@/features/hotel/components/tabs/RoomsTab';
import { LocationTab } from '@/features/hotel/components/tabs/LocationTab';
import { PoliciesTab } from '@/features/hotel/components/tabs/PoliciesTab';
import { AmenitiesTab } from '@/features/hotel/components/tabs/AmenitiesTab';


type TabType = 'overview' | 'rooms' | 'location' | 'policies' | 'amenities' | 'reviews';

const TABS: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'location', label: 'Location' },
  { id: 'policies', label: 'Policies' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'reviews', label: 'Reviews' },
];

export default function HotelDetailPage() {
  const params = useParams() as { slug: string };
  const router = useRouter();
  const { hide } = useLoading();
  const { showNotification } = useNotification();
  const initializeSession = useBookingStore(s => s.initializeSession);

  useEffect(() => {
    const t = setTimeout(() => hide(), 1500);
    return () => clearTimeout(t);
  }, [hide]);

  const hotel = useMemo(() => getHotelBySlug(params.slug), [params.slug]);
  const rooms = useMemo(() => hotel ? getRoomsByHotelId(hotel.id) : [], [hotel]);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomAvailabilityDto | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Gallery State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = useMemo(() => {
    if (hotel?.images && hotel.images.length > 0) {
      return [...hotel.images].sort((a, b) => a.displayOrder - b.displayOrder);
    }
    return hotel?.imageUrl ? [{ imageUrl: hotel.imageUrl, displayOrder: 0, isPrimary: true, caption: 'Main Image' }] : [];
  }, [hotel]);

  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % galleryImages.length);
  const prevImage = () => setCurrentImageIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));



  // Read search parameters from URL
  const searchParams = useSearchParams();
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  const adultsParam = searchParams.get('adults');
  const childrenParam = searchParams.get('children');
  const roomsParam = searchParams.get('rooms');

  // Parse dates and guest info
  const bookingInfo = useMemo(() => ({
    checkIn: checkInParam ? new Date(checkInParam) : null,
    checkOut: checkOutParam ? new Date(checkOutParam) : null,
    adults: adultsParam ? parseInt(adultsParam) : 2,
    children: childrenParam ? parseInt(childrenParam) : 0,
    rooms: roomsParam ? parseInt(roomsParam) : 1,
  }), [checkInParam, checkOutParam, adultsParam, childrenParam, roomsParam]);

  // Initialize Booking Store Session on Load
  useEffect(() => {
    if (hotel) {
      initializeSession(hotel.id, hotel.name, bookingInfo.checkIn, bookingInfo.checkOut);
    }
  }, [hotel, bookingInfo, initializeSession]);

  const { containerRef: tabContainerRef, rect: tabRect, style: tabStyle, moveHighlight: tabMove, clearHover: tabClear } = useHoverHighlight<HTMLDivElement>();

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Không tìm thấy khách sạn</div>
      </div>
    );
  }

  const handleRoomClick = (room: RoomAvailabilityDto) => {
    setSelectedRoom(room);
    setDrawerOpen(true);
  };

  const getHotelImage = (index: number = 0) => {
    return hotel?.images?.find(img => img.displayOrder === index)?.imageUrl || hotel?.imageUrl || '';
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab hotel={hotel} />;
      case 'rooms':
        return <RoomsTab rooms={rooms} onRoomClick={handleRoomClick} getHotelImage={getHotelImage} />;
      case 'location':
        return <LocationTab hotel={hotel} />;
      case 'policies':
        return <PoliciesTab hotel={hotel} />;
      case 'amenities':
        return <AmenitiesTab hotel={hotel} />;
      case 'reviews':
        return <HotelReviews hotel={hotel} />;
      default:
        return null;
    }
  };

  const mainImage = getHotelImage(0);

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7]">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="fixed top-24 left-6 z-50 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white hover:scale-110 transition-all flex items-center justify-center group"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
      </button>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1400px] mx-auto pr-16 px-8 pt-20 h-full">
          <div className="grid grid-cols-[30%_70%] gap-8 h-full">
            {/* Left Column - Hotel Info */}
            <div className="relative overflow-y-auto no-scrollbar pr-2 space-y-6 mb-6">
              <div>
                <h1
                  className="text-[62px] font-bold leading-tight text-[#1A1A1A] mb-3"
                  style={{
                    fontStretch: "condensed",
                    letterSpacing: "-0.01em",
                    fontFamily: "var(--font-anton), var(--font-sans)",
                  }}
                >
                  {hotel.name.toUpperCase()}
                </h1>
                <p className="text-[14px] text-[#555555] leading-relaxed mb-4">{hotel.description}</p>

                {hotel.brandName && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className="text-[12px] bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full shadow-sm"
                    >
                      {hotel.brandName}
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-2 text-[13px] text-[#555555] mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{hotel.address}</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < (hotel.starRating || 0) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600">({hotel.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Hotel main image */}
              {mainImage && (
                <div className="rounded-[24px] overflow-hidden">
                  <div className="relative aspect-[16/11]">
                    <ImageWithFallback
                      src={mainImage}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Tabs & Content */}
            <div className="relative overflow-y-auto no-scrollbar pl-2 mb-6">
              {/* Gallery Slider */}
              {galleryImages.length > 0 && (
                <div className="relative mb-6 group select-none">
                  <div className="relative aspect-[16/8] rounded-[24px] overflow-hidden shadow-md bg-white">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <ImageWithFallback
                          src={galleryImages[currentImageIndex].imageUrl}
                          alt={galleryImages[currentImageIndex].caption || hotel.name}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-md z-10 pointer-events-none">
                      {currentImageIndex + 1} / {galleryImages.length}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newState = !isFavorite;
                        setIsFavorite(newState);
                        showNotification({
                          message: newState ? 'Đã lưu khách sạn vào danh sách yêu thích!' : 'Đã xóa khách sạn khỏi danh sách yêu thích.',
                          type: 'success',
                          format: "Dữ liệu đã cập nhật thành công",
                          autoHideDuration: 3000,
                        });
                      }}
                      className="absolute top-4 right-4 z-30 px-6 py-3 rounded-2xl bg-white/80 hover:bg-white backdrop-blur-md flex items-center gap-2.5 transition-all shadow-sm group/fav hover:scale-105 active:scale-95"
                    >
                      <Heart
                        className={`w-6 h-6 transition-all ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-700 group-hover/fav:text-rose-500'}`}
                        strokeWidth={2}
                      />
                      <span className={`text-[15px] font-semibold transition-colors ${isFavorite ? 'text-rose-500' : 'text-gray-700 group-hover/fav:text-gray-900'}`}>
                        {isFavorite ? 'Saved' : 'Save to Favorites'}
                      </span>
                    </button>
                  </div>

                  {/* Navigation Buttons */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-sm hover:scale-110 active:scale-95 z-20"
                      >
                        <ChevronLeft className="w-8 h-8 text-gray-600" strokeWidth={2.4} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-sm hover:scale-110 active:scale-95 z-20"
                      >
                        <ChevronRight className="w-8 h-8 text-gray-600" strokeWidth={2.4} />
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Tabs Navigation */}
              <div className="mb-6 sticky top-0 z-40 bg-[#F7F7F7] pt-4 -mt-4">
                <div ref={tabContainerRef} className="relative bg-[#F7F7F7] border-b-2 border-gray-300">
                  <HoverHighlightOverlay rect={tabRect} style={tabStyle} />
                  <div className="overflow-x-auto no-scrollbar">
                    <div className="inline-flex items-center gap-8 px-6 py-4 min-w-full justify-start relative z-10">
                      {TABS.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`text-[28px] font-bold uppercase tracking-wide transition-all relative pb-1 whitespace-nowrap ${activeTab === tab.id ? "text-[#1A1A1A]" : "text-gray-400"
                            }`}
                          style={{
                            fontStretch: "condensed",
                            letterSpacing: "-0.01em",
                            fontFamily: "var(--font-anton), var(--font-sans)",
                          }}
                          onMouseEnter={(e) =>
                            tabMove(e, {
                              borderRadius: 12,
                              backgroundColor: "rgba(0,0,0,0.06)",
                              opacity: 1,
                              scaleEnabled: true,
                              scale: 1.1,
                            })
                          }
                          onMouseLeave={tabClear}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderTabContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RoomDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        room={selectedRoom}
        hotelName={hotel.name}
        checkIn={bookingInfo.checkIn}
        checkOut={bookingInfo.checkOut}
        guests={{ adults: bookingInfo.adults, children: bookingInfo.children }}
        rooms={bookingInfo.rooms}
      />

      <FloatingHotelCart />
    </div>
  );
}

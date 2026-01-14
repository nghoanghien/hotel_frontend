"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ImageWithFallback } from "@repo/ui";
import { Star, MapPin, ArrowLeft, Users, Maximize2, Plus, Wifi, Car, Utensils, Monitor, Snowflake, Waves, Dumbbell, Coffee, Wind, PawPrint, Refrigerator, WashingMachine, CalendarX, Key, Shield, Award, Briefcase, MessageCircle, ShieldCheck } from "@repo/ui/icons";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useLoading, useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import type { HotelDetailDto as Hotel, RoomAvailabilityDto } from "@repo/types";
import { getHotelBySlug, getRoomsByHotelId } from "@/features/search/data/mockHotelData";
import RoomDetailDrawer from "@/features/cart/components/RoomDetailDrawer";
import { HotelReviews } from "@/features/hotel/components/HotelReviews";


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

  useEffect(() => {
    const t = setTimeout(() => hide(), 1500);
    return () => clearTimeout(t);
  }, [hide]);

  const hotel = useMemo(() => getHotelBySlug(params.slug), [params.slug]);
  const rooms = useMemo(() => hotel ? getRoomsByHotelId(hotel.id) : [], [hotel]);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomAvailabilityDto | null>(null);

  // ... (rest of component logic)



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
        return (
          <div className="space-y-12">
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-8">Gặp gỡ khách sạn của bạn</h3>

            <div className="grid grid-cols-[380px_1fr] gap-16">
              {/* Left Column - Card */}
              <div className="space-y-6">
                <div className="bg-white rounded-[32px] p-8 shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                  {/* Main Avatar */}
                  <div className="relative w-32 h-32 mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden relative z-10">
                      <ImageWithFallback src={getHotelImage(0)} alt={hotel.name} fill className="object-cover" />
                    </div>
                    <div className="absolute bottom-1 right-0 z-20 bg-[var(--primary)] text-white p-2 rounded-full shadow-md">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{hotel.name}</h2>
                  <div className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-500">
                    <Award className="w-4 h-4" />
                    <span>Đối tác cao cấp</span>
                  </div>

                  {/* Stats Grid */}
                  <div className="w-full border-t border-gray-200 pt-6">
                    <div className="grid grid-cols-2 gap-4 text-left">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-gray-900">{hotel.reviewCount}</div>
                        <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Đánh giá</div>
                      </div>
                      <div className="space-y-1 pl-4 border-l border-gray-200">
                        <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                          {hotel.starRating} <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                        </div>
                        <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Xếp hạng</div>
                      </div>
                      <div className="col-span-2 mt-4 pt-4 border-t border-gray-200 space-y-1">
                        <div className="text-2xl font-bold text-gray-900">5</div>
                        <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Năm kinh nghiệm đón tiếp khách</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extra Info */}
                <div className="space-y-4 px-2">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Briefcase className="w-6 h-6 stroke-1" />
                    <span>Hoạt động từ năm 2019</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MessageCircle className="w-6 h-6 stroke-1" />
                    <span>Phản hồi nhanh chóng</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{hotel.name} là một Đối tác cao cấp</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {hotel.description}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Đối tác cao cấp là những khách sạn có kinh nghiệm, được đánh giá cao và cam kết mang lại kỳ nghỉ tuyệt vời cho khách.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Thông tin khách sạn</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>Tỉ lệ phản hồi: 100%</li>
                    <li>Phản hồi trong vòng 1 giờ</li>
                  </ul>
                </div>

                <button className="bg-gray-900 text-white px-6 py-3.5 rounded-[10px] font-semibold text-[15px] hover:bg-black transition-colors">
                  Nhắn tin cho khách sạn
                </button>

                <div className="border-t border-gray-200 pt-8 mt-8 flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-gray-500 leading-tight">
                    Để bảo vệ khoản thanh toán của bạn, hãy luôn sử dụng app để chuyển tiền và liên lạc với khách sạn.
                  </p>
                </div>

                {/* Original Images Grid moved here */}
                {hotel.images && hotel.images.length > 1 && (
                  <div className="pt-8">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Hình ảnh nổi bật</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {hotel.images.slice(1, 5).map((img, idx) => (
                        <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden">
                          <ImageWithFallback src={img.imageUrl} alt={`${hotel.name} - ${idx + 2}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'rooms':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6">Available Rooms</h3>
            {rooms.length === 0 ? (
              <div className="p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center">
                <p className="text-gray-500">Currently no rooms available for this hotel.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-x-5 gap-y-8">
                {rooms.map((room) => (
                  <motion.div
                    key={room.roomId}
                    whileHover={{ y: -4 }}
                    onClick={() => handleRoomClick(room)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-square rounded-[20px] overflow-hidden mb-3 bg-gray-100">
                      <ImageWithFallback
                        src={room.imageUrl || getHotelImage(0)}
                        alt={room.type}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badge */}
                      {room.maxOccupancy > 2 && (
                        <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-md border border-white/60 px-4 py-2 rounded-2xl shadow-sm z-10">
                          <span className="text-sm font-semibold text-gray-800 block leading-none pb-0.5">Phù hợp gia đình</span>
                        </div>
                      )}

                      {/* Action Button */}
                      <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border-2 border-white flex items-center justify-center transition-colors z-10 border border-white/20">
                        <Plus className="w-6 h-6 text-white" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="font-semibold text-xl text-gray-900 leading-tight">
                        {room.type}
                      </div>
                      <div className="flex items-center gap-1.5 text-base text-gray-500">
                        <span className="font-bold text-xl text-[var(--primary)]">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.basePrice)}
                        </span>
                        <span className="font-normal text-sm">/đêm</span>
                        <span className="w-1 h-1 rounded-full bg-gray-400 mx-0.5" />
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{room.maxOccupancy}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case 'location':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-4">Location</h3>
            <div className="bg-gray-100 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-[var(--primary)] mt-1" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Address</div>
                  <div className="text-gray-600">{hotel.address}</div>
                </div>
              </div>
              <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                Map placeholder - Integration with Google Maps
              </div>
            </div>
          </div>
        );

      case 'policies':
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-[#1A1A1A]">Những điều cần biết</h3>
            <div className="grid grid-cols-3 gap-8">
              {/* Column 1: Cancellation */}
              <div className="space-y-3">
                <CalendarX className="w-6 h-6 text-gray-900 mb-1" />
                <h4 className="font-semibold text-gray-900 text-lg">Chính sách hủy</h4>
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  Bạn được hủy miễn phí trước {hotel.settings?.minAdvanceBookingHours || 24} giờ khi nhận phòng.
                </p>
                <button className="font-medium text-gray-900 underline underline-offset-2 text-[15px]">Tìm hiểu thêm</button>
              </div>

              {/* Column 2: Rules */}
              <div className="space-y-3">
                <Key className="w-6 h-6 text-gray-900 mb-1" />
                <h4 className="font-semibold text-gray-900 text-lg">Nội quy nhà</h4>
                <div className="text-gray-600 text-[15px] space-y-1">
                  <p>Nhận phòng sau {hotel.publicSettings?.checkInTime || '14:00'}</p>
                  <p>Trả phòng trước {hotel.publicSettings?.checkOutTime || '12:00'}</p>
                  <p>{hotel.publicSettings?.allowExtraBed ? 'Hỗ trợ giường phụ' : 'Không hỗ trợ giường phụ'}</p>
                </div>
                <button className="font-medium text-gray-900 underline underline-offset-2 text-[15px]">Tìm hiểu thêm</button>
              </div>

              {/* Column 3: Safety */}
              <div className="space-y-3">
                <Shield className="w-6 h-6 text-gray-900 mb-1" />
                <h4 className="font-semibold text-gray-900 text-lg">An toàn và chỗ ở</h4>
                <div className="text-gray-600 text-[15px] space-y-1">
                  <p>Có máy báo khói</p>
                  <p>Có bình chữa cháy</p>
                  <p>Khóa cửa thông minh</p>
                </div>
                <button className="font-medium text-gray-900 underline underline-offset-2 text-[15px]">Tìm hiểu thêm</button>
              </div>
            </div>
          </div>
        );

      case 'amenities':
        const getAmenityIcon = (name: string) => {
          const lowerName = name.toLowerCase();
          if (lowerName.includes('wifi') || lowerName.includes('internet')) return Wifi;
          if (lowerName.includes('pool') || lowerName.includes('swim') || lowerName.includes('hồ bơi')) return Waves;
          if (lowerName.includes('ac') || lowerName.includes('cool') || lowerName.includes('điều hòa') || lowerName.includes('lạnh')) return Snowflake;
          if (lowerName.includes('parking') || lowerName.includes('car') || lowerName.includes('đỗ xe')) return Car;
          if (lowerName.includes('restaurant') || lowerName.includes('food') || lowerName.includes('dining') || lowerName.includes('ăn')) return Utensils;
          if (lowerName.includes('tv') || lowerName.includes('monitor')) return Monitor;
          if (lowerName.includes('gym') || lowerName.includes('fitness') || lowerName.includes('thể dục')) return Dumbbell;
          if (lowerName.includes('coffee') || lowerName.includes('cafe')) return Coffee;
          if (lowerName.includes('pet') || lowerName.includes('thú cưng')) return PawPrint;
          if (lowerName.includes('fridge') || lowerName.includes('tủ lạnh')) return Refrigerator;
          if (lowerName.includes('washer') || lowerName.includes('laundry') || lowerName.includes('giặt')) return WashingMachine;
          if (lowerName.includes('hair') || lowerName.includes('dryer') || lowerName.includes('sấy')) return Wind;
          return Star;
        };

        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold mb-4 text-[#1A1A1A]">Nơi này có những gì cho bạn</h3>
            <div className="grid grid-cols-2 gap-y-7 gap-x-12">
              {hotel.amenities?.map((amenity) => {
                const Icon = getAmenityIcon(amenity.name);
                return (
                  <div key={amenity.id} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-gray-700 stroke-[1.5] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-[17px] text-gray-700 font-normal group-hover:text-gray-900 transition-colors">
                      {amenity.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );

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
            <div className="relative overflow-y-auto no-scrollbar pr-2 space-y-6 mb-12">
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
            <div className="relative overflow-y-auto no-scrollbar pl-2 mb-12">
              {/* Hero image */}
              {mainImage && (
                <div className="relative mb-6">
                  <div className="relative aspect-[16/8] rounded-[24px] overflow-hidden shadow-md bg-white">
                    <ImageWithFallback
                      src={mainImage}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
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
    </div>
  );
}

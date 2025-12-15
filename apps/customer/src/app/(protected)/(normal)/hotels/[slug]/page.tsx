"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImageWithFallback } from "@repo/ui";
import { Star, MapPin, ArrowLeft, Users, Maximize2 } from "@repo/ui/icons";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useLoading, useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import type { Hotel, RoomType } from "@repo/types";
import { getHotelBySlug } from "@/features/search/data/mockHotelData";
import RoomDetailDrawer from "@/features/cart/components/RoomDetailDrawer";

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

  const hotel: Hotel | undefined = useMemo(() => getHotelBySlug(params.slug), [params.slug]);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);

  const { containerRef: tabContainerRef, rect: tabRect, style: tabStyle, moveHighlight: tabMove, clearHover: tabClear } = useHoverHighlight<HTMLDivElement>();

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Không tìm thấy khách sạn</div>
      </div>
    );
  }

  const handleRoomClick = (room: RoomType) => {
    setSelectedRoom(room);
    setDrawerOpen(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">About {hotel.name}</h3>
              <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
            </div>
            {hotel.imageUrls.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {hotel.imageUrls.slice(1, 5).map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden">
                    <ImageWithFallback src={img} alt={`${hotel.name} - ${idx + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'rooms':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6">Available Rooms</h3>
            <div className="grid grid-cols-3 gap-5">
              {hotel.roomTypes.map((room) => (
                <motion.div
                  key={room.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleRoomClick(room)}
                  className="group relative bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={room.images[0]}
                      alt={room.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-lg text-gray-900 mb-2">{room.name}</div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Maximize2 className="w-4 h-4" />
                        <span>{room.area}m²</span>
                      </div>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{room.maxGuests} guests</span>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-[var(--primary)]">
                      {(room.price / 1000).toFixed(0)}K<span className="text-sm text-gray-500 font-normal">/night</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
                  <div className="text-gray-600">{hotel.address.fullAddress}</div>
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
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-4">Hotel Policies</h3>
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <div>
                <div className="font-semibold text-gray-900 mb-2">Check-in / Check-out</div>
                <div className="text-gray-600">Check-in: 14:00 | Check-out: 12:00</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-2">Cancellation Policy</div>
                <div className="text-gray-600">Free cancellation up to 24 hours before check-in</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-2">Additional Policies</div>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>No smoking in rooms</li>
                  <li>Pets allowed (additional fee may apply)</li>
                  <li>Children welcome</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'amenities':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-4">Hotel Amenities</h3>
            <div className="grid grid-cols-3 gap-4">
              {hotel.amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                    <span className="text-lg">✓</span>
                  </div>
                  <span className="font-medium text-gray-900">{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Guest Reviews</h3>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                <span className="text-2xl font-bold">{hotel.rating}</span>
                <span className="text-gray-500">({hotel.reviewCount} reviews)</span>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8 text-center text-gray-500">
              Reviews feature coming soon...
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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

                {hotel.categories && hotel.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {hotel.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="text-[12px] bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full shadow-sm"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-start gap-2 text-[13px] text-[#555555] mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{hotel.address.fullAddress}</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < hotel.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600">({hotel.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Hotel main image */}
              {hotel.imageUrls[0] && (
                <div className="rounded-[24px] overflow-hidden">
                  <div className="relative aspect-[16/11]">
                    <ImageWithFallback
                      src={hotel.imageUrls[0]}
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
              {hotel.imageUrls[0] && (
                <div className="relative mb-6">
                  <div className="relative aspect-[16/8] rounded-[24px] overflow-hidden shadow-md bg-white">
                    <ImageWithFallback
                      src={hotel.imageUrls[0]}
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
      />
    </div>
  );
}

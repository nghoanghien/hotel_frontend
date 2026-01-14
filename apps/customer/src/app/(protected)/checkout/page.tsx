"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@repo/ui/icons";
import { useLoading, useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import { useBookingCheckout } from "@/features/booking/hooks/useBookingCheckout";
import GuestInfoForm from "@/features/booking/components/GuestInfoForm";
import SpecialRequestsInput from "@/features/booking/components/SpecialRequestsInput";
import PaymentMethodSelector from "@/features/checkout/components/PaymentMethodSelector";
import BookingSummaryCard from "@/features/booking/components/BookingSummaryCard";
import BookingCheckoutSummary from "@/features/booking/components/BookingCheckoutSummary";
import { formatVnd } from "@repo/lib";

export default function BookingCheckoutPage() {
  const router = useRouter();
  const { hide } = useLoading();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => hide(), 1500);
    return () => clearTimeout(t);
  }, [hide]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    currentBooking,
    paymentMethod,
    setPaymentMethod,
    guestName,
    setGuestName,
    guestEmail,
    setGuestEmail,
    guestPhone,
    setGuestPhone,
    specialRequests,
    setSpecialRequests,
    nights,
    subtotal,
    serviceFee,
    tax,
    total,
  } = useBookingCheckout();

  const leftColumnRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeSection, setActiveSection] = useState<string | null>("guest");

  const tabs = [
    { id: "guest", name: "Guest Info" },
    { id: "summary", name: "Summary" },
    { id: "requests", name: "Requests" },
    { id: "payment", name: "Payment" },
    { id: "checkout", name: "Checkout" },
  ];

  const {
    containerRef: navContainerRef,
    rect: navRect,
    style: navStyle,
    moveHighlight: navMove,
    clearHover: navClear,
  } = useHoverHighlight<HTMLDivElement>();

  useEffect(() => {
    const leftCol = leftColumnRef.current;
    if (!leftCol) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.getAttribute("data-id"));
      },
      { root: leftCol, rootMargin: "-120px 0px -60% 0px", threshold: 0.2 }
    );
    tabs.forEach((tab) => {
      const node = sectionRefs.current[tab.id];
      if (node) obs.observe(node);
    });
    return () => obs.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const node = sectionRefs.current[id];
    const leftCol = leftColumnRef.current;
    if (!node || !leftCol) return;
    const containerRect = leftCol.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const offsetTop = nodeRect.top - containerRect.top + leftCol.scrollTop - 140;
    leftCol.scrollTo({ top: offsetTop, behavior: "smooth" });
  };

  const handleConfirmBooking = () => {
    // TODO: Implement booking confirmation
    alert("Booking confirmed! (Demo)");
    router.push("/home");
  };

  const canConfirm = guestName.trim() !== "" && guestEmail.trim() !== "" && guestPhone.trim() !== "";

  // Redirect if no booking
  if (!currentBooking && mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">No booking found</div>
          <div className="text-gray-600 mb-6">Please select a room to continue</div>
          <button
            onClick={() => router.push("/home")}
            className="px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary)]/90 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentBooking) return null;

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
        <div className="max-w-[1400px] mx-auto pr-16 px-8 pt-12 h-full">
          <div className="grid grid-cols-[65%_35%] gap-8 h-full">
            {/* Left Column */}
            <div ref={leftColumnRef} className="relative overflow-y-auto no-scrollbar pr-2 space-y-6 mb-6">
              {/* Navigation Tabs */}
              <div className="sticky top-0 z-40 bg-[#F7F7F7] pt-2">
                <div ref={navContainerRef} className="relative bg-[#F7F7F7] border-b-2 border-gray-300">
                  <HoverHighlightOverlay rect={navRect} style={navStyle} />
                  <div className="overflow-x-auto no-scrollbar">
                    <div className="inline-flex items-center gap-8 px-6 py-4 min-w-full justify-start relative z-10">
                      {tabs.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => scrollToSection(t.id)}
                          className={`text-[22px] font-bold uppercase tracking-wide transition-all relative pb-1 whitespace-nowrap ${activeSection === t.id ? "text-[#1A1A1A]" : "text-gray-400"
                            }`}
                          style={{
                            fontStretch: "condensed",
                            letterSpacing: "-0.01em",
                            fontFamily: "var(--font-anton), var(--font-sans)",
                          }}
                          onMouseEnter={(e) =>
                            navMove(e, {
                              borderRadius: 12,
                              backgroundColor: "rgba(0,0,0,0.06)",
                              opacity: 1,
                              scaleEnabled: true,
                              scale: 1.2,
                            })
                          }
                          onMouseMove={(e) =>
                            navMove(e, {
                              borderRadius: 12,
                              backgroundColor: "rgba(0,0,0,0.06)",
                              opacity: 1,
                              scaleEnabled: true,
                              scale: 1.2,
                            })
                          }
                          onMouseLeave={navClear}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="rounded-[28px] mx-2 border-2 border-gray-300">
                <section
                  className="p-8 border-b-2 border-gray-300"
                  ref={(el) => {
                    sectionRefs.current["guest"] = el;
                  }}
                  data-id="guest"
                >
                  <GuestInfoForm
                    guestName={guestName}
                    guestEmail={guestEmail}
                    guestPhone={guestPhone}
                    onNameChange={setGuestName}
                    onEmailChange={setGuestEmail}
                    onPhoneChange={setGuestPhone}
                  />
                </section>

                <section
                  className="p-8 border-b-2 border-gray-300"
                  ref={(el) => {
                    sectionRefs.current["summary"] = el;
                  }}
                  data-id="summary"
                >
                  {mounted && <BookingSummaryCard booking={currentBooking} nights={nights} />}
                </section>

                <section
                  className="p-8 border-b-2 border-gray-300"
                  ref={(el) => {
                    sectionRefs.current["requests"] = el;
                  }}
                  data-id="requests"
                >
                  <SpecialRequestsInput value={specialRequests} onChange={setSpecialRequests} />
                </section>

                <section
                  className="p-4 border-b-2 border-gray-300"
                  ref={(el) => {
                    sectionRefs.current["payment"] = el;
                  }}
                  data-id="payment"
                >
                  <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
                </section>

                <section
                  ref={(el) => {
                    sectionRefs.current["checkout"] = el;
                  }}
                  data-id="checkout"
                  className="p-8"
                >
                  {mounted && (
                    <BookingCheckoutSummary
                      subtotal={subtotal}
                      serviceFee={serviceFee}
                      tax={tax}
                      total={total}
                      onConfirm={handleConfirmBooking}
                      canConfirm={canConfirm}
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-4 text-center px-4 leading-relaxed">
                    By proceeding with payment, you agree to Hotelzy's <span className="text-[var(--primary)] cursor-pointer hover:underline">Terms & Conditions</span>, <span className="text-[var(--primary)] cursor-pointer hover:underline">Privacy Policy</span>, and <span className="text-[var(--primary)] cursor-pointer hover:underline">Refund Policy</span>.
                  </p>
                </section>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="relative overflow-y-auto no-scrollbar pl-2 mb-6">
              <div className="sticky top-6 space-y-6">
                {/* Hotel Info Card */}
                <div className="bg-white rounded-2xl border-2 border-gray-300 p-6">
                  <div className="text-xl font-bold text-gray-900 mb-4">{currentBooking.hotelName}</div>
                  <div className="text-sm text-gray-600 mb-6">{currentBooking.roomType.type || currentBooking.roomType.roomNumber}</div>

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per night</span>
                      <span className="font-semibold">{formatVnd(currentBooking.roomType.basePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nights</span>
                      <span className="font-semibold">{nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rooms</span>
                      <span className="font-semibold">{currentBooking.roomsCount}</span>
                    </div>
                    <div className="h-px bg-gray-200" />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-[var(--primary)]">{formatVnd(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Policies Card */}
                {/* Policies Card */}
                <div className="bg-white rounded-2xl border-2 border-gray-300 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Accommodation Policies</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-2">Check-in / Check-out</div>
                      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex justify-between mb-1">
                          <span>Check-in:</span>
                          <span className="font-medium text-gray-900">From 14:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-out:</span>
                          <span className="font-medium text-gray-900">Before 12:00</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-2">Cancellation Policy</div>
                      <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <li>Free cancellation up to 24 hours before check-in</li>
                        <li>Non-refundable if cancelled within 24 hours</li>
                      </ul>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-2">Other Regulations</div>
                      <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <li>Smoking is not allowed in rooms</li>
                        <li>Pets are welcome (additional charges may apply)</li>
                        <li>Quiet hours: 22:00 - 07:00</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

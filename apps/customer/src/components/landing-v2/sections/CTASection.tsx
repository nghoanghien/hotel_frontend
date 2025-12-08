"use client";

import { ArrowRight } from "@repo/ui/icons";
import { Button } from "@repo/ui";

interface CTASectionProps {
  visible: boolean;
  onGetStarted: () => void;
}

export default function CTASection({ visible, onGetStarted }: CTASectionProps) {
  return (
    <>
      {/* Mid CTA */}
      <div
        className={`m-8 md:m-16 lg:m-32 mb-8 md:mb-16 lg:mb-32 flex flex-col md:flex-row items-center justify-between text-center transition-all duration-1000 delay-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
      >
        <h2 className="text-2xl md:text-4xl lg:text-6xl font-light text-white mb-4 md:mb-6 transition-all duration-700 delay-100">
          Đặt Phòng <span className="text-[var(--primary)] font-semibold">Mọi Lúc,</span> Đi Bất Cứ Đâu!
        </h2>
        <div>
          <p className="text-white/80 text-lg md:text-2xl lg:text-3xl font-light max-w-2xl mx-auto mb-6 md:mb-8 transition-all duration-700 delay-200">
            Giờ đây bạn có thể <span className="text-[var(--primary)] font-normal">đặt phòng mọi lúc mọi nơi</span> và{" "}
            <span className="text-[var(--primary)] font-normal">nhận ưu đãi độc quyền</span>.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="rounded-full gap-2 px-8"
            onClick={onGetStarted}
          >
            <span>Bắt Đầu Đặt Phòng</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Final CTA */}
      <div
        className={`m-8 md:m-16 lg:m-32 mb-8 md:mb-16 lg:mb-32 text-center transition-all duration-1000 delay-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
      >
        <h2 className="text-2xl md:text-4xl lg:text-6xl font-light text-white mb-4 md:mb-6 transition-all duration-700 delay-100">
          Bắt đầu hành trình <span className="text-[var(--primary)] font-semibold">NGHỈ DƯỠNG</span> của bạn ngay hôm nay
        </h2>
        <p className="text-white/80 text-xl font-light max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200">
          Với hàng nghìn khách sạn, ưu đãi hấp dẫn và xác nhận siêu nhanh, Hotelzy là lựa chọn hoàn hảo cho kỳ nghỉ của
          bạn.
        </p>
        <Button
          variant="primary"
          size="lg"
          className="rounded-full gap-2 px-8"
          onClick={onGetStarted}
        >
          <span>Đặt Phòng Ngay</span>
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      {/* Footer branding */}
      <div
        className={`m-8 md:m-16 lg:m-28 mb-8 md:mb-16 text-center transition-all duration-1000 delay-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
      >
        <div className="flex text-center items-center justify-center gap-2 animate-reveal">
          <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--primary)]">Hotelzy</div>
          <div className="relative w-7 h-7 transform rotate-45 rounded-md flex items-center justify-center hover:rotate-90 transition-all duration-300">
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]"></div>
            <div className="absolute inset-[3px] rounded-md bg-gradient-to-br from-emerald-200 to-lime-200 shadow-lg"></div>
            <div className="absolute inset-[6px] rounded-md bg-white"></div>
            <svg
              className="absolute inset-0 m-auto w-5 h-5 transform -rotate-45 hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>
        <div className="mt-4 text-xl md:text-2xl lg:text-3xl font-light text-center text-[var(--primary)] animate-fade-in-up">
          Stay Easy, with Hotelzy
        </div>
      </div>
    </>
  );
}


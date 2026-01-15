import type { HotelDetailDto } from "@repo/types";
import { ImageWithFallback } from "@repo/ui";
import {
  Star, ShieldCheck, Briefcase, MessageCircle, Award,
  Hotel as HotelIcon
} from "@repo/ui/icons";

interface Props {
  hotel: HotelDetailDto;
}

export function OverviewTab({ hotel }: Props) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left Column - Key Info Card */}
      <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] h-fit xl:sticky xl:top-32 xl:col-span-1">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-100 p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                {hotel.brand?.logoUrl ? (
                  <ImageWithFallback src={hotel.brand.logoUrl} alt="Brand Logo" width={88} height={88} className="object-cover" />
                ) : (
                  <HotelIcon className="w-10 h-10 text-gray-400" />
                )}
              </div>
            </div>
            {hotel.isVerified && (
              <div className="absolute bottom-0 right-0 bg-[#1A1A1A] text-white p-1.5 rounded-full border-4 border-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{hotel.brand?.name || "Khách sạn"}</h3>
            <div className="text-sm font-medium text-gray-500 mt-1">
              {hotel.isVerified ? "Đối tác đã xác minh" : "Đối tác dịch vụ"}
            </div>
          </div>
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
                {hotel.averageRating?.toFixed(1) || '0'} <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
              </div>
              <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Điểm số</div>
            </div>
            <div className="col-span-2 mt-4 pt-4 border-t border-gray-200 space-y-1">
              <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {hotel.totalRooms || '--'} <span className="text-sm font-normal text-gray-500 mt-1">phòng</span>
              </div>
              <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Quy mô khách sạn</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Details */}
      <div className="space-y-8 xl:col-span-2">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Giới thiệu về {hotel.name}</h3>
          <div className="bg-amber-50 rounded-2xl p-6 mb-6 flex items-start gap-4">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-1">Khách sạn tiêu chuẩn {hotel.starRating} sao</h4>
              <p className="text-gray-600 text-sm">Được đánh giá cao về chất lượng dịch vụ và tiện nghi.</p>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-lg mb-6 whitespace-pre-line">
            {hotel.description}
          </p>
        </div>

        {hotel.brand && (
          <div className="bg-gray-50 rounded-2xl p-6">
            <h4 className="font-bold text-gray-900 mb-2">Thành viên của {hotel.brand.name}</h4>
            <p className="text-gray-600 leading-relaxed">{hotel.brand.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Thông tin lưu trú</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-3">
                <span className="w-24 font-medium text-gray-900">Nhận phòng:</span>
                <span>{hotel.publicSettings?.checkInTime || '14:00'}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-24 font-medium text-gray-900">Trả phòng:</span>
                <span>{hotel.publicSettings?.checkOutTime || '12:00'}</span>
              </li>
            </ul>
          </div>
          {hotel.numberOfFloors && (
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Kiến trúc</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">Số tầng:</span>
                  <span>{hotel.numberOfFloors} tầng</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-[var(--primary)] flex-shrink-0 mt-0.5" />
          <p className="text-[14px] text-gray-500 leading-tight">
            Để bảo vệ quyền lợi của bạn, vui lòng chỉ thực hiện giao dịch và liên lạc thông qua nền tảng Eatzy.
          </p>
        </div>

        {/* Images Grid */}
        {hotel.images && hotel.images.length > 1 && (
          <div className="pt-8">
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Hình ảnh nổi bật</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hotel.images.slice(1, 5).map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                  <ImageWithFallback src={img.imageUrl} alt={`${hotel.name} - ${idx + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

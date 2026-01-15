import { CalendarX, Key, Shield } from '@repo/ui/icons';
import type { HotelDetailDto } from "@repo/types";

interface Props {
  hotel: HotelDetailDto;
}

export function PoliciesTab({ hotel }: Props) {
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-[#1A1A1A]">Những điều cần biết</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          <Key className="w-6 h-6 text-gray-900 mb-1 flex-shrink-0" />
          <h4 className="font-semibold text-gray-900 text-lg">Nội quy nhà</h4>
          <div className="text-gray-600 text-[15px] space-y-2">
            <p>Nhận phòng sau <span className="font-medium text-gray-900">{hotel.publicSettings?.checkInTime || '14:00'}</span></p>
            <p>Trả phòng trước <span className="font-medium text-gray-900">{hotel.publicSettings?.checkOutTime || '12:00'}</span></p>
            <p>{hotel.publicSettings?.allowExtraBed ? '✔️ Hỗ trợ giường phụ' : '❌ Không hỗ trợ giường phụ'}</p>

            {hotel.publicSettings?.petPolicy && (
              <div className="pt-2 border-t border-gray-100 mt-2">
                <span className="font-medium text-gray-900 text-sm block mb-1">Thú cưng</span>
                <p className="text-sm">{hotel.publicSettings.petPolicy}</p>
              </div>
            )}

            {hotel.publicSettings?.smokingPolicy && (
              <div className="pt-2">
                <span className="font-medium text-gray-900 text-sm block mb-1">Hút thuốc</span>
                <p className="text-sm">{hotel.publicSettings.smokingPolicy}</p>
              </div>
            )}

            {hotel.publicSettings?.childPolicy && (
              <div className="pt-2 bg-gray-50 p-3 rounded-lg text-sm">
                <span className="font-medium text-gray-900 block mb-1">Trẻ em</span>
                {hotel.publicSettings.childPolicy}
              </div>
            )}
          </div>
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
}

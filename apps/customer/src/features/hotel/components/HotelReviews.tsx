import { useState } from "react";
import { Star, Sparkles, MessageSquare, Map, Tag } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";
import type { HotelDetailDto as Hotel } from "@repo/types";
import { ReviewsModal } from "./ReviewsModal";

interface HotelReviewsProps {
  hotel: Hotel;
}

export const HotelReviews = ({ hotel }: HotelReviewsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate average scores from recent reviews or default to mock values if empty
  const reviews = hotel.recentReviews || [];
  const reviewCount = reviews.length > 0 ? reviews.length : 1;

  const scores = reviews.reduce((acc, review) => ({
    cleanliness: acc.cleanliness + (review.cleanlinessRating || 5),
    service: acc.service + (review.serviceRating || 5),
    location: acc.location + (review.locationRating || 5),
    value: acc.value + (review.valueRating || 5),
  }), { cleanliness: 0, service: 0, location: 0, value: 0 });

  // Fallback to 5.0 if no reviews exist (mock behavior)
  const getAverage = (sum: number) => reviews.length > 0 ? sum / reviewCount : 5.0;

  const categories = [
    { label: "Mức độ sạch sẽ", score: getAverage(scores.cleanliness), icon: Sparkles },
    { label: "Dịch vụ", score: getAverage(scores.service), icon: MessageSquare },
    { label: "Vị trí", score: getAverage(scores.location), icon: Map },
    { label: "Giá trị", score: getAverage(scores.value), icon: Tag },
  ];

  const ratingDistribution = [
    { stars: 5, width: "100%" },
    { stars: 4, width: "0%" },
    { stars: 3, width: "0%" },
    { stars: 2, width: "0%" },
    { stars: 1, width: "0%" },
  ];

  return (
    <div className="space-y-12 py-8">
      {/* Hero Rating Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-8 mb-4">
          {/* Left decoration */}
          <span className="text-6xl">🏆</span>

          {/* Main Rating */}
          <div className="text-[120px] leading-none font-bold text-[#1A1A1A]">
            {(hotel.averageRating || hotel.starRating || 0).toFixed(2).replace('.', ',')}
          </div>

          {/* Right decoration */}
          <span className="text-6xl">🏆</span>
        </div>

        <h3 className="text-[26px] font-bold text-[#1A1A1A] mb-2">Được khách yêu thích</h3>
        <p className="text-gray-600 max-w-2xl mx-auto text-[15px] leading-relaxed">
          Trong số các chỗ ở cho thuê đủ điều kiện dựa trên điểm xếp hạng, lượt đánh giá và độ tin cậy, nhà này nằm trong <span className="font-bold text-gray-900">nhóm 10% chỗ ở hàng đầu</span>
        </p>
      </div>

      {/* Categories Grid with Rating Distribution */}
      <div className="border-t border-b border-gray-200 py-8">
        <div className="grid grid-cols-5 gap-x-8">
          {/* Left: Rating Distribution */}
          <div className="col-span-1 space-y-2 pr-4 border-r border-gray-200">
            <div className="font-semibold text-gray-900 text-sm mb-4">Xếp hạng tổng thể</div>
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-2 text-xs">
                <span className="text-gray-600 w-2">{item.stars}</span>
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-900 rounded-full" style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>

          {/* Right: Categories */}
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className={`space-y-3 text-center ${idx < categories.length - 1 ? 'border-r border-gray-200' : ''}`}
              >
                <div className="font-medium text-gray-900 text-sm">{cat.label}</div>
                <div className="text-lg font-semibold text-gray-900">{cat.score.toFixed(1).replace('.', ',')}</div>
                <div className="flex justify-center">
                  <Icon className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-2 gap-x-20 gap-y-12">
        {hotel.recentReviews?.slice(0, 6).map((review) => (
          <div key={review.id} className="space-y-4">
            {/* Author Info */}
            <div className="flex items-start gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                <ImageWithFallback
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.guestName}`}
                  alt={review.guestName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-base">{review.guestName}</div>
              </div>
            </div>

            {/* Rating & Date */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < review.rating ? 'fill-gray-900 text-gray-900' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-gray-400">·</span>
              <span className="text-gray-600">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>

            {/* Review Content */}
            <p className="text-gray-700 leading-relaxed text-[15px]">
              {review.comment}
            </p>

            <button onClick={() => setIsModalOpen(true)} className="font-semibold text-gray-900 underline decoration-gray-900 underline-offset-2 text-[15px] hover:decoration-2 transition-all">
              Hiển thị thêm
            </button>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center gap-4 pt-4">
        <button onClick={() => setIsModalOpen(true)} className="px-8 py-3 border border-gray-900 rounded-[8px] text-[16px] font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
          Hiển thị tất cả {hotel.reviewCount} đánh giá
        </button>
        <div className="text-gray-300"> </div>
        <button className="font-medium text-gray-500 underline decoration-gray-500 underline-offset-2 text-[15px] hover:text-gray-800 transition-colors">
          Quy trình đánh giá
        </button>
      </div>

      {/* Reviews Modal */}
      <ReviewsModal hotel={hotel} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

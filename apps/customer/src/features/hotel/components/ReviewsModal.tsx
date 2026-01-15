import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Search, Star, Sparkles, MessageSquare, Map, Tag, ChevronDown, CheckCircle2 } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";
import { motion, AnimatePresence } from "@repo/ui/motion";
import type { HotelDetailDto as Hotel } from "@repo/types";

interface ReviewsModalProps {
  hotel: Hotel;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewsModal = ({ hotel, isOpen, onClose }: ReviewsModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevant");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reviews = useMemo(() => hotel.recentReviews || [], [hotel.recentReviews]);

  const ratingDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (reviews.length > 0) {
      reviews.forEach(r => {
        const star = Math.floor(r.rating || 5) as 1 | 2 | 3 | 4 | 5;
        if (counts[star] !== undefined) counts[star]++;
      });
    }
    const total = reviews.length || 1;
    return [5, 4, 3, 2, 1].map(star => ({
      stars: star,
      count: counts[star as keyof typeof counts],
      percentage: (counts[star as keyof typeof counts] / total) * 100
    }));
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let result = reviews.filter(review =>
      ((review.comment?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (review.guestName?.toLowerCase() || "").includes(searchQuery.toLowerCase())) &&
      (selectedRating === null || Math.floor(review.rating) === selectedRating)
    );

    if (sortBy === 'highest') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'lowest') result.sort((a, b) => a.rating - b.rating);

    return result;
  }, [reviews, searchQuery, sortBy, selectedRating]);

  const scores = useMemo(() => reviews.reduce((acc, review) => ({
    cleanliness: acc.cleanliness + (review.cleanlinessRating || 5),
    service: acc.service + (review.serviceRating || 5),
    location: acc.location + (review.locationRating || 5),
    value: acc.value + (review.valueRating || 5),
  }), { cleanliness: 0, service: 0, location: 0, value: 0 }), [reviews]);

  const getAverage = (sum: number) => reviews.length > 0 ? sum / reviews.length : 5.0;

  const categories = [
    { label: "Mức độ sạch sẽ", score: getAverage(scores.cleanliness), icon: Sparkles },
    { label: "Dịch vụ", score: getAverage(scores.service), icon: MessageSquare },
    { label: "Vị trí", score: getAverage(scores.location), icon: Map },
    { label: "Giá trị", score: getAverage(scores.value), icon: Tag },
  ];

  const sortOptions = [
    { value: 'relevant', label: 'Phù hợp nhất' },
    { value: 'recent', label: 'Gần đây nhất' },
    { value: 'highest', label: 'Đánh giá cao nhất' },
    { value: 'lowest', label: 'Đánh giá thấp nhất' },
  ];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full Screen Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container - Centered with max-width */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-6 lg:p-8">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
              className="w-full max-w-[1050px] h-[90vh] bg-white rounded-[36px] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Fixed Header with Close Button */}
              <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-900" />
                </button>
                <div className="flex-1" />
              </div>

              {/* Two Column Layout with Independent Scrolling */}
              <div className="flex-1 flex overflow-hidden">

                {/* Left Column - Scrollable Stats */}
                <div className="w-[400px] flex-shrink-0 overflow-y-auto border-r border-gray-100 pr-8 px-16 py-8">
                  <div className="space-y-8">
                    {/* Hero Rating */}
                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <span className="text-4xl">🏆</span>
                        <div className="text-[80px] leading-none font-bold text-[#1A1A1A]">
                          {(hotel.averageRating || hotel.starRating || 0).toFixed(2).replace('.', ',')}
                        </div>
                        <span className="text-4xl">🏆</span>
                      </div>

                      <h3 className="text-[18px] font-bold text-[#1A1A1A]">Được khách yêu thích</h3>
                      <p className="text-gray-600 text-[13px] leading-relaxed">
                        Trong số các chỗ ở cho thuê đủ điều kiện dựa trên điểm xếp hạng, lượt đánh giá và độ tin cậy, nhà này nằm trong <span className="font-bold text-gray-900">nhóm 10% chỗ ở hàng đầu</span>
                      </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 text-sm">Xếp hạng tổng thể</h4>
                        {selectedRating !== null && (
                          <button
                            onClick={() => setSelectedRating(null)}
                            className="text-xs text-[var(--primary)] font-bold hover:underline"
                          >
                            Xóa lọc
                          </button>
                        )}
                      </div>
                      {ratingDistribution.map((item) => (
                        <div
                          key={item.stars}
                          className={`flex items-center gap-2.5 cursor-pointer p-1 rounded-lg transition-colors ${selectedRating === item.stars ? 'bg-gray-100 ring-1 ring-gray-200' : 'hover:bg-gray-50'}`}
                          onClick={() => setSelectedRating(selectedRating === item.stars ? null : item.stars)}
                        >
                          <span className={`text-xs w-2 ${selectedRating === item.stars ? 'text-[#1A1A1A] font-bold' : 'text-gray-600'}`}>{item.stars}</span>
                          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.percentage}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className={`h-full rounded-full ${selectedRating === item.stars ? 'bg-[var(--primary)]' : 'bg-gray-900'}`}
                            />
                          </div>
                          {selectedRating === item.stars && <CheckCircle2 className="w-3 h-3 text-[var(--primary)]" />}
                        </div>
                      ))}
                    </div>

                    {/* Categories */}
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <div key={cat.label} className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4 text-gray-700" strokeWidth={1.5} />
                              <span className="text-sm text-gray-900">{cat.label}</span>
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">{cat.score.toFixed(1).replace('.', ',')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column - Scrollable Reviews */}
                <div className="flex-1 overflow-y-auto pr-12 px-8 py-6">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        {hotel.reviewCount} lượt đánh giá
                      </h2>

                      <div className="relative">
                        <button
                          onClick={() => setIsSortOpen(!isSortOpen)}
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-gray-300 transition-colors text-gray-700 min-w-[160px] justify-between"
                        >
                          <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isSortOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-30 overflow-hidden"
                            >
                              {sortOptions.map(option => (
                                <button
                                  key={option.value}
                                  onClick={() => { setSortBy(option.value); setIsSortOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-[var(--primary)] font-bold bg-[var(--primary)]/5' : 'text-gray-700'
                                    }`}
                                >
                                  {option.label}
                                  {sortBy === option.value && <CheckCircle2 className="w-4 h-4" />}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm tất cả đánh giá"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none transition-colors text-sm"
                      />
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6 pt-2">
                      {filteredReviews.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 text-sm">
                          Không tìm thấy đánh giá nào
                        </div>
                      ) : (
                        filteredReviews.map((review) => (
                          <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-3 pb-6 border-b border-gray-100 last:border-0"
                          >
                            {/* Review Item */}
                            {/* Author Info */}
                            <div className="flex items-start gap-3">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                <ImageWithFallback
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.guestName}`}
                                  alt={review.guestName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-gray-900 text-sm">{review.guestName}</div>
                              </div>
                            </div>

                            {/* Rating & Date */}
                            <div className="flex items-center gap-2 text-xs">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-2.5 h-2.5 ${i < review.rating ? 'fill-gray-900 text-gray-900' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-gray-400">·</span>
                              <span className="text-gray-600">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>

                            {/* Review Content */}
                            <p className="text-gray-700 leading-relaxed text-[14px]">
                              {review.comment}
                            </p>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

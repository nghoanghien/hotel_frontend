import { useState } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { User, Star, Edit, MessageSquare, Clock } from "@repo/ui/icons";
import { formatDate } from "@repo/lib";
import type { BookingDetailDto } from "@repo/types";
import { ReviewForm } from "./ReviewForm";

interface BookingReviewsProps {
  booking: BookingDetailDto;
}

export function BookingReviews({ booking }: BookingReviewsProps) {
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewEditingData, setReviewEditingData] = useState<any>(null);

  const handleReviewSubmit = (data: any) => {
    console.log("Submit Review for booking:", booking?.id, data);
    // In real app: call API to submit review
    // For now just close functionality
    setIsEditingReview(false);
  };

  return (
    <motion.div
      key="reviews"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="h-full overflow-y-auto p-4 md:p-8 custom-scrollbar"
    >
      <div className={`${isEditingReview ? "max-w-4xl" : "max-w-2xl"} mx-auto space-y-8 transition-all duration-300 ease-in-out`}>
        <AnimatePresence mode="wait">
          {isEditingReview ? (
            <ReviewForm
              key="review-form"
              onCancel={() => setIsEditingReview(false)}
              onSubmit={handleReviewSubmit}
              initialData={reviewEditingData}
            />
          ) : booking?.review ? (
            <motion.div
              key="review-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm relative group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                      {/* Avatar Placeholder */}
                      <User className="w-full h-full p-2 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-bold text-[#1A1A1A] text-lg">{booking.review.guestName}</div>
                      <div className="text-xs text-gray-500">Reviewed on {formatDate(booking.review.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-[var(--primary)]/10 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 fill-[var(--primary)] text-[var(--primary)]" />
                    <span className="font-anton text-lg text-[var(--primary)] pt-0.5">{booking.review.rating}/5</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">"{booking.review.title}"</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {booking.review.comment}
                </p>

                {/* Sub Ratings */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                  {[
                    { label: 'Cleanliness', value: booking.review.cleanlinessRating },
                    { label: 'Service', value: booking.review.serviceRating },
                    { label: 'Location', value: booking.review.locationRating },
                    { label: 'Value', value: booking.review.valueRating },
                  ].map((rating, i) => rating.value && (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{rating.label}</span>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, s) => (
                            <div key={s} className={`w-1.5 h-1.5 rounded-full ${s < rating.value! ? 'bg-[var(--primary)]' : 'bg-gray-200'}`} />
                          ))}
                        </div>
                        <span className="text-xs font-bold ml-1">{rating.value}.0</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setReviewEditingData(booking.review);
                    setIsEditingReview(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Review</span>
                </button>
              </div>
            </motion.div>
          ) : (booking?.status === 'CheckedOut') ? (
            <motion.div
              key="review-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 px-4"
            >
              <div className="w-20 h-20 border-4 border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">How was your stay?</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Your feedback helps us improve and helps other travelers make better choices. Share your experience with us!
              </p>
              <button
                onClick={() => {
                  setReviewEditingData(null);
                  setIsEditingReview(true);
                }}
                className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-3 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-[var(--primary)]/20 hover:scale-105"
              >
                <Edit className="w-4 h-4" />
                Write a Review
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="review-unavailable"
              className="text-center py-12 px-4 opacity-60"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Review Unavailable</h3>
              <p className="text-sm text-gray-500">
                You can write a review after you have completed your stay.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { Star } from "@repo/ui/icons";
import { motion } from "@repo/ui/motion";
import { useSwipeConfirmation } from "@repo/ui/providers/SwipeConfirmationProvider";
import { useNotification } from "@repo/ui/providers/NotificationProvider";

interface ReviewFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function ReviewForm({
  onCancel,
  onSubmit,
  initialData,
}: ReviewFormProps) {
  // Hooks
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();

  // State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  // Sub-ratings
  const [cleanliness, setCleanliness] = useState(0);
  const [service, setService] = useState(0);
  const [location, setLocation] = useState(0);
  const [value, setValue] = useState(0);

  // Initialize
  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating || 0);
      setTitle(initialData.title || "");
      setComment(initialData.comment || "");
      setCleanliness(initialData.cleanlinessRating || 0);
      setService(initialData.serviceRating || 0);
      setLocation(initialData.locationRating || 0);
      setValue(initialData.valueRating || 0);
    } else {
      // Reset
      setRating(0);
      setTitle("");
      setComment("");
      setCleanliness(0);
      setService(0);
      setLocation(0);
      setValue(0);
    }
  }, [initialData]);

  // Derived State
  const isValid = useMemo(() => {
    return rating > 0 && title.trim().length > 0 && comment.trim().length > 0;
  }, [rating, title, comment]);

  const hasChanges = useMemo(() => {
    if (!initialData) return true; // New review = always has changes if valid
    return (
      rating !== initialData.rating ||
      title !== initialData.title ||
      comment !== initialData.comment ||
      cleanliness !== initialData.cleanlinessRating ||
      service !== initialData.serviceRating ||
      location !== initialData.locationRating ||
      value !== initialData.valueRating
    );
  }, [rating, title, comment, cleanliness, service, location, value, initialData]);

  const canSubmit = isValid && hasChanges;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      showNotification({ message: "Vui lòng nhập đầy đủ: Xếp hạng, Tiêu đề và Nội dung đánh giá.", type: "error", format: "Nhập đầy đủ thông tin trước khi gửi đánh giá nhé." });
      return;
    }

    if (!hasChanges && initialData) {
      showNotification({ message: "Bạn chưa thay đổi thông tin nào.", type: "error", format: "Bạn chưa thay đổi thông tin nào nhé." });
      return;
    }

    confirm({
      title: initialData ? "Cập nhật đánh giá?" : "Gửi đánh giá?",
      description: initialData
        ? "Bạn có chắc chắn muốn cập nhật đánh giá này không?"
        : "Đánh giá của bạn sẽ giúp ích cho những người khác.",
      confirmText: initialData ? "Vuốt để cập nhật" : "Vuốt để gửi",
      type: "update" as any,
      onConfirm: async () => {
        try {
          await onSubmit({
            rating,
            title,
            comment,
            cleanlinessRating: cleanliness,
            serviceRating: service,
            locationRating: location,
            valueRating: value,
          });
          showNotification({ message: initialData ? "Đánh giá đã được cập nhật!" : "Gửi đánh giá thành công!", type: "success", format: "Dữ liệu đánh giá đã lưu thành công." });
        } catch (error) {
          showNotification({ message: "Có lỗi xảy ra, vui lòng thử lại.", type: "error", format: "Dữ liệu đánh giá đã lưu thất bại." });
        }
      },
    });
  };

  const renderStars = (
    currentRating: number,
    setRatingFn: (r: number) => void,
    hoverRatingVal: number | null = null,
    setHoverRatingFn: ((r: number) => void) | null = null,
    size: string = "w-8 h-8"
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRatingFn(star)}
            onMouseEnter={() => setHoverRatingFn && setHoverRatingFn(star)}
            onMouseLeave={() => setHoverRatingFn && setHoverRatingFn(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`${size} transition-colors ${star <= (hoverRatingVal || currentRating)
                ? "fill-[var(--primary)] text-[var(--primary)]"
                : "text-gray-300"
                }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm"
    >
      <div className="mb-8 text-center md:text-left border-b border-gray-100 pb-6">
        <h3 className="text-3xl font-anton font-bold text-gray-900">
          {initialData ? "Edit Your Review" : "Write a Review"}
        </h3>
        <p className="text-gray-500 mt-2">Share your experience with us and help other travelers.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Left Column: Ratings */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-100 rounded-3xl p-8 text-center shadow-sm">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-4">
                Overall Experience
              </label>
              <div className="flex justify-center mb-4">
                {renderStars(rating, setRating, hoverRating, setHoverRating, "w-10 h-10")}
              </div>
              <div className="text-4xl font-anton text-[var(--primary)]">{rating || 0}<span className="text-gray-300 text-2xl">/5</span></div>
            </div>

            <div className="bg-gray-50 rounded-3xl p-6 space-y-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2">Detailed Ratings</p>
              {[
                { label: 'Cleanliness', val: cleanliness, set: setCleanliness },
                { label: 'Service', val: service, set: setService },
                { label: 'Location', val: location, set: setLocation },
                { label: 'Value', val: value, set: setValue },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-600 w-24">{item.label}</span>
                  {renderStars(item.val, item.set, null, null, "w-5 h-5")}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Inputs */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">Title of your review</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your stay (e.g., 'Wonderful trip!')"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all placeholder:text-gray-400 font-medium text-lg bg-gray-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">Share your experience</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={6}
                  placeholder="What did you like or dislike? How was the service?"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all placeholder:text-gray-400 font-medium bg-gray-50 focus:bg-white resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-[2] py-4 rounded-2xl font-bold transition-all text-lg shadow-lg
                     ${canSubmit
                    ? "bg-[var(--primary)] text-white hover:bg-opacity-90 active:scale-95 shadow-[var(--primary)]/20"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70 hover:bg-gray-200"
                  }
                `}
              >
                {initialData ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

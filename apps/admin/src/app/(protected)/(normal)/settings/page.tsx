'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { CreditCard, Edit2, Save, Percent } from '@repo/ui/icons';
import { useSwipeConfirmation, useLoading, useNotification } from '@repo/ui';

export default function SystemSettingsPage() {
  const { hide } = useLoading();
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();

  // State cho giá trị hiện tại
  const [serviceFee, setServiceFee] = useState(5); // % phí dịch vụ
  const [tax, setTax] = useState(10); // % thuế
  const [hotelCommission, setHotelCommission] = useState(15); // % hoa hồng khách sạn

  // State cho giá trị đang chỉnh sửa
  const [editedServiceFee, setEditedServiceFee] = useState(serviceFee);
  const [editedTax, setEditedTax] = useState(tax);
  const [editedHotelCommission, setEditedHotelCommission] = useState(hotelCommission);

  const [isEditing, setIsEditing] = useState(false);
  const editFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
    }, 1500);
    return () => clearTimeout(timer);
  }, [hide]);

  // Kiểm tra xem có thay đổi nào không
  const hasChanges = () => {
    return (
      editedServiceFee !== serviceFee ||
      editedTax !== tax ||
      editedHotelCommission !== hotelCommission
    );
  };

  // Xử lý lưu thay đổi
  const handleSave = () => {
    // Kiểm tra nếu không có thay đổi
    if (!hasChanges()) {
      showNotification({
        message: 'Không có thay đổi nào để lưu!',
        format: 'Vui lòng thay đổi ít nhất một thông số',
        type: 'error',
        autoHideDuration: 3000
      });
      return;
    }

    confirm({
      title: 'Xác nhận cập nhật thông số',
      description: 'Bạn có chắc chắn muốn thay đổi các thông số hệ thống này?',
      confirmText: 'Vuốt để xác nhận',
      type: 'warning',
      onConfirm: async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update values
        setServiceFee(editedServiceFee);
        setTax(editedTax);
        setHotelCommission(editedHotelCommission);
        setIsEditing(false);

        // Show success notification
        showNotification({
          message: 'Cập nhật thông số thành công!',
          format: 'Các thông số hệ thống đã được cập nhật',
          type: 'success',
          autoHideDuration: 4000
        });
      },
    });
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setEditedServiceFee(serviceFee);
    setEditedTax(tax);
    setEditedHotelCommission(hotelCommission);
    setIsEditing(false);
  };

  const cardMotion = {
    initial: { opacity: 0, y: 24, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.5, ease: 'easeOut' }
  };

  return (
    <div className="h-[calc(100vh-88px)] overflow-y-auto custom-scrollbar">
      <div className="container mx-auto p-4 md:p-8 max-w-3xl">
        <h2 className="text-3xl font-anton font-bold text-[#1A1A1A] mb-2 uppercase tracking-tight">
          Thông số hệ thống
        </h2>
        <p className="text-gray-500 mb-8">
          Quản lý các thông số hệ thống quan trọng, đảm bảo tuân thủ quy định và vận hành hiệu quả.
        </p>

        {/* Tổng quan */}
        <motion.div {...cardMotion} className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Phí dịch vụ */}
            <motion.div
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(var(--primary-rgb),0.10)' }}
              className="relative bg-white rounded-2xl p-6 flex items-center shadow-lg border border-gray-100"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div className="opacity-[0.05] text-[var(--primary)] transform scale-[2] translate-y-4 translate-x-20">
                  <CreditCard size={50} strokeWidth={3.2} />
                </div>
              </div>
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2, ease: 'easeInOut' }}
                className="mr-4 flex-shrink-0 z-10"
              >
                <CreditCard size={32} className="text-[var(--primary)]" strokeWidth={2} />
              </motion.span>
              <div className="z-10">
                <p className="text-sm text-gray-600 mb-1">Phí dịch vụ</p>
                <p className="text-3xl font-bold text-gray-800">
                  {serviceFee}%
                </p>
              </div>
            </motion.div>

            {/* Thuế */}
            <motion.div
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(var(--primary-rgb),0.10)' }}
              className="relative bg-white rounded-2xl p-6 flex items-center shadow-lg border border-gray-100"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div className="opacity-[0.05] text-[var(--primary)] transform scale-[2] translate-y-4 translate-x-20">
                  <Percent size={50} strokeWidth={3.2} />
                </div>
              </div>
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.2, ease: 'easeInOut' }}
                className="mr-4 flex-shrink-0 z-10"
              >
                <Percent size={32} className="text-[var(--primary)]" strokeWidth={2} />
              </motion.span>
              <div className="z-10">
                <p className="text-sm text-gray-600 mb-1">Thuế</p>
                <p className="text-3xl font-bold text-gray-800">
                  {tax}%
                </p>
              </div>
            </motion.div>

            {/* Hoa hồng khách sạn */}
            <motion.div
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(var(--primary-rgb),0.10)' }}
              className="relative bg-white rounded-2xl p-6 flex items-center shadow-lg border border-gray-100 sm:col-span-2"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div className="opacity-[0.05] text-[var(--primary)] transform scale-[2] translate-y-8 translate-x-20">
                  <CreditCard size={50} strokeWidth={3.2} />
                </div>
              </div>
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.4, ease: 'easeInOut' }}
                className="mr-4 flex-shrink-0 z-10"
              >
                <CreditCard size={32} className="text-[var(--primary)]" strokeWidth={2} />
              </motion.span>
              <div className="z-10">
                <p className="text-sm text-gray-600 mb-1">Hoa hồng khách sạn</p>
                <p className="text-3xl font-bold text-gray-800">
                  {hotelCommission}%
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Form chỉnh sửa */}
        <AnimatePresence mode="wait">
          {isEditing && (
            <motion.div
              ref={editFormRef}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0.0, 0.2, 1],
                scale: { duration: 0.3 }
              }}
              className="bg-gradient-to-br from-[var(--primary)]/5 to-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100"
            >
              <div className="space-y-6">
                {/* Phí dịch vụ */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <CreditCard size={18} className="text-[var(--primary)]" />
                    Phí dịch vụ (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={editedServiceFee}
                      onChange={e => setEditedServiceFee(Number(e.target.value))}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] text-base bg-white shadow-sm transition-all duration-200 font-medium text-gray-800"
                      placeholder="Nhập phí dịch vụ..."
                    />
                    <Percent size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Thuế */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Percent size={18} className="text-[var(--primary)]" />
                    Thuế (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={editedTax}
                      onChange={e => setEditedTax(Number(e.target.value))}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] text-base bg-white shadow-sm transition-all duration-200 font-medium text-gray-800"
                      placeholder="Nhập thuế..."
                    />
                    <Percent size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Hoa hồng khách sạn */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <CreditCard size={18} className="text-[var(--primary)]" />
                    Hoa hồng khách sạn (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={editedHotelCommission}
                      onChange={e => setEditedHotelCommission(Number(e.target.value))}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] text-base bg-white shadow-sm transition-all duration-200 font-medium text-gray-800"
                      placeholder="Nhập hoa hồng khách sạn..."
                    />
                    <Percent size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-8">
                <motion.button
                  whileHover={{ scale: 1.06, boxShadow: '0 0 12px rgba(0,0,0,0.08)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl shadow-sm hover:bg-gray-200 font-semibold tracking-wide transition-all"
                >
                  Hủy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08, boxShadow: '0 0 16px rgba(var(--primary-rgb),0.18)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSave}
                  className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl shadow-lg flex items-center font-semibold tracking-wide gap-2 transition-all"
                >
                  <motion.span
                    whileHover={{ rotate: -10 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="inline-flex"
                  >
                    <Save size={18} />
                  </motion.span>
                  Lưu thay đổi
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nút chỉnh sửa */}
        {!isEditing && (
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: '0 0 16px rgba(var(--primary-rgb),0.18)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setIsEditing(true);
                setTimeout(() => {
                  editFormRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                  });
                }, 100);
              }}
              className="px-8 py-3 rounded-xl bg-[var(--primary)] text-white flex items-center font-semibold tracking-wide gap-2 shadow-lg transition-all"
            >
              <motion.span
                whileHover={{ rotate: 10 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="inline-flex"
              >
                <Edit2 size={18} />
              </motion.span>
              Chỉnh sửa
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

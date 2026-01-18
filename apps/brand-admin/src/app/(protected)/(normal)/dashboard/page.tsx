'use client';

import { useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { useLoading } from '@repo/ui';
import { LayoutDashboard, Wrench } from '@repo/ui/icons';

export default function DashboardPage() {
  const { hide } = useLoading();

  // Tắt loading overlay khi dashboard mount (sau khi login thành công)
  useEffect(() => {
    hide();
  }, [hide]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", damping: 20 }}
        className="max-w-xl w-full"
      >
        {/* Main Card */}
        <div className="relative bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_60px_rgb(0,0,0,0.08)] overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-100/40 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 p-10 md:p-14 text-center">
            {/* Icon Container */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-200 mb-8"
            >
              <Wrench size={40} className="text-white" />
            </motion.div>

            {/* Text Content */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-anton uppercase text-gray-900 mb-4"
            >
              Đang tiến hành làm
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 font-medium text-lg mb-8 max-w-md mx-auto"
            >
              Trang Dashboard cho Brand Admin đang được phát triển.
              Vui lòng quay lại sau!
            </motion.p>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-50 border border-amber-200"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span className="text-amber-700 font-semibold text-sm uppercase tracking-wide">
                Đang phát triển
              </span>
            </motion.div>
          </div>
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400 text-sm">
            Bạn có thể truy cập các tính năng khác qua menu bên trái
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

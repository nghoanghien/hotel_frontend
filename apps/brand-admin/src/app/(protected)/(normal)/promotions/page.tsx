
'use client';
import { useState, useEffect } from 'react';
import { Plus } from '@repo/ui/icons';
import { useNotification, LoadingSpinner } from '@repo/ui';
import PromotionsTable from '@/features/promotions/components/PromotionsTable';
import CreatePromotionModal from '@/features/promotions/components/CreatePromotionModal';
import EditPromotionModal from '@/features/promotions/components/EditPromotionModal';
import { Promotion, PromotionStatus, promotionService } from '@/features/promotions/services/promotionService';

export default function PromotionsPage() {
  const { showNotification } = useNotification();
  const [data, setData] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await promotionService.getPromotions('brand-vinpearl');
      setData(result);
    } catch (error) {
      showNotification({ message: 'Failed to load campaigns', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await promotionService.deletePromotion(id);
      showNotification({ message: 'Campaign deleted successfully', type: 'success', format: "Chiến dịch đã được xóa thành công" });
      fetchData();
    } catch (error) {
      showNotification({ message: 'Failed to delete campaign', type: 'error', format: "Xóa chiến dịch thất bại" });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: PromotionStatus) => {
    try {
      if (currentStatus === PromotionStatus.Active) {
        await promotionService.pausePromotion(id);
        showNotification({ message: 'Campaign Paused', type: 'success', format: "Chiến dịch đã tạm dừng" });
      } else {
        await promotionService.activatePromotion(id);
        showNotification({ message: 'Campaign Activated', type: 'success', format: "Chiến dịch đã kích hoạt" });
      }
      fetchData();
    } catch (error) {
      showNotification({ message: 'Failed to update status', type: 'error' });
    }
  };

  const openEdit = (promo: Promotion) => {
    setSelectedPromotion(promo);
    setEditModalOpen(true);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Plus size={12} />
              Marketing Console
            </span>
          </div>
          <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
            Marketing Campaigns
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Manage discount codes, flash sales, and special offers across your hotel chain.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="h-12 px-6 rounded-2xl bg-[#1A1A1A] text-white hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200 active:scale-95"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span className="text-sm font-bold uppercase tracking-wide">Launch Campaign</span>
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        <PromotionsTable
          data={data}
          isLoading={isLoading}
          onRefresh={fetchData}
          onEdit={openEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      {/* Modals */}
      <CreatePromotionModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchData}
      />

      <EditPromotionModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        promotion={selectedPromotion}
        onSuccess={fetchData}
      />

    </div>
  );
}

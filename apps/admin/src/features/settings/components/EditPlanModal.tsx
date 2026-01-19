import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, Edit, Check } from '@repo/ui/icons';
import { SubscriptionPlanDto, SubscriptionPlanType, UpdateSubscriptionPlanDto } from '@repo/types';
import { subscriptionPlanService } from '../services/subscriptionPlanService';
import { LoadingSpinner, useNotification, InputField, NumberInput } from '@repo/ui';
import CustomSelect from './CustomSelect';

interface EditPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    plan: SubscriptionPlanDto | null;
}

export default function EditPlanModal({ isOpen, onClose, onSuccess, plan }: EditPlanModalProps) {
    const [formData, setFormData] = useState<UpdateSubscriptionPlanDto>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name,
                description: plan.description || '',
                monthlyPrice: plan.monthlyPrice,
                quarterlyPrice: plan.quarterlyPrice,
                yearlyPrice: plan.yearlyPrice,
                maxHotels: plan.maxHotels,
                maxRoomsPerHotel: plan.maxRoomsPerHotel,
                maxUsersPerHotel: plan.maxUsersPerHotel,
                commissionRate: plan.commissionRate,
                isActive: plan.isActive,
                isPopular: plan.isPopular,
                sortOrder: plan.sortOrder
            });
        }
    }, [plan]);

    const handleChange = (key: keyof UpdateSubscriptionPlanDto, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!plan || !formData.name) return;

        setIsSubmitting(true);
        try {
            const res = await subscriptionPlanService.updatePlan(plan.id, formData);
            if (res.success) {
                showNotification({ message: 'Subscription plan updated successfully', type: 'success' });
                onSuccess();
                onClose();
            }
        } catch (error) {
            showNotification({ message: 'Failed to update plan', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isValid = !!formData.name && formData.name.trim().length > 0;

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
                    />

                    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-[#F8F9FA] w-full max-w-3xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-white/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="px-8 py-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                        <Edit size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-anton text-[#1A1A1A] uppercase tracking-wide leading-none">
                                            Edit Subscription Plan
                                        </h3>
                                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">Modify subscription tier details</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                                <form id="edit-plan-form" onSubmit={handleSubmit} className="space-y-8">

                                    {/* Basic Info */}
                                    <section className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
                                        <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-4">
                                            <span className="text-xs font-black text-amber-600 uppercase tracking-widest">01. Basic Information</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputField
                                                label="Plan Name"
                                                required
                                                value={formData.name || ''}
                                                onChange={(e) => handleChange('name', e.target.value)}
                                                placeholder="e.g. Professional"
                                            />
                                            <div className="flex items-end gap-2 pb-1">
                                                <div className={`w-10 h-6 rounded-full transition-colors relative ${formData.isPopular ? 'bg-lime-500' : 'bg-gray-300'} cursor-pointer`} onClick={() => handleChange('isPopular', !formData.isPopular)}>
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isPopular ? 'left-5' : 'left-1'}`} />
                                                </div>
                                                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Popular Tier</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Description</label>
                                            <textarea
                                                rows={2}
                                                value={formData.description || ''}
                                                onChange={(e) => handleChange('description', e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:bg-white focus:border-lime-500 transition-all resize-none outline-none"
                                                placeholder="Describe what this plan is best for..."
                                            />
                                        </div>

                                        <div className="w-32">
                                            <NumberInput
                                                label="Sort Order"
                                                value={formData.sortOrder || 0}
                                                onChange={(val) => handleChange('sortOrder', val)}
                                            />
                                        </div>
                                    </section>

                                    {/* Pricing */}
                                    <section className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
                                        <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-4">
                                            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">02. Tier Pricing</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <NumberInput
                                                label="Monthly Price"
                                                value={formData.monthlyPrice || 0}
                                                onChange={(val) => handleChange('monthlyPrice', val)}
                                                min={0}
                                            />
                                            <NumberInput
                                                label="Quarterly Price"
                                                value={formData.quarterlyPrice || 0}
                                                onChange={(val) => handleChange('quarterlyPrice', val)}
                                                min={0}
                                            />
                                            <NumberInput
                                                label="Yearly Price"
                                                value={formData.yearlyPrice || 0}
                                                onChange={(val) => handleChange('yearlyPrice', val)}
                                                min={0}
                                            />
                                        </div>
                                    </section>

                                    {/* Limits */}
                                    <section className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
                                        <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-4">
                                            <span className="text-xs font-black text-purple-600 uppercase tracking-widest">03. Usage Limits & Rules</span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <NumberInput
                                                label="Max Hotels"
                                                value={formData.maxHotels || 0}
                                                onChange={(val) => handleChange('maxHotels', val)}
                                                min={1}
                                            />
                                            <NumberInput
                                                label="Max Rooms/KS"
                                                value={formData.maxRoomsPerHotel || 0}
                                                onChange={(val) => handleChange('maxRoomsPerHotel', val)}
                                                min={1}
                                            />
                                            <NumberInput
                                                label="Max Users/KS"
                                                value={formData.maxUsersPerHotel || 0}
                                                onChange={(val) => handleChange('maxUsersPerHotel', val)}
                                                min={1}
                                            />
                                            <NumberInput
                                                label="Commission (%)"
                                                value={formData.commissionRate || 0}
                                                onChange={(val) => handleChange('commissionRate', val)}
                                                min={0}
                                            />
                                        </div>
                                    </section>

                                </form>
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3 shrink-0">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-2xl bg-gray-50 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-all shadow-sm"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    form="edit-plan-form"
                                    className="px-8 py-3 rounded-2xl bg-[#1A1A1A] text-white font-bold text-sm hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none uppercase tracking-wide"
                                    disabled={isSubmitting || !isValid}
                                >
                                    {isSubmitting ? <LoadingSpinner size={16} color="white" /> : <Check size={18} strokeWidth={3} />}
                                    Save Changes
                                </button>
                            </div>

                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

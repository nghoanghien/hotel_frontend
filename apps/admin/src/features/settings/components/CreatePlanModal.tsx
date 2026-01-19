import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, Plus, Check } from '@repo/ui/icons';
import { CreateSubscriptionPlanDto, SubscriptionPlanType } from '@repo/types';
import { subscriptionPlanService } from '../services/subscriptionPlanService';
import { LoadingSpinner, useNotification, InputField, NumberInput, Button } from '@repo/ui';
import CustomSelect from './CustomSelect';

interface CreatePlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreatePlanModal({ isOpen, onClose, onSuccess }: CreatePlanModalProps) {
    const [formData, setFormData] = useState<CreateSubscriptionPlanDto>({
        name: '',
        description: '',
        planType: SubscriptionPlanType.Basic,
        monthlyPrice: 0,
        quarterlyPrice: 0,
        yearlyPrice: 0,
        currency: 'VND',
        maxHotels: 1,
        maxRoomsPerHotel: 20,
        maxUsersPerHotel: 3,
        commissionRate: 15,
        isPopular: false,
        sortOrder: 0
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showNotification } = useNotification();

    const handleChange = (key: keyof CreateSubscriptionPlanDto, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;

        setIsSubmitting(true);
        try {
            const res = await subscriptionPlanService.createPlan(formData);
            if (res.success) {
                showNotification({ message: 'Subscription plan created successfully', type: 'success' });
                onSuccess();
                onClose();
                // Reset form
                setFormData({
                    name: '',
                    description: '',
                    planType: SubscriptionPlanType.Basic,
                    monthlyPrice: 0,
                    quarterlyPrice: 0,
                    yearlyPrice: 0,
                    currency: 'VND',
                    maxHotels: 1,
                    maxRoomsPerHotel: 20,
                    maxUsersPerHotel: 3,
                    commissionRate: 15,
                    isPopular: false,
                    sortOrder: 0
                });
            }
        } catch (error) {
            showNotification({ message: 'Failed to create plan', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isValid = !!formData.name && formData.name.trim().length > 0 && formData.monthlyPrice >= 0;

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
                                    <div className="w-12 h-12 rounded-xl bg-lime-50 text-lime-600 flex items-center justify-center">
                                        <Plus size={24} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-anton text-[#1A1A1A] uppercase tracking-wide leading-none">
                                            Create Subscription Plan
                                        </h3>
                                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">Define a new service tier</p>
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
                                <form id="create-plan-form" onSubmit={handleSubmit} className="space-y-8">

                                    {/* Basic Info */}
                                    <section className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
                                        <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-4">
                                            <span className="text-xs font-black text-lime-600 uppercase tracking-widest">01. Basic Information</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputField
                                                label="Plan Name"
                                                required
                                                value={formData.name}
                                                onChange={(e) => handleChange('name', e.target.value)}
                                                placeholder="e.g. Professional"
                                            />
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Plan Type</label>
                                                <CustomSelect
                                                    value={formData.planType}
                                                    onChange={(val) => handleChange('planType', Number(val))}
                                                    options={[
                                                        { value: SubscriptionPlanType.Basic, label: 'Basic' },
                                                        { value: SubscriptionPlanType.Standard, label: 'Standard' },
                                                        { value: SubscriptionPlanType.Premium, label: 'Premium' },
                                                        { value: SubscriptionPlanType.Enterprise, label: 'Enterprise' },
                                                    ]}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Description</label>
                                            <textarea
                                                rows={2}
                                                value={formData.description}
                                                onChange={(e) => handleChange('description', e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:bg-white focus:border-lime-500 transition-all resize-none outline-none"
                                                placeholder="Describe what this plan is best for..."
                                            />
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleChange('isPopular', !formData.isPopular)}>
                                                <div className={`w-10 h-6 rounded-full transition-colors relative ${formData.isPopular ? 'bg-lime-500' : 'bg-gray-300'}`}>
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isPopular ? 'left-5' : 'left-1'}`} />
                                                </div>
                                                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Mark as Popular</span>
                                            </div>

                                            <div className="w-32">
                                                <NumberInput
                                                    label="Sort Order"
                                                    value={formData.sortOrder}
                                                    onChange={(val) => handleChange('sortOrder', val)}
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Pricing */}
                                    <section className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
                                        <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-4">
                                            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">02. Pricing Configuration</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <NumberInput
                                                label="Monthly Price"
                                                value={formData.monthlyPrice}
                                                onChange={(val) => handleChange('monthlyPrice', val)}
                                                min={0}
                                            />
                                            <NumberInput
                                                label="Quarterly Price"
                                                value={formData.quarterlyPrice}
                                                onChange={(val) => handleChange('quarterlyPrice', val)}
                                                min={0}
                                            />
                                            <NumberInput
                                                label="Yearly Price"
                                                value={formData.yearlyPrice}
                                                onChange={(val) => handleChange('yearlyPrice', val)}
                                                min={0}
                                            />
                                        </div>
                                        <div className="w-32">
                                            <InputField
                                                label="Currency"
                                                value={formData.currency}
                                                onChange={(e) => handleChange('currency', e.target.value)}
                                            />
                                        </div>
                                    </section>

                                    {/* Limits */}
                                    <section className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
                                        <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-4">
                                            <span className="text-xs font-black text-purple-600 uppercase tracking-widest">03. Usage Limits & Commission</span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <NumberInput
                                                label="Max Hotels"
                                                value={formData.maxHotels}
                                                onChange={(val) => handleChange('maxHotels', val)}
                                                min={1}
                                            />
                                            <NumberInput
                                                label="Max Rooms/KS"
                                                value={formData.maxRoomsPerHotel}
                                                onChange={(val) => handleChange('maxRoomsPerHotel', val)}
                                                min={1}
                                            />
                                            <NumberInput
                                                label="Max Users/KS"
                                                value={formData.maxUsersPerHotel}
                                                onChange={(val) => handleChange('maxUsersPerHotel', val)}
                                                min={1}
                                            />
                                            <NumberInput
                                                label="Commission (%)"
                                                value={formData.commissionRate}
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
                                    form="create-plan-form"
                                    className="px-8 py-3 rounded-2xl bg-[#1A1A1A] text-white font-bold text-sm hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none uppercase tracking-wide"
                                    disabled={isSubmitting || !isValid}
                                >
                                    {isSubmitting ? <LoadingSpinner size={16} color="white" /> : <Check size={18} strokeWidth={3} />}
                                    Create Plan
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

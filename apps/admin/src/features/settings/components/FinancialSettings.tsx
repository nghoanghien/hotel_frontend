import { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { NumberInput, Button, useNotification, CustomSelect, InputField } from '@repo/ui';
import { CreditCard, Receipt, Percent } from '@repo/ui/icons';
import { HotelDetailDto, UpdateHotelDto } from '@repo/types';
import { systemSettingsService } from '../services/systemSettingsService';

interface FinancialSettingsProps {
    hotelId: string;
}

export default function FinancialSettings({ hotelId }: FinancialSettingsProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<HotelDetailDto | null>(null);
    const { showNotification } = useNotification();

    // Form State
    const [form, setForm] = useState({
        enableStripePayment: false,
        enablePayAtHotel: true,
        stripeAccountId: '',
        taxRate: 10,
        serviceFeeRate: 5,
    });

    useEffect(() => {
        loadSettings();
    }, [hotelId]);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const res = await systemSettingsService.getHotelSettings(hotelId);
            if (res.success && res.data) {
                setData(res.data);
                const settings = res.data.settings;
                setForm({
                    enableStripePayment: settings.enableStripePayment,
                    enablePayAtHotel: settings.enablePayAtHotel,
                    stripeAccountId: settings.stripeAccountId || '',
                    taxRate: settings.taxRate,
                    serviceFeeRate: settings.serviceFeeRate,
                });
            }
        } catch (e) {
            showNotification({ message: 'Failed to load financial settings', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const updateData: UpdateHotelDto = {
                ...form
            };
            const res = await systemSettingsService.updateHotelSettings(hotelId, updateData);
            if (res.success) {
                showNotification({ message: 'Financial settings updated successfully', type: 'success' });
            }
        } catch (e) {
            showNotification({ message: 'Failed to update settings', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Payment Configuration */}
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-anton uppercase tracking-tight text-gray-900">Payment Gateway</h3>
                            <p className="text-xs font-medium text-gray-400">Configure how guests pay for bookings</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div>
                                <span className="text-sm font-bold text-gray-900 block">Stripe Online Payment</span>
                                <span className="text-[11px] text-gray-400">Accept Credit Cards & Digital Wallets</span>
                            </div>
                            <button
                                onClick={() => setForm(prev => ({ ...prev, enableStripePayment: !prev.enableStripePayment }))}
                                className={`w-12 h-6 rounded-full transition-colors relative ${form.enableStripePayment ? 'bg-lime-500' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.enableStripePayment ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div>
                                <span className="text-sm font-bold text-gray-900 block">Pay at Hotel</span>
                                <span className="text-[11px] text-gray-400">Allow guests to pay upon arrival</span>
                            </div>
                            <button
                                onClick={() => setForm(prev => ({ ...prev, enablePayAtHotel: !prev.enablePayAtHotel }))}
                                className={`w-12 h-6 rounded-full transition-colors relative ${form.enablePayAtHotel ? 'bg-lime-500' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.enablePayAtHotel ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        {form.enableStripePayment && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                <InputField
                                    label="Stripe Connected Account ID"
                                    placeholder="acct_..."
                                    value={form.stripeAccountId}
                                    onChange={(e) => setForm(prev => ({ ...prev, stripeAccountId: e.target.value }))}
                                />
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Tax & Fees */}
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Receipt size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-anton uppercase tracking-tight text-gray-900">Tax & Service Fees</h3>
                            <p className="text-xs font-medium text-gray-400">Global tax rates and platform commissions</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">VAT / Tax Rate (%)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={form.taxRate}
                                    onChange={(e) => setForm(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-lime-200 outline-none"
                                />
                                <Percent size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Service Fee (%)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={form.serviceFeeRate}
                                    onChange={(e) => setForm(prev => ({ ...prev, serviceFeeRate: Number(e.target.value) }))}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-lime-200 outline-none"
                                />
                                <Percent size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-lime-50 rounded-2xl border border-lime-100">
                        <p className="text-[11px] font-medium text-lime-800 leading-relaxed">
                            <span className="font-bold">Note:</span> These rates will be applied to all room bookings automatically. Users will see a breakdown of base price, taxes, and fees at checkout.
                        </p>
                    </div>
                </section>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    onClick={handleSave}
                    loading={saving}
                    className="h-14 px-10 rounded-2xl bg-[#1A1A1A] text-white hover:bg-black font-anton uppercase tracking-wider text-lg shadow-xl shadow-gray-200"
                >
                    Save Financials
                </Button>
            </div>
        </motion.div>
    );
}

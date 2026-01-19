import { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { Button, useNotification } from '@repo/ui';
import { ShieldCheck, Info } from '@repo/ui/icons';
import { HotelDetailDto, UpdateHotelDto } from '@repo/types';
import { systemSettingsService } from '../services/systemSettingsService';

interface PolicySettingsProps {
    hotelId: string;
}

export default function PolicySettings({ hotelId }: PolicySettingsProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<HotelDetailDto | null>(null);
    const { showNotification } = useNotification();

    // Form State
    const [form, setForm] = useState({
        cancellationPolicy: '',
        childPolicy: '',
        petPolicy: '',
        smokingPolicy: '',
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
                    cancellationPolicy: settings.cancellationPolicy || '',
                    childPolicy: settings.childPolicy || '',
                    petPolicy: settings.petPolicy || '',
                    smokingPolicy: settings.smokingPolicy || '',
                });
            }
        } catch (e) {
            showNotification({ message: 'Failed to load policies', type: 'error' });
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
                showNotification({ message: 'Policies updated successfully', type: 'success' });
            }
        } catch (e) {
            showNotification({ message: 'Failed to update policies', type: 'error' });
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
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-anton uppercase tracking-tight text-gray-900">Property Policies</h3>
                        <p className="text-xs font-medium text-gray-400">Define your hotel's rules and regulations</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Cancellation Policy */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Cancellation Policy</label>
                        <textarea
                            value={form.cancellationPolicy}
                            onChange={(e) => setForm(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
                            placeholder="e.g. Free cancellation until 24 hours before check-in..."
                            className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:ring-2 focus:ring-lime-200 outline-none resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Child Policy */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Child Policy</label>
                            <textarea
                                value={form.childPolicy}
                                onChange={(e) => setForm(prev => ({ ...prev, childPolicy: e.target.value }))}
                                placeholder="e.g. Children under 12 stay free using existing bedding..."
                                className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:ring-2 focus:ring-lime-200 outline-none resize-none"
                            />
                        </div>

                        {/* Pet Policy */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Pet Policy</label>
                            <textarea
                                value={form.petPolicy}
                                onChange={(e) => setForm(prev => ({ ...prev, petPolicy: e.target.value }))}
                                placeholder="e.g. Pets are welcome with a daily surcharge of $20..."
                                className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:ring-2 focus:ring-lime-200 outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Smoking Policy */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Smoking Policy</label>
                        <textarea
                            value={form.smokingPolicy}
                            onChange={(e) => setForm(prev => ({ ...prev, smokingPolicy: e.target.value }))}
                            placeholder="e.g. Non-smoking hotel. Designated smoking areas available outdoors..."
                            className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:ring-2 focus:ring-lime-200 outline-none resize-none"
                        />
                    </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                    <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium text-blue-800 leading-relaxed">
                        These policies will be displayed to guests during the booking process and on their confirmation emails. Clear and concise policies help set expectations and reduce disputes.
                    </p>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    onClick={handleSave}
                    loading={saving}
                    className="h-14 px-10 rounded-2xl bg-[#1A1A1A] text-white hover:bg-black font-anton uppercase tracking-wider text-lg shadow-xl shadow-gray-200"
                >
                    Save Policies
                </Button>
            </div>
        </motion.div>
    );
}

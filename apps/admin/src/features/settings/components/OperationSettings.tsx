import { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { InputField, NumberInput, Button, useNotification } from '@repo/ui';
import { Clock, Users, Calendar } from '@repo/ui/icons';
import { HotelDetailDto, UpdateHotelDto } from '@repo/types';
import { systemSettingsService } from '../services/systemSettingsService';

interface OperationSettingsProps {
    hotelId: string;
}

export default function OperationSettings({ hotelId }: OperationSettingsProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<HotelDetailDto | null>(null);
    const { showNotification } = useNotification();

    // Form State
    const [form, setForm] = useState({
        checkInTime: '',
        checkOutTime: '',
        maxAdultsPerRoom: 2,
        maxChildrenPerRoom: 1,
        maxGuestsPerRoom: 3,
        minNights: 1,
        maxNights: 30,
        minAdvanceBookingHours: 0,
        maxAdvanceBookingDays: 365,
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
                    checkInTime: settings.checkInTime || '14:00',
                    checkOutTime: settings.checkOutTime || '12:00',
                    maxAdultsPerRoom: settings.maxAdultsPerRoom,
                    maxChildrenPerRoom: settings.maxChildrenPerRoom,
                    maxGuestsPerRoom: settings.maxGuestsPerRoom,
                    minNights: settings.minNights,
                    maxNights: settings.maxNights,
                    minAdvanceBookingHours: settings.minAdvanceBookingHours,
                    maxAdvanceBookingDays: settings.maxAdvanceBookingDays,
                });
            }
        } catch (e) {
            showNotification({ message: 'Failed to load operation settings', type: 'error' });
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
                showNotification({ message: 'Operation settings updated successfully', type: 'success' });
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

                {/* Time Configuration */}
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-anton uppercase tracking-tight text-gray-900">Time Configuration</h3>
                            <p className="text-xs font-medium text-gray-400">Standard check-in and check-out schedule</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Standard Check-in"
                            type="time"
                            value={form.checkInTime}
                            onChange={(e) => setForm(prev => ({ ...prev, checkInTime: e.target.value }))}
                        />
                        <InputField
                            label="Standard Check-out"
                            type="time"
                            value={form.checkOutTime}
                            onChange={(e) => setForm(prev => ({ ...prev, checkOutTime: e.target.value }))}
                        />
                    </div>
                </section>

                {/* Guest Limits */}
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                            <Users size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-anton uppercase tracking-tight text-gray-900">Guest Capacity</h3>
                            <p className="text-xs font-medium text-gray-400">Default occupancy limits per room</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <NumberInput
                            label="Max Adults"
                            value={form.maxAdultsPerRoom}
                            onChange={(val) => setForm(prev => ({ ...prev, maxAdultsPerRoom: Number(val) }))}
                            min={1}
                        />
                        <NumberInput
                            label="Max Children"
                            value={form.maxChildrenPerRoom}
                            onChange={(val) => setForm(prev => ({ ...prev, maxChildrenPerRoom: Number(val) }))}
                            min={0}
                        />
                        <NumberInput
                            label="Total Guests"
                            value={form.maxGuestsPerRoom}
                            onChange={(val) => setForm(prev => ({ ...prev, maxGuestsPerRoom: Number(val) }))}
                            min={1}
                        />
                    </div>
                </section>

                {/* Booking Rules */}
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6 lg:col-span-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-anton uppercase tracking-tight text-gray-900">Booking Rules</h3>
                            <p className="text-xs font-medium text-gray-400">Reservation constraints and advance booking</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <NumberInput
                            label="Min Nights"
                            value={form.minNights}
                            onChange={(val) => setForm(prev => ({ ...prev, minNights: Number(val) }))}
                            min={1}
                        />
                        <NumberInput
                            label="Max Nights"
                            value={form.maxNights}
                            onChange={(val) => setForm(prev => ({ ...prev, maxNights: Number(val) }))}
                            min={1}
                        />
                        <NumberInput
                            label="Min Advance (Hrs)"
                            value={form.minAdvanceBookingHours}
                            onChange={(val) => setForm(prev => ({ ...prev, minAdvanceBookingHours: Number(val) }))}
                            min={0}
                        />
                        <NumberInput
                            label="Max Advance (Days)"
                            value={form.maxAdvanceBookingDays}
                            onChange={(val) => setForm(prev => ({ ...prev, maxAdvanceBookingDays: Number(val) }))}
                            min={1}
                        />
                    </div>
                </section>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    onClick={handleSave}
                    loading={saving}
                    className="h-14 px-10 rounded-2xl bg-[#1A1A1A] text-white hover:bg-black font-anton uppercase tracking-wider text-lg shadow-xl shadow-gray-200"
                >
                    Save Changes
                </Button>
            </div>
        </motion.div>
    );
}

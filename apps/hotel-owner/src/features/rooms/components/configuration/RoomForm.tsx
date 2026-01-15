import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { CreateRoomDto, RoomType, BedType, RoomDto } from '@repo/types';
import { InputField, CustomSelect, LoadingSpinner, useNotification } from '@repo/ui';
import Switch from './Switch';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, Save, ArrowRight, ArrowLeft } from '@repo/ui/icons';
import { roomConfigService } from '../../services/roomConfigService';

interface RoomFormProps {
  initialData?: RoomDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

// CustomSelect expects string[], so we map values back and forth if needed
const ROOM_TYPES: string[] = [
  'Standard', 'Deluxe', 'Suite', 'Family', 'Presidential', 'Dormitory', 'Studio', 'Penthouse'
];

const BED_TYPES: string[] = [
  'Single', 'Double', 'Queen', 'King', 'Twin', 'Bunk', 'SofaBed'
];

export default function RoomForm({ initialData, onClose, onSuccess }: RoomFormProps) {
  const { register, control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CreateRoomDto>({
    defaultValues: {
      roomNumber: '',
      floor: '',
      type: 'Standard',
      bedType: 'Queen',
      numberOfBeds: 1,
      maxOccupancy: 2,
      basePrice: 0,
      weekendPrice: 0,
      holidayPrice: 0,
      sizeInSquareMeters: 25,
      description: '',
      hasView: false,
      viewDescription: '',
      smokingAllowed: false,
      isPetFriendly: false,
      hasConnectingRoom: false,
      isAccessible: false,
      amenityIds: [],
      hotelId: 'hotel-1'
    }
  });

  const { showNotification } = useNotification();
  const [step, setStep] = React.useState(1);

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        // Map types safely
        type: initialData.type as RoomType,
        bedType: initialData.bedType as BedType,
        amenityIds: []
      });
    }
  }, [initialData, reset]);


  const onSubmit = async (data: CreateRoomDto) => {
    try {
      if (initialData) {
        await roomConfigService.updateRoom(initialData.id, data);
        showNotification({ message: 'Room configuration updated successfully!', type: 'success' });
      } else {
        await roomConfigService.createRoom(data);
        showNotification({ message: 'New room created successfully!', type: 'success' });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      showNotification({ message: 'Failed to save room configuration.', type: 'error' });
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
        <div>
          <h2 className="text-2xl font-anton font-bold text-[#1A1A1A]">
            {initialData ? `Edit Room ${initialData.roomNumber}` : 'New Room Configuration'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {initialData ? 'Update room details and pricing' : 'Set up a new room for your hotel'}
          </p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= 1 ? 'bg-[#1A1A1A]' : 'bg-gray-100'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-[#1A1A1A]' : 'bg-gray-100'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= 3 ? 'bg-[#1A1A1A]' : 'bg-gray-100'}`} />
        </div>

        <form id="room-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode='wait'>
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#1A1A1A] pl-3">Basic Information</h3>

                <div className="grid grid-cols-2 gap-6">
                  <InputField
                    label="Room Number"
                    placeholder="e.g. 101"
                    {...register('roomNumber', { required: 'Room number is required' })}
                    error={errors.roomNumber?.message}
                  />
                  <InputField
                    label="Floor"
                    placeholder="e.g. 1"
                    {...register('floor', { required: 'Floor is required' })}
                    error={errors.floor?.message}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }: any) => (
                      <CustomSelect
                        label="Room Type"
                        options={ROOM_TYPES}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select type"
                        error={errors.type?.message}
                      />
                    )}
                  />
                  <InputField
                    label="Size (m²)"
                    type="number"
                    placeholder="e.g. 25"
                    {...register('sizeInSquareMeters', { valueAsNumber: true, min: 1 })}
                  />
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-bold text-gray-900 border-l-4 border-gray-400 pl-3 mb-4">Pricing (VND)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField
                      label="Base Price / Night"
                      type="number"
                      {...register('basePrice', { valueAsNumber: true, required: 'Base price is required' })}
                      error={errors.basePrice?.message}
                    />
                    <InputField
                      label="Weekend Price"
                      type="number"
                      {...register('weekendPrice', { valueAsNumber: true })}
                    />
                    <InputField
                      label="Holiday Price"
                      type="number"
                      {...register('holidayPrice', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#1A1A1A] pl-3">Capacity & View</h3>

                <div className="grid grid-cols-2 gap-6">
                  <Controller
                    name="bedType"
                    control={control}
                    render={({ field }: any) => (
                      <CustomSelect
                        label="Bed Type"
                        options={BED_TYPES}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select bed type"
                      />
                    )}
                  />
                  <InputField
                    label="Number of Beds"
                    type="number"
                    {...register('numberOfBeds', { valueAsNumber: true, min: 1 })}
                  />
                  <InputField
                    label="Max Occupancy"
                    type="number"
                    {...register('maxOccupancy', { valueAsNumber: true, min: 1 })}
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4">
                    <Controller
                      name="hasView"
                      control={control}
                      render={({ field }: any) => (
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                          label="Has Specific View?"
                        />
                      )}
                    />
                  </div>
                  <InputField
                    label="View Description"
                    placeholder="e.g. Ocean View, City Skyline"
                    {...register('viewDescription')}
                  />
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-bold text-gray-900 border-l-4 border-gray-400 pl-3 mb-4">Description</h3>
                  <textarea
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl min-h-[120px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all font-medium text-gray-700"
                    placeholder="Describe the room features and ambience..."
                    {...register('description')}
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#1A1A1A] pl-3">Features & Policies</h3>

                <div className="grid grid-cols-1 gap-1">
                  <Controller
                    name="smokingAllowed"
                    control={control}
                    render={({ field }: any) => (
                      <Switch checked={field.value} onChange={field.onChange} label="Smoking Allowed" description="Allow guests to smoke in this room." />
                    )}
                  />
                  <div className="h-px bg-gray-50 my-1" />
                  <Controller
                    name="isPetFriendly"
                    control={control}
                    render={({ field }: any) => (
                      <Switch checked={field.value} onChange={field.onChange} label="Pet Friendly" description="Allow pets to stay in this room." />
                    )}
                  />
                  <div className="h-px bg-gray-50 my-1" />
                  <Controller
                    name="isAccessible"
                    control={control}
                    render={({ field }: any) => (
                      <Switch checked={field.value} onChange={field.onChange} label="Wheelchair Accessible" description="Room meets accessibility standards." />
                    )}
                  />
                  <div className="h-px bg-gray-50 my-1" />
                  <Controller
                    name="hasConnectingRoom"
                    control={control}
                    render={({ field }: any) => (
                      <Switch checked={field.value} onChange={field.onChange} label="Has Connecting Room" description="Room connects to an adjacent room." />
                    )}
                  />
                </div>

                <div className="pt-8">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Amenities</h4>
                  <div className="p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center text-gray-400">
                    Amenity selection UI will go here (requires Amenity List API)
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-white shrink-0">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="flex gap-4">
          {step < 3 ? (
            <button
              onClick={nextStep}
              className="px-8 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200"
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-[#1A1A1A] text-white font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200 disabled:opacity-70"
            >
              {isSubmitting ? <LoadingSpinner size={20} color="white" /> : <><Save size={18} /> Save Configuration</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

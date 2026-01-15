import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Check } from '@repo/ui/icons';
import { RoomType } from '@repo/types';

export interface RoomConfigFilterFields {
  type: string[];
  bedType: string[];
  priceRange: { min: number | null; max: number | null };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filterFields: RoomConfigFilterFields;
  onApply: (fields: RoomConfigFilterFields) => void;
}

const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Family', 'Presidential', 'Dormitory', 'Studio', 'Penthouse'];
const BED_TYPES = ['Single', 'Double', 'Queen', 'King', 'Twin', 'Bunk', 'SofaBed'];

export default function RoomConfigFilterModal({ isOpen, onClose, filterFields, onApply }: Props) {
  const [localFields, setLocalFields] = useState<RoomConfigFilterFields>(filterFields);

  useEffect(() => {
    setLocalFields(filterFields);
  }, [filterFields, isOpen]);

  const handleApply = () => {
    onApply(localFields);
    onClose();
  };

  const toggleType = (type: string) => {
    setLocalFields(prev => ({
      ...prev,
      type: prev.type.includes(type) ? prev.type.filter(t => t !== type) : [...prev.type, type]
    }));
  };

  const toggleBedType = (type: string) => {
    setLocalFields(prev => ({
      ...prev,
      bedType: prev.bedType.includes(type) ? prev.bedType.filter(t => t !== type) : [...prev.bedType, type]
    }));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title as="h3" className="text-xl font-anton font-bold text-gray-900 uppercase">
                Filter Configuration
              </Dialog.Title>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              {/* Room Types */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Room Type</label>
                <div className="flex flex-wrap gap-2">
                  {ROOM_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${localFields.type.includes(type)
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bed Types */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Bed Type</label>
                <div className="flex flex-wrap gap-2">
                  {BED_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => toggleBedType(type)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${localFields.bedType.includes(type)
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setLocalFields({ type: [], bedType: [], priceRange: { min: null, max: null } })}
                className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-[2] py-3 bg-[#1A1A1A] text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Check size={18} /> Apply Filters
              </button>
            </div>

          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}

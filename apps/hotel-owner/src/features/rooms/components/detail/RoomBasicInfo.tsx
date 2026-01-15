import React from 'react';
import { RoomDetailDto } from '@repo/types';
import {
  Users, Ruler, Monitor, DollarSign, CloudRain,
  Wind, Lock, CheckCircle, BedDouble, Layers,
  MapPin, AlertCircle
} from '@repo/ui/icons';

interface RoomBasicInfoProps {
  room: RoomDetailDto;
}

export default function RoomBasicInfo({ room }: RoomBasicInfoProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{room.roomNumber} - {room.type}</h3>
          <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
            <Layers size={14} />
            <span>Floor {room.floor}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full mx-1" />
            <MapPin size={14} />
            <span>{room.viewDescription || 'Standard View'}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(room.basePrice)}</div>
          <p className="text-xs text-gray-500">per night</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InfoCard
          icon={<Users size={18} />}
          label="Capacity"
          value={`${room.maxOccupancy} Guests`}
          subValue={room.maxOccupancy > 2 ? 'Extra beds available' : undefined}
        />
        <InfoCard
          icon={<Ruler size={18} />}
          label="Size"
          value={`${room.sizeInSquareMeters} m²`}
        />
        <InfoCard
          icon={<BedDouble size={18} />}
          label="Bed Type"
          value={room.bedType}
          subValue={`x${room.numberOfBeds}`}
        />
        <InfoCard
          icon={<AlertCircle size={18} />}
          label="Policies"
          value={room.smokingAllowed ? 'Smoking Allowed' : 'Non-Smoking'}
          subValue={room.isPetFriendly ? 'Pet Friendly' : 'No Pets'}
        />
      </div>

      {room.description && (
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <h4 className="text-sm font-bold text-gray-900 mb-2">Description</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{room.description}</p>
        </div>
      )}
    </div>
  );
}

const InfoCard = ({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue?: string }) => (
  <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center gap-3">
    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
      {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
    </div>
  </div>
);

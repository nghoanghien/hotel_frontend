import { HotelDetailDto } from '@repo/types';
import { Clock, Ban, Baby, PawPrint, Cigarette, Info } from 'lucide-react';

interface Props {
  hotel: HotelDetailDto;
}

export default function HotelPolicies({ hotel }: Props) {
  const { publicSettings } = hotel;

  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-full flex flex-col">
      <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] mb-6 uppercase">Hotel Policies</h3>

      <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {/* Check-in / Check-out */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 text-[#1A1A1A] shadow-sm">
            <Clock size={24} />
          </div>
          <div className="flex-1 flex justify-between items-center px-2">
            <div>
              <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">Check-in</div>
              <div className="text-xl font-bold text-[#1A1A1A]">{publicSettings.checkInTime}</div>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">Check-out</div>
              <div className="text-xl font-bold text-[#1A1A1A]">{publicSettings.checkOutTime}</div>
            </div>
          </div>
        </div>

        {/* Other Policies List */}
        <div className="space-y-4">
          {/* Cancellation */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Info size={16} />
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-sm mb-1">Cancellation</h5>
              <p className="text-sm text-gray-500 leading-relaxed">{publicSettings.cancellationPolicy || 'Standard cancellation policy applies.'}</p>
            </div>
          </div>

          {/* Children */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Baby size={16} />
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-sm mb-1">Children & Extra Beds</h5>
              <p className="text-sm text-gray-500 leading-relaxed">{publicSettings.childPolicy || 'Children of all ages are welcome.'}</p>
            </div>
          </div>

          {/* Pets */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <PawPrint size={16} />
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-sm mb-1">Pets</h5>
              <p className="text-sm text-gray-500 leading-relaxed">{publicSettings.petPolicy || 'Pets are not allowed.'}</p>
            </div>
          </div>

          {/* Smoking */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cigarette size={16} />
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-sm mb-1">Smoking</h5>
              <p className="text-sm text-gray-500 leading-relaxed">{publicSettings.smokingPolicy || 'No smoking in rooms.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import RoomOperationsTable from '@/features/rooms/components/RoomOperationsTable';
import { Hotel, useLoading } from '@repo/ui';

export default function RoomsPage() {
  const { hide } = useLoading();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    hide();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [hide]);

  if (isLoading) {
    return <div className="min-h-screen bg-transparent" />;
  }

  return (
    <div className="min-h-screen pb-20 px-6 pt-8 w-full max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Hotel size={12} />
            Room List
          </span>
        </div>
        <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
          Room Operations
        </h1>
        <p className="text-gray-500 font-medium mt-1">Manage room status, availability and maintenance.</p>
      </div>

      {/* Main Table Content - Full Width */}
      <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <RoomOperationsTable />
      </div>
    </div>
  );
}

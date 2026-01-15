import { motion } from '@repo/ui/motion';
import { useEffect, useState, useRef } from 'react';
import type { HotelSearchResult } from '../hooks/useSearch';
import MagazineLayout1 from './layouts/MagazineLayout1';
import MagazineLayout2 from './layouts/MagazineLayout2';
import MagazineLayout3 from './layouts/MagazineLayout3';
import MagazineLayout4 from './layouts/MagazineLayout4';
import { MagazineLayout1Shimmer, Skeleton } from '@repo/ui';

import { useRouter, useSearchParams } from 'next/navigation';
import { useLoading } from '@repo/ui';

interface Props {
  results: HotelSearchResult[];
  searchQuery: string;
  isLoading?: boolean;
}

export default function SearchResults({ results, searchQuery, isLoading = false }: Props) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { show } = useLoading();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsHeaderVisible(false);
          } else if (currentScrollY < lastScrollY.current) {
            setIsHeaderVisible(true);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Notify parent about scroll state
  useEffect(() => {
    // Dispatch custom event for header visibility
    window.dispatchEvent(new CustomEvent('searchHeaderVisibility', {
      detail: { visible: isHeaderVisible }
    }));
  }, [isHeaderVisible]);

  const handleNavigate = (hotelId: string) => {
    show('Loading hotel details...');
    const currentParams = new URLSearchParams(searchParams.toString());
    router.push(`/hotels/${hotelId}?${currentParams.toString()}`);
  };

  const renderLayout = (item: HotelSearchResult) => {
    const { hotel, layoutType } = item;
    const props = {
      hotel,
      onClick: () => handleNavigate(hotel.id)
    };

    switch (layoutType) {
      case 1:
        return <MagazineLayout1 key={hotel.id} {...props} />;
      case 2:
        return <MagazineLayout2 key={hotel.id} {...props} />;
      case 3:
        return <MagazineLayout3 key={hotel.id} {...props} />;
      case 4:
        return <MagazineLayout4 key={hotel.id} {...props} />;
      default:
        return <MagazineLayout1 key={hotel.id} {...props} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: 1.0 }}
      className="min-h-screen bg-white pt-32 pb-20 px-6 magazine-scroll"
    >
      {isLoading ? (
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <Skeleton width="w-64" height="h-12" className="mb-4 rounded-xl" />
            <Skeleton width="w-96" height="h-6" rounded="lg" />
          </div>
          <div>
            {[...Array(3)].map((_, i) => (
              <MagazineLayout1Shimmer key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Search header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              Kết quả tìm kiếm
            </h1>
            <p className="text-xl text-gray-600">
              Tìm thấy <span className="font-bold text-amber-600">{results.length}</span> khách sạn
              {' '}phù hợp với{' '}
              <span className="font-bold text-gray-900">&quot;{searchQuery}&quot;</span>
            </p>
          </motion.div>

          {/* Results */}
          {results.length > 0 ? (
            <div>
              {results.map((item) => renderLayout(item))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow p-12"
            >
              <div className="grid grid-cols-3 gap-8 items-center">
                <div className="col-span-2">
                  <h2 className="text-5xl font-black" style={{ fontFamily: 'serif' }}>No Matches Found</h2>
                  <p className="mt-4 text-gray-600">Try different keywords or explore curated selections below.</p>
                </div>
                <div className="bg-amber-50 p-6 rounded-xl">
                  <div className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-3">Editor&apos;s Note</div>
                  <p className="text-sm text-gray-700 leading-relaxed">Discover our trending cuisines and seasonal specials.</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
      <style jsx>{`
        .magazine-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .magazine-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 9999px; }
        .magazine-scroll { scrollbar-width: thin; }
      `}</style>
    </motion.div>
  );
}


import React, { useState } from 'react';
import { RoomImageDto } from '@repo/types';
import { ImageWithFallback, Skeleton } from '@repo/ui';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface RoomGalleryProps {
  images: RoomImageDto[];
}

export default function RoomGallery({ images }: RoomGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
        No images available
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden cursor-zoom-in group shadow-sm bg-gray-100"
        onClick={() => setIsLightboxOpen(true)}
      >
        <ImageWithFallback
          src={selectedImage.imageUrl}
          alt={selectedImage.caption || 'Room Image'}
          fill
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Click to expand
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${idx === selectedIndex
                ? 'border-black ring-2 ring-black/10'
                : 'border-transparent opacity-70 hover:opacity-100'
                }`}
            >
              <ImageWithFallback
                src={img.imageUrl}
                alt={img.caption || `Thumbnail ${idx + 1}`}
                fill
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X size={24} />
            </button>

            <button
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors hidden sm:block"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(prev => (prev - 1 + images.length) % images.length);
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors hidden sm:block"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(prev => (prev + 1) % images.length);
              }}
            >
              <ChevronRight size={24} />
            </button>

            <div className="relative w-full max-w-5xl h-[80vh] px-4" onClick={e => e.stopPropagation()}>
              <ImageWithFallback
                src={images[selectedIndex].imageUrl}
                alt={images[selectedIndex].caption || 'Full view'}
                fill
                className="object-contain w-full h-full"
              />
              {images[selectedIndex].caption && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                  {images[selectedIndex].caption}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

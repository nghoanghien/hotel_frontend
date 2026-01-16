import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Trash2, Image as ImageIcon, RotateCcw, GripVertical } from "@repo/ui/icons";
import { ImageWithFallback, useNotification, useSwipeConfirmation } from "@repo/ui";

interface RoomGalleryProps {
  images: string[];
  onChange: (images: string[]) => void;
}

interface MediaItem {
  id: string;
  url: string;
  isDeleted: boolean;
  file?: File;
}

export default function RoomGallery({ images, onChange }: RoomGalleryProps) {
  const { showNotification } = useNotification();
  // const { confirm } = useSwipeConfirmation(); // Optional: Confirm delete individually? Probably not needed for draft
  const objectUrls = useRef<string[]>([]);

  // Initialize Items
  const [items, setItems] = useState<MediaItem[]>(() => {
    return (images || []).map((url: string) => ({
      id: Math.random().toString(36).substr(2, 9),
      url,
      isDeleted: false
    }));
  });

  // Sync back to parent whenever items change (filtering out deleted ones)
  // Or purely controlled? 
  // Let's make it so that onChange is called when we want to persist changes. 
  // But RoomForm is a form, so maybe we update parent state immediately?
  // Let's update parent state immediately for simplicity in form context.

  useEffect(() => {
    const activeUrls = items.filter(i => !i.isDeleted).map(i => i.url);
    // Compare with props to avoid infinite loop
    if (JSON.stringify(activeUrls) !== JSON.stringify(images)) {
      onChange(activeUrls);
    }
  }, [items]); // This might cause loop if parent updates props. 

  // Better approach: Local state is primary source of truth, sync parent only on change actions.
  // Actually, props.images should be initial only or synched carefully.
  // Let's stick to: items is local state initialized from props. We call onChange when items change.

  const [dragActive, setDragActive] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const lastSwapTime = useRef(0);

  // Drag & Drop File
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const newItems: MediaItem[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        objectUrls.current.push(url);
        newItems.push({
          id: Math.random().toString(36).substr(2, 9),
          url,
          isDeleted: false,
          file
        });
      }
    });

    if (newItems.length > 0) {
      setItems(prev => [...prev, ...newItems]);
      showNotification({
        type: 'success',
        message: `Added ${newItems.length} photos`,
        format: 'Images uploaded successfully',
        autoHideDuration: 2000
      });
    }
  };

  // Reorder Logic (Swap)
  const handleItemDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    const emptyImage = new Image();
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
  };

  const handleItemDragEnter = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    if (draggingId === null || draggingId === targetId) return;

    const now = Date.now();
    if (now - lastSwapTime.current < 200) return;

    const sourceIndex = items.findIndex(i => i.id === draggingId);
    const targetIndex = items.findIndex(i => i.id === targetId);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      const newItems = [...items];
      const [removed] = newItems.splice(sourceIndex, 1);
      newItems.splice(targetIndex, 0, removed);
      setItems(newItems);
      lastSwapTime.current = now;
    }
  };

  const handleItemDragEnd = () => {
    setDraggingId(null);
  };

  const toggleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(prev => {
      // If it's a newly added file (blob), we might want to just remove it completely?
      // But soft delete consistency is nice.
      return prev.map(item => item.id === id ? { ...item, isDeleted: !item.isDeleted } : item);
    });
  };

  // Cleanup ObjectURLs
  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleGlobalDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setMousePos({ x: e.clientX, y: e.clientY });
  };
  const draggingItem = items.find(i => i.id === draggingId);

  return (
    <div className="h-full flex flex-col" onDragOver={handleGlobalDragOver}>
      {/* Drop Zone */}
      <div
        className={`relative rounded-3xl border-2 border-dashed transition-all duration-500 mb-8 overflow-hidden group h-40 flex flex-col items-center justify-center cursor-pointer shrink-0
            ${dragActive
            ? 'border-blue-500 bg-blue-50/50 shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] scale-[1.01]'
            : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'}
          `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={dragActive ? { y: -5, rotate: 10, scale: 1.1 } : { y: 0, rotate: 0, scale: 1 }}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${dragActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'}`}
          >
            <ImageIcon className="w-8 h-8" strokeWidth={1.5} />
          </motion.div>
          <h3 className={`font-bold transition-colors ${dragActive ? 'text-blue-500' : 'text-slate-600'}`}>
            {dragActive ? 'Drop images to upload!' : 'Drop photos here or click to browse'}
          </h3>
        </div>
      </div>

      {/* Scrollable Grid */}
      <div className="flex-1 overflow-y-auto pr-2 pb-4 min-h-[200px]">
        {items.length === 0 && (
          <div className="text-center text-gray-400 py-10">No images added yet.</div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className={`aspect-[4/3] cursor-grab active:cursor-grabbing transition-[padding] duration-300
                        ${item.isDeleted ? 'p-3' : 'p-0'}
                        ${draggingId === item.id ? 'opacity-0' : ''}
                        `}
                draggable={!item.isDeleted}
                onDragStart={(e) => handleItemDragStart(e as unknown as React.DragEvent<HTMLDivElement>, item.id)}
                onDragEnter={(e) => handleItemDragEnter(e as unknown as React.DragEvent<HTMLDivElement>, item.id)}
                onDragEnd={handleItemDragEnd}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className={`relative w-full h-full rounded-2xl overflow-hidden group bg-white border border-gray-100
                           ${item.isDeleted ? 'opacity-60 shadow-none grayscale' : 'hover:shadow-lg shadow-sm'}
                        `}>
                  <ImageWithFallback
                    src={item.url}
                    alt="Room Photo"
                    fill
                    className={`object-cover pointer-events-none select-none ${item.isDeleted ? '' : 'transition-transform duration-500 group-hover:scale-110'}`}
                    draggable={false}
                  />

                  {/* Controls */}
                  <div className="absolute inset-0 z-20 transition-opacity duration-200 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/10">
                    <button
                      type="button" // Important preventing form submit
                      onClick={(e) => toggleDelete(item.id, e)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200
                                    ${item.isDeleted
                          ? 'bg-white text-blue-500 hover:scale-110'
                          : 'bg-white text-red-500 hover:scale-110 hover:bg-red-50'}
                                `}
                      title={item.isDeleted ? "Undo" : "Remove"}
                    >
                      {item.isDeleted ? <RotateCcw size={18} /> : <Trash2 size={18} />}
                    </button>
                  </div>

                  {!item.isDeleted && (
                    <div className="absolute top-2 left-2 text-white/80 opacity-0 group-hover:opacity-100 drop-shadow-md">
                      <GripVertical size={16} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Drag Overlay */}
      {draggingId && draggingItem && (
        <div
          className="fixed pointer-events-none z-[100] w-32 h-24 rounded-xl overflow-hidden shadow-2xl ring-4 ring-blue-500 ring-opacity-50 rotate-6"
          style={{
            top: mousePos.y,
            left: mousePos.x,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <ImageWithFallback src={draggingItem.url} alt="Dragging" fill className="object-cover" />
        </div>
      )}
    </div>
  );
}

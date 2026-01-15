"use client";
import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";

type Props = ImageProps & {
  containerClassName?: string;
  fallbackIcon?: React.ReactNode;
};

export default function ImageWithFallback({ containerClassName, className, fallbackIcon, onLoad, onError, ...props }: Props) {
  const hasSrc = !!props.src;
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(() => !hasSrc ? 'error' : 'loading');
  const isFill = (props as any).fill === true;

  // React to src changes
  useEffect(() => {
    if (!hasSrc) {
      setStatus('error');
    } else {
      setStatus('loading');
    }
  }, [hasSrc, props.src]);

  const handleLoad = (e: any) => {
    setStatus('loaded');
    if (onLoad) onLoad(e);
  };

  const handleError = (e: any) => {
    setStatus('error');
    if (onError) onError(e);
  };

  const showFallback = !hasSrc || status === 'loading' || status === 'error';

  // Determine the base class for the container
  const baseContainerClasses = `relative overflow-hidden ${containerClassName ?? ""}`;

  // Fallback Element
  const Fallback = (
    <div
      className={`flex items-center justify-center bg-gray-200 transition-opacity duration-300
        ${isFill ? "absolute inset-0" : "w-full h-full"}
        ${showFallback ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}
      `}
    >
      {fallbackIcon || <Building2 className="w-1/3 h-1/3 text-gray-400 opacity-50" />}
    </div>
  );

  return (
    <div className={baseContainerClasses}>
      {Fallback}
      {hasSrc && (
        <Image
          {...props}
          className={`${className || ''} transition-opacity duration-500
            ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}
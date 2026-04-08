'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselProps {
  children: React.ReactNode;
  autoPlay?: boolean;
  interval?: number;
}

export function Carousel({ children, autoPlay = false, interval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const items = React.Children.toArray(children);
  const count = items.length;

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (autoPlay && !isPaused) {
      const timer = setInterval(next, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, isPaused, next, interval]);

  const scrollTo = (index: number) => {
    setCurrentIndex(index);
  };

  // We remove all paddings, margins, borders and rounding for a 100% flush layout
  return (
    <div 
      className="relative group w-full overflow-hidden rounded-2xl border border-white/10 bg-black/5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Items Container */}
      <div 
        className="flex transition-transform duration-500 ease-out w-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((child, i) => (
          <div key={i} className="flex-none w-full h-full flex items-center justify-center">
            {/* We ensure the child (likely an image) has no margins */}
            <div className="w-full h-full [&>img]:block [&>img]:w-full [&>img]:h-auto [&>img]:m-0">
               {child}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only show if more than 1 item */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40 border border-white/10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40 border border-white/10"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators & Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
             {/* Slide Counter */}
             <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-[10px] font-bold text-white/90 border border-white/5 uppercase tracking-widest">
                {currentIndex + 1} <span className="text-white/40 mx-1">/</span> {count}
             </div>
             
             {/* Dots */}
             <div className="flex gap-2 p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/5">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className={cn(
                      "h-1.5 transition-all duration-300 rounded-full",
                      i === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-white/30 hover:bg-white/50"
                    )}
                  />
                ))}
             </div>
          </div>
        </>
      )}
    </div>
  );
}

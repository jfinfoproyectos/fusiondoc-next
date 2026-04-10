"use client";

import React, { useEffect, useRef } from "react";
import { createTimeline, stagger } from "animejs";
import { useInView } from "framer-motion";

interface Step {
  title: string;
  description?: string;
}

interface TimelineFlowProps {
  steps: string | Step[];
  className?: string;
}

export function TimelineFlow({ steps: rawSteps, className = "" }: TimelineFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  // Handle both raw string (from relaxed JSON) and proper Step array
  let steps: Step[] = [];
  try {
    steps = typeof rawSteps === 'string' ? new Function("return " + rawSteps)() : rawSteps;
  } catch (e) {
    console.error("Error parsing steps in TimelineFlow:", e);
  }

  useEffect(() => {
    if (isInView && containerRef.current) {
      const timeline = createTimeline({
        defaults: {
          ease: 'outExpo',
          duration: 800
        }
      });

      timeline
        .add(containerRef.current.querySelectorAll('.flow-line'), {
          scaleX: [0, 1],
          opacity: [0, 1],
          duration: 1000,
          delay: stagger(200)
        })
        .add(containerRef.current.querySelectorAll('.flow-node'), {
          scale: [0, 1],
          opacity: [0, 1],
          delay: stagger(300)
        }, '-=800')
        .add(containerRef.current.querySelectorAll('.flow-content'), {
          translateY: [20, 0],
          opacity: [0, 1],
          delay: stagger(300)
        }, '-=800');
    }
  }, [isInView]);

  return (
    <div ref={containerRef} className={`my-12 px-4 ${className}`}>
      <div className="relative flex flex-col md:flex-row items-start justify-between gap-8 md:gap-4 ml-4 md:ml-0">
        {/* Connection Line (Mobile: vertical, Desktop: horizontal) */}
        <div className="absolute left-[11px] md:left-0 top-0 w-[2px] md:w-full h-full md:h-[2px] bg-white/10 -z-10" />
        
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex md:flex-col items-start md:items-center flex-1 group">
            {/* Step Node */}
            <div className="flow-node flex-shrink-0 w-6 h-6 rounded-full bg-primary border-4 border-background z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-transform group-hover:scale-125" 
                 style={{ opacity: 0 }} />
            
            {/* Content */}
            <div className="flow-content ml-6 md:ml-0 md:mt-4 md:text-center" style={{ opacity: 0 }}>
              <h4 className="text-sm font-bold text-foreground mb-1">{step.title}</h4>
              {step.description && (
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  {step.description}
                </p>
              )}
            </div>
            
            {/* Desktop-only animated connector mask if needed? No, let's keep it simple and clean */}
          </div>
        ))}
      </div>
    </div>
  );
}

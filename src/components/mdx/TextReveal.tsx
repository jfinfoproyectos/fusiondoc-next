"use client";

import React, { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { useInView } from "framer-motion";

export function TextReveal({ 
  text, 
  as: Component = "h2",
  className = "",
  delay = 0 
}: { 
  text: string;
  as?: React.ElementType;
  className?: string;
  delay?: number;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: "some" });

  useEffect(() => {
    const nodes = containerRef.current?.querySelectorAll('.letter');
    if (!nodes) return;
    
    if (isInView) {
      animate(nodes, {
        translateY: ["1.5em", 0],
        opacity: [0, 1],
        duration: 800,
        delay: stagger(30, { start: delay }),
        ease: "outExpo",
      });
    } else {
      // Reset animation styles when out of view
      animate(nodes, {
        translateY: "1.5em",
        opacity: 0,
        duration: 0
      });
    }
  }, [isInView, delay]);

  // Wraps every character in a span for individual animation
  const letters = text.split("").map((char, index) => (
    <span 
      key={index} 
      className="letter inline-block" 
      style={{ opacity: 0, transform: "translateY(1.5em)" }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  return (
    <Component ref={containerRef} className={`overflow-hidden ${className}`}>
      {letters}
    </Component>
  );
}

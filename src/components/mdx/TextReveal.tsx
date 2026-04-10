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
  const isInView = useInView(containerRef, { once: true, amount: "some" });

  useEffect(() => {
    if (isInView && containerRef.current) {
      animate(containerRef.current.querySelectorAll('.letter'), {
        translateY: ["1.5em", 0],
        opacity: [0, 1],
        duration: 800,
        delay: stagger(30, { start: delay }),
        ease: "outExpo",
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

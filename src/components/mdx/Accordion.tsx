'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
}

export function Accordion({ children, allowMultiple = false }: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes(prev => 
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes(prev => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className="my-6 border border-white/10 rounded-xl overflow-hidden bg-white/5 divide-y divide-white/10">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isOpen: openIndexes.includes(index),
            onToggle: () => toggleIndex(index),
          });
        }
        return child;
      })}
    </div>
  );
}

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AccordionItem({ title, children, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="group">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors focus:outline-none"
      >
        <span className="font-medium text-foreground/90 group-hover:text-foreground transition-colors">
          {title}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 pt-0 text-sm leading-relaxed text-muted-foreground prose-p:my-0">
          {children}
        </div>
      </div>
    </div>
  );
}

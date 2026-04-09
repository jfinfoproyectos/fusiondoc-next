'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DynamicIcon from '@/components/DynamicIcon';

interface Topic {
  title: string;
  slug: string;
  order: number;
  icon?: string;
}

export default function TopicsBar() {
  const pathname = usePathname();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Determine active topic from pathname
  const activeTopic = pathname.split('/').filter(Boolean)[0];

  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await fetch('/api/topics');
        const data = await res.json();
        setTopics(data.topics || []);
      } catch (err) {
        console.error('Error loading topics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTopics();
  }, []);

  if (!loading && topics.length === 0) return null;

  return (
    <div className="w-full border-b border-border bg-background h-10 flex items-center px-4 md:px-6 sticky top-16 z-40 overflow-x-auto no-scrollbar scroll-smooth text-nowrap">
      <div className="flex items-center space-x-1 max-w-[1700px] mx-auto w-full">
        {loading ? (
           <div className="flex gap-2">
             {[1,2,3].map(i => <div key={i} className="h-7 w-20 rounded-full bg-muted/40 animate-pulse" />)}
           </div>
        ) : (
          topics.map((topic) => {
            const isActive = activeTopic === topic.slug;
            return (
              <Link
                key={topic.slug}
                href={`/${topic.slug}`}
                className={`px-4 py-1 text-xs font-medium rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-1 ring-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent'
                }`}
              >
                {topic.icon && <DynamicIcon icon={topic.icon} width="14" height="14" />}
                {topic.title}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

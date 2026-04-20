"use client";

import { useEffect, useState } from 'react';

export default function RightSidebar() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    // Escanear encabezados h2 y h3
    const elements = Array.from(document.querySelectorAll('.prose h2, .prose h3'));
    const newHeadings = elements.map((elem) => ({
      id: elem.id || elem.textContent?.toLowerCase().replace(/\s+/g, '-') || 'id-' + Math.random(),
      text: elem.textContent || '',
      level: Number(elem.tagName.replace('H', ''))
    }));
    
    // Asignar IDs si no tienen
    elements.forEach((elem, i) => {
      elem.id = newHeadings[i].id;
    });

    setHeadings(newHeadings);
  }, []);

  return (
    <aside className="w-64 p-4 hidden xl:block shrink-0 h-full overflow-y-auto border-l border-border custom-scrollbar">
      <h4 className="font-semibold mb-4 text-foreground border-b border-border pb-2">En esta página</h4>
      <ul className="space-y-2 text-sm">
        {headings.length === 0 && <li className="text-muted-foreground">No hay encabezados</li>}
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'ml-4' : ''}>
            <a 
              href={`#${heading.id}`}
              className="text-muted-foreground hover:text-primary block leading-tight py-0.5"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

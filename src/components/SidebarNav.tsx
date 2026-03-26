"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavGroup } from '@/lib/github';

export default function SidebarNav({ navItems }: { navItems: NavGroup[] }) {
  const pathname = usePathname();

  if (!navItems || navItems.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Cargando navegación... o no se encontraron archivos.
      </div>
    );
  }

  return (
    <nav className="p-4 flex flex-col gap-6">
      {navItems.map((group, index) => (
        <div key={`${group.title || 'group'}-${index}`}>
          <h3 className="font-semibold text-foreground mb-2">{group.title}</h3>
          <ul className="space-y-1">
            {group.links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-2 py-1.5 text-sm rounded-md transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

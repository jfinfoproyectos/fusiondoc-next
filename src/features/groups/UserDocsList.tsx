"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, FileText, LayoutGrid, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocInfo {
  id: string;
  title: string;
  icon?: string;
  groupName: string;
  imageUrl?: string | null;
}

interface UserDocsListProps {
  docs: DocInfo[];
}

export function UserDocsList({ docs }: UserDocsListProps) {
  if (docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-3xl text-center">
        <div className="p-4 bg-muted/20 rounded-full mb-4">
          <BookOpen className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-xl font-semibold text-muted-foreground">No hay documentación disponible</h3>
        <p className="text-sm text-muted-foreground/60 mt-1">
          No se ha encontrado contenido en esta categoría.
        </p>
      </div>
    );
  }

  const defaultImages = [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop"
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {docs.map((doc, index) => {
        const bgImage = doc.imageUrl || defaultImages[index % defaultImages.length];
        
        return (
          <div key={`${doc.groupName}-${doc.id}`} className="relative group perspective-1000">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[1.2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <Card className="h-full flex flex-col relative bg-card/60 backdrop-blur-3xl border-border/40 rounded-[1rem] overflow-hidden hover:border-primary/40 transition-all duration-500 shadow-lg hover:-translate-y-1 p-0">
              {/* Header Image/Icon Section */}
              <div className="relative h-32 w-full overflow-hidden bg-muted/20">
                 <img 
                   src={bgImage} 
                   alt={doc.title}
                   className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                 />
                 
                 <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />

                 {/* Group Badge - Micro */}
                 <div className="absolute top-2 left-2 z-20">
                    <Badge variant="secondary" className="text-[7px] px-1.5 h-4 font-black uppercase tracking-widest border-none shadow-lg backdrop-blur-md bg-background/80 text-muted-foreground">
                      {doc.groupName}
                    </Badge>
                 </div>
              </div>

              <CardHeader className="pb-0 pt-3 px-4 flex flex-col items-center">
                <CardTitle className="text-sm font-black tracking-tight leading-tight group-hover:text-primary transition-colors truncate text-center w-full">
                  {doc.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 py-3 flex flex-col justify-center items-center gap-3">
                {/* Action Section */}
                <Link href={`/${doc.id}`} className="w-full block">
                  <Button variant="outline" className="w-full h-7 text-[8px] font-black uppercase tracking-widest gap-1 rounded-lg border-primary/20 bg-primary/5 hover:bg-primary hover:text-primary-foreground transition-all flex justify-center items-center shadow-sm">
                    <BookOpen className="w-3 h-3" />
                    Ver Documentación
                  </Button>
                </Link>
                
                <p className="text-[7px] font-mono text-muted-foreground/30 uppercase tracking-tighter">
                  ID: {doc.id}
                </p>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

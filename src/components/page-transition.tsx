"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// Enter-only route transition, done in CSS so the server-rendered page is
// never hidden waiting for hydration (see .page-enter in globals.css).
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="page-enter flex-1" key={pathname}>
      {children}
    </div>
  );
}

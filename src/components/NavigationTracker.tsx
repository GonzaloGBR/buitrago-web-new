"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { markNavigated } from "@/lib/history-tracker";

export default function NavigationTracker() {
  const pathname = usePathname();
  const initialPath = useRef(pathname);

  useEffect(() => {
    if (pathname !== initialPath.current) {
      markNavigated();
    }
  }, [pathname]);

  return null;
}

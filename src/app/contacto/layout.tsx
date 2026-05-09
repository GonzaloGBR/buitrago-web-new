import type { ReactNode } from "react";
import BackHeader from "@/components/BackHeader";

export default function ContactoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BackHeader />
      {children}
    </>
  );
}

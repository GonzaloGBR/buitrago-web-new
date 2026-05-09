import type { ReactNode } from "react";
import BackHeader from "@/components/BackHeader";
import Footer from "@/components/Footer";

export default function ContactoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BackHeader />
      {children}
      <Footer />
    </>
  );
}

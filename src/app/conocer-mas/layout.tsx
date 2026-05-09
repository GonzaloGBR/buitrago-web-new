import BackHeader from "@/components/BackHeader";
import Footer from "@/components/Footer";

export default function ConocerMasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BackHeader />
      {children}
      <Footer />
    </>
  );
}

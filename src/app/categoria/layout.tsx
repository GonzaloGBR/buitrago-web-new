import PublicTopNav from "@/components/PublicTopNav";

export default function CategoriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicTopNav />
      {children}
    </>
  );
}

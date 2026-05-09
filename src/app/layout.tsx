import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Cormorant } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/** Hero / marca: armoniza con el trazo caligráfico del logo (B) sin competir con Playfair del resto del sitio */
const cormorant = Cormorant({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Buitrago — Muebles Artesanales de Lujo",
  description:
    "Carpintería artesanal de alta gama. Creamos piezas únicas que transforman espacios con la calidez y nobleza de la madera.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F5F0" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable} antialiased`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

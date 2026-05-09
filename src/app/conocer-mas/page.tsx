import type { Metadata } from "next";
import ConocerMasClient from "./ConocerMasClient";

export const metadata: Metadata = {
  title: "Conocer más — Buitrago",
  description:
    "Tres generaciones de carpinteros. Descubre la historia, los valores y el proceso artesanal detrás de cada pieza Buitrago.",
};

export default function ConocerMasPage() {
  return <ConocerMasClient />;
}

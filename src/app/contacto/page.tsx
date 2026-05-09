import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contacto — Buitrago",
  description:
    "Escríbenos para proyectos de muebles artesanales a medida. Formulario de contacto, correo y teléfono.",
};

export default function ContactoPage() {
  return (
    <main className="min-h-[calc(100svh-5rem)] bg-cream pb-16 pt-10 sm:pb-24 sm:pt-12 md:pt-16">
      <div className="section-editorial">
        <p className="text-label text-warm-gray mb-4">Contacto</p>
        <h1 className="heading-display mb-4 text-[clamp(1.875rem,6vw,3.5rem)] text-charcoal">
          Hablemos de tu <span className="text-accent">proyecto</span>
        </h1>
        <p className="mb-10 max-w-2xl font-sans text-sm leading-relaxed text-charcoal/75 sm:text-base md:mb-14 md:text-lg">
          Completa el formulario y se abrirá tu aplicación de correo con el mensaje preparado. Solo
          tienes que pulsar enviar en esa ventana.
        </p>
        <ContactForm />
      </div>
    </main>
  );
}

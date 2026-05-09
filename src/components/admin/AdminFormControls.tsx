"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/**
 * Controles de formulario reutilizables para el panel admin. Concentran las clases comunes
 * (border, padding, font, focus ring) en un solo sitio para que los formularios solo describan
 * estructura y datos, no estilos.
 *
 * Convenciones:
 *  - `font-mono` se reserva para slugs / IDs (variant="mono").
 *  - `<AdminField>` envuelve label + control + ayuda opcional.
 *
 * Tipografía: la familia se decide por `variant`, el tamaño por `size`. Ambos se aplican antes
 * que `extra` para que cualquier override puntual pasado por `className` siempre gane.
 */

const BASE_CONTROL_CLASS =
  "w-full rounded-sm border border-charcoal/15 bg-white px-3 py-2.5 outline-none transition-[border-color] focus:border-charcoal/40";

type ControlVariant = "sans" | "mono";
type ControlSize = "sm" | "xs";

function controlClass(
  variant: ControlVariant = "sans",
  size: ControlSize = "sm",
  extra?: string
): string {
  const family = variant === "mono" ? "font-mono" : "font-sans";
  const text = size === "xs" ? "text-xs" : "text-sm";
  return [BASE_CONTROL_CLASS, family, text, extra].filter(Boolean).join(" ");
}

export const ADMIN_LABEL_CLASS =
  "mb-2 block text-[0.7rem] uppercase tracking-[0.12em] text-warm-gray";

type AdminLabelProps = {
  htmlFor?: string;
  children: ReactNode;
};

export function AdminLabel({ htmlFor, children }: AdminLabelProps) {
  return (
    <label htmlFor={htmlFor} className={ADMIN_LABEL_CLASS}>
      {children}
    </label>
  );
}

type AdminFieldProps = {
  label: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AdminField({
  label,
  htmlFor,
  hint,
  children,
  className,
}: AdminFieldProps) {
  return (
    <div className={className}>
      <AdminLabel htmlFor={htmlFor}>{label}</AdminLabel>
      {children}
      {hint ? (
        <p className="mt-1.5 font-sans text-[0.7rem] text-warm-gray">{hint}</p>
      ) : null}
    </div>
  );
}

type AdminInputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: ControlVariant;
  /** Usa `textSize` (no `size`, que colisiona con el atributo nativo de <input>). */
  textSize?: ControlSize;
};

export function AdminInput({
  className,
  variant = "sans",
  textSize = "sm",
  ...rest
}: AdminInputProps) {
  return (
    <input {...rest} className={controlClass(variant, textSize, className)} />
  );
}

type AdminTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: ControlVariant;
  textSize?: ControlSize;
};

export function AdminTextarea({
  className,
  variant = "sans",
  textSize = "sm",
  ...rest
}: AdminTextareaProps) {
  return (
    <textarea
      {...rest}
      className={controlClass(variant, textSize, className)}
    />
  );
}

type AdminSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function AdminSelect({ className, ...rest }: AdminSelectProps) {
  return (
    <select {...rest} className={controlClass("sans", "sm", className)} />
  );
}

"use client";

import { useActionState } from "react";
import {
  loginAction,
  type LoginState,
} from "@/app/admin/actions/auth";
import { AdminField, AdminInput } from "@/components/admin/AdminFormControls";

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null as LoginState);

  return (
    <form action={formAction} className="mx-auto w-full max-w-sm space-y-6 rounded-sm border border-charcoal/10 bg-cream p-6 shadow-sm sm:p-8">
      <h1 className="font-serif text-xl text-charcoal sm:text-2xl">Acceso administración</h1>
      <p className="font-sans text-sm text-warm-gray">
        Introduce la contraseña configurada en el servidor.
      </p>

      {/* En móvil el global CSS sube inputs a 16px para que iOS Safari no haga zoom; a partir de sm: vuelve al text-sm del control. */}
      <AdminField label="Contraseña" htmlFor="password">
        <AdminInput
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </AdminField>

      {state?.error ? (
        <p className="font-sans text-sm text-red-700">{state.error}</p>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-sm bg-charcoal py-3 font-sans text-[0.68rem] font-medium uppercase tracking-[0.18em] text-cream hover:bg-charcoal-light"
      >
        Entrar
      </button>
    </form>
  );
}

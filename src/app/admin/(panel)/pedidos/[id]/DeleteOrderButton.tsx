"use client";

import { useTransition } from "react";
import { deleteOrderAction } from "@/app/admin/actions/orders";

export default function DeleteOrderButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm("¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.")) {
      startTransition(() => {
        deleteOrderAction(id);
      });
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 h-10 px-4 py-2 disabled:opacity-50"
    >
      {isPending ? "Eliminando..." : "Eliminar Pedido"}
    </button>
  );
}

"use client";

import { useTransition } from "react";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { deleteOrderAction, updateOrderStatusAction } from "@/app/admin/actions/orders";

export default function OrderQuickActions({ 
  id, 
  status 
}: { 
  id: string; 
  status: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();

  const handleComplete = () => {
    if (confirm("¿Marcar este pedido como Realizado?")) {
      startTransition(() => {
        updateOrderStatusAction(id, OrderStatus.COMPLETED);
      });
    }
  };

  const handleDelete = () => {
    if (confirm("¿Seguro que deseas eliminar este pedido? Esta acción no se puede deshacer.")) {
      startTransition(() => {
        deleteOrderAction(id);
      });
    }
  };

  return (
    <div className="flex flex-col xl:flex-row items-center justify-center gap-1.5">
      {status !== OrderStatus.COMPLETED && (
        <button
          onClick={handleComplete}
          disabled={isPending}
          className="text-[11px] font-medium bg-green-50 text-green-700 border border-green-200 rounded px-2 py-1 hover:bg-green-100 disabled:opacity-50 transition-colors whitespace-nowrap"
          title="Marcar como Realizado"
        >
          ✓ Realizado
        </button>
      )}

      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-[11px] font-medium bg-red-50 text-red-700 border border-red-200 rounded px-2 py-1 hover:bg-red-100 disabled:opacity-50 transition-colors whitespace-nowrap"
        title="Eliminar"
      >
        Eliminar
      </button>
    </div>
  );
}

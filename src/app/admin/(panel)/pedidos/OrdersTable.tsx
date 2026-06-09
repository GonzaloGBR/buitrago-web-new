"use client";

import { useState } from "react";
import { OrderStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import OrderQuickActions from "./OrderQuickActions";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function OrdersTable({ orders }: { orders: any[] }) {
  const [tab, setTab] = useState<"pendientes" | "realizados">("pendientes");
  const router = useRouter();

  const filteredOrders = orders.filter((order) => {
    if (tab === "pendientes") return order.status !== OrderStatus.COMPLETED;
    if (tab === "realizados") return order.status === OrderStatus.COMPLETED;
    return true;
  });

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-semibold text-lg">Historial de Pedidos</h2>
        <div className="flex bg-neutral-100 p-1 rounded-lg">
          <button
            onClick={() => setTab("pendientes")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              tab === "pendientes" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setTab("realizados")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              tab === "realizados" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Realizados
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 text-neutral-500 border-b">
            <tr>
              <th className="px-2 py-3 font-medium">Cliente</th>
              <th className="px-2 py-3 font-medium">Mueble</th>
              <th className="px-2 py-3 font-medium">Fechas</th>
              <th className="px-2 py-3 font-medium">Estado</th>
              <th className="px-2 py-3 font-medium text-right">Presupuesto</th>
              <th className="px-2 py-3 font-medium text-right">Abono</th>
              <th className="px-2 py-3 font-medium text-right">Deuda</th>
              <th className="px-2 py-3 font-medium text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-neutral-500">
                  {tab === "pendientes" ? "No hay pedidos pendientes." : "No hay pedidos realizados."}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const debt = Math.max(0, order.totalBudget - order.advancePayment);
                const itemName = order.productId ? order.product?.name : order.customFurnitureName;
                return (
                  <tr 
                    key={order.id} 
                    onClick={() => router.push(`/admin/pedidos/${order.id}`)}
                    className="hover:bg-neutral-50 cursor-pointer transition-colors"
                  >
                    <td className="px-2 py-3 font-medium">{order.customerName}</td>
                    <td className="px-2 py-3 text-xs md:text-sm">{itemName || "—"}</td>
                    <td className="px-2 py-3 text-[11px] md:text-xs text-neutral-500 whitespace-nowrap">
                      <p>P: {order.orderDate ? new Date(order.orderDate).toLocaleDateString("es-CO") : new Date(order.createdAt).toLocaleDateString("es-CO")}</p>
                      {order.estimatedDeliveryDate && (
                        <p className="mt-1 text-amber-600 font-medium">E: {new Date(order.estimatedDeliveryDate).toLocaleDateString("es-CO")}</p>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                        order.status === OrderStatus.COMPLETED ? "bg-green-100 text-green-800" :
                        order.status === OrderStatus.CANCELLED ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status === OrderStatus.COMPLETED ? "Realizado" :
                         order.status === OrderStatus.CANCELLED ? "Cancelado" : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-right whitespace-nowrap">{formatMoney(order.totalBudget)}</td>
                    <td className="px-2 py-3 text-right whitespace-nowrap">{formatMoney(order.advancePayment)}</td>
                    <td className="px-2 py-3 text-right font-medium text-orange-600 whitespace-nowrap">{formatMoney(debt)}</td>
                    <td className="px-2 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <OrderQuickActions id={order.id} status={order.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

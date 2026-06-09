"use client";

import { useState } from "react";
import OrdersTable from "./OrdersTable";
import { EarningsChart, StatsCharts } from "./DashboardCharts";

type InformacionTabsProps = {
  orders: any[];
  kpis: {
    weekly: number;
    monthly: number;
    yearly: number;
    pendingDebt: number;
    activeOrders: number;
  };
  chartData: {
    monthlyEarnings: number[];
    topFurniture: Record<string, number>;
    finishCounts: Record<string, number>;
    woodCounts: Record<string, number>;
  };
};

function formatMoney(amount: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function InformacionTabs({ orders, kpis, chartData }: InformacionTabsProps) {
  const [activeTab, setActiveTab] = useState<"pedidos" | "ganancias" | "estadisticas">("pedidos");

  return (
    <div className="space-y-6">
      {/* Pestañas de Navegación */}
      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("pedidos")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "pedidos"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
            }`}
          >
            Pedidos
          </button>
          <button
            onClick={() => setActiveTab("ganancias")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "ganancias"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
            }`}
          >
            Ganancias
          </button>
          <button
            onClick={() => setActiveTab("estadisticas")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "estadisticas"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
            }`}
          >
            Estadísticas
          </button>
        </nav>
      </div>

      {/* Contenido de la pestaña */}
      <div className="mt-6">
        {activeTab === "pedidos" && (
          <OrdersTable orders={orders} />
        )}

        {activeTab === "ganancias" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border bg-card text-card-foreground shadow p-6 bg-white">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Ganancias (Esta Semana)</h3>
                <div className="text-2xl font-bold mt-2 text-green-600">{formatMoney(kpis.weekly)}</div>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow p-6 bg-white">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Ganancias (Este Mes)</h3>
                <div className="text-2xl font-bold mt-2 text-green-600">{formatMoney(kpis.monthly)}</div>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow p-6 bg-white">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Ganancias (Este Año)</h3>
                <div className="text-2xl font-bold mt-2 text-green-600">{formatMoney(kpis.yearly)}</div>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow p-6 bg-white">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Deuda Pendiente</h3>
                <div className="text-2xl font-bold mt-2 text-orange-500">{formatMoney(kpis.pendingDebt)}</div>
                <p className="text-xs text-muted-foreground mt-1">{kpis.activeOrders} pedidos activos</p>
              </div>
            </div>

            <EarningsChart monthlyEarnings={chartData.monthlyEarnings} />
          </div>
        )}

        {activeTab === "estadisticas" && (
          <div className="animate-in fade-in duration-300">
            <StatsCharts data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
}

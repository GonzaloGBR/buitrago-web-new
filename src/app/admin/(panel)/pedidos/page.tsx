import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import Link from "next/link";
import InformacionTabs from "./InformacionTabs";

function getKPIs(orders: any[]) {
  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  let weekly = 0;
  let monthly = 0;
  let yearly = 0;
  let pendingDebt = 0;
  let activeOrders = 0;

  orders.forEach((o) => {
    if (o.status === OrderStatus.COMPLETED) {
      if (o.updatedAt >= oneWeekAgo) weekly += o.totalBudget;
      if (o.updatedAt >= startOfMonth) monthly += o.totalBudget;
      if (o.updatedAt >= startOfYear) yearly += o.totalBudget;
    } else if (o.status === OrderStatus.PENDING) {
      pendingDebt += Math.max(0, o.totalBudget - o.advancePayment);
      activeOrders++;
    }
  });

  return { weekly, monthly, yearly, pendingDebt, activeOrders };
}

function getChartData(orders: any[]) {
  const currentYear = new Date().getFullYear();
  const monthlyEarnings = new Array(12).fill(0);
  
  const furnitureCounts: Record<string, number> = {};
  const finishCounts: Record<string, number> = {};
  const woodCounts: Record<string, number> = {};

  orders.forEach((o) => {
    // Only process COMPLETED orders for analytics
    if (o.status !== OrderStatus.COMPLETED) return;

    // Monthly Earnings (Current year)
    const date = new Date(o.updatedAt);
    if (date.getFullYear() === currentYear) {
      monthlyEarnings[date.getMonth()] += o.totalBudget;
    }

    // Top Furniture
    const itemName = o.productId ? o.product?.name : o.customFurnitureName;
    const name = itemName || "Otro";
    furnitureCounts[name] = (furnitureCounts[name] || 0) + 1;

    // Finish
    if (o.finish && o.finish.trim() !== "") {
      finishCounts[o.finish] = (finishCounts[o.finish] || 0) + 1;
    }

    // Wood
    if (o.wood && o.wood.trim() !== "") {
      woodCounts[o.wood] = (woodCounts[o.wood] || 0) + 1;
    }
  });

  // Sort and limit top 5 furniture
  const topFurniture = Object.entries(furnitureCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {} as Record<string, number>);

  return { monthlyEarnings, topFurniture, finishCounts, woodCounts };
}

export default async function PedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  const kpis = getKPIs(orders);
  const chartData = getChartData(orders);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Información</h1>
        <Link
          href="/admin/pedidos/nuevo"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 bg-neutral-900 text-white"
        >
          + Nuevo Pedido
        </Link>
      </div>

      <InformacionTabs orders={orders} kpis={kpis} chartData={chartData} />
    </div>
  );
}

"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

type ChartDataProps = {
  monthlyEarnings: number[];
  topFurniture: Record<string, number>;
  finishCounts: Record<string, number>;
  woodCounts: Record<string, number>;
};

export function EarningsChart({ monthlyEarnings }: { monthlyEarnings: number[] }) {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(val);
  };

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Ganancias ($)",
        data: monthlyEarnings,
        borderColor: "rgb(34, 197, 94)", // green-500
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "rgb(34, 197, 94)",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return " " + formatCurrency(context.raw);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            if (value === 0) return "$0";
            return "$" + (value / 1000000).toFixed(1) + "M";
          },
        },
      },
    },
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Ganancias Anuales ({new Date().getFullYear()})</h3>
      <div className="h-[300px] w-full">
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
  );
}

export function StatsCharts({ data }: { data: Omit<ChartDataProps, "monthlyEarnings"> }) {
  const commonDonutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: { position: "bottom" as const, labels: { padding: 20, boxWidth: 12 } },
    },
  };

  const palette1 = ["#1f2937", "#4b5563", "#9ca3af", "#d1d5db", "#e5e7eb"];
  const palette2 = ["#92400e", "#b45309", "#d97706", "#f59e0b", "#fcd34d"];
  const palette3 = ["#3f6212", "#4d7c0f", "#65a30d", "#84cc16", "#a3e635"];

  const buildDonutData = (counts: Record<string, number>, colors: string[]) => ({
    labels: Object.keys(counts),
    datasets: [{ data: Object.values(counts), backgroundColor: colors, borderWidth: 0 }],
  });

  const hasData = (counts: Record<string, number>) => Object.values(counts).some(v => v > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {hasData(data.topFurniture) && (
        <div className="rounded-xl border bg-white shadow-sm p-6 flex flex-col items-center">
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4 w-full text-center">Top Muebles</h3>
          <div className="h-[220px] w-full">
            <Doughnut data={buildDonutData(data.topFurniture, palette1)} options={commonDonutOptions} />
          </div>
        </div>
      )}

      {hasData(data.finishCounts) && (
        <div className="rounded-xl border bg-white shadow-sm p-6 flex flex-col items-center">
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4 w-full text-center">Acabados Preferidos</h3>
          <div className="h-[220px] w-full">
            <Doughnut data={buildDonutData(data.finishCounts, palette3)} options={commonDonutOptions} />
          </div>
        </div>
      )}

      {hasData(data.woodCounts) && (
        <div className="rounded-xl border bg-white shadow-sm p-6 flex flex-col items-center">
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4 w-full text-center">Maderas Preferidas</h3>
          <div className="h-[220px] w-full">
            <Doughnut data={buildDonutData(data.woodCounts, palette2)} options={commonDonutOptions} />
          </div>
        </div>
      )}
    </div>
  );
}

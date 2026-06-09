import { prisma } from "@/lib/prisma";
import OrderForm from "../OrderForm";
import Link from "next/link";

export default async function NuevoPedidoPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" }
  });
  
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <Link href="/admin/pedidos" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          &larr; Volver a Información
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Pedido</h1>
        <p className="text-muted-foreground mt-2">
          Registra un nuevo pedido, ya sea de un mueble del catálogo o personalizado.
        </p>
      </div>

      <OrderForm products={products} categories={categories} />
    </div>
  );
}

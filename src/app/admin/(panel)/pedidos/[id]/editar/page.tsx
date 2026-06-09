import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import OrderForm from "../../OrderForm";
import DeleteOrderButton from "../DeleteOrderButton";
import Link from "next/link";

export default async function EditarPedidoPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const order = await prisma.order.findUnique({
    where: { id }
  });

  if (!order) {
    notFound();
  }

  const products = await prisma.product.findMany({
    orderBy: { name: "asc" }
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <Link href={`/admin/pedidos/${id}`} className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          &larr; Volver al Pedido
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Pedido</h1>
          <p className="text-muted-foreground mt-2">
            Modifica los detalles financieros o el estado de este pedido.
          </p>
        </div>
        <div className="flex gap-2">
          <DeleteOrderButton id={order.id} />
        </div>
      </div>

      <OrderForm products={products} categories={categories} order={order} />
    </div>
  );
}

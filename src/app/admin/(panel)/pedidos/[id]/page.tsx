import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import DownloadPdfButton from "./DownloadPdfButton";
import { OrderStatus } from "@prisma/client";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "long",
  }).format(date);
}

export default async function PedidoPresentacionPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      product: true,
    }
  });

  if (!order) {
    notFound();
  }

  const itemName = order.productId ? order.product?.name : order.customFurnitureName;
  const debt = Math.max(0, order.totalBudget - order.advancePayment);

  return (
    <div className="space-y-6 pb-20">
      {/* Cabecera (Botones, no se imprimen) */}
      <div className="mb-4 flex flex-wrap gap-3">
        <Link href="/admin/pedidos" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          &larr; Volver a Información
        </Link>
        <div className="w-full h-0"></div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detalles del Pedido</h1>
        </div>
        <div className="flex gap-2">
          <DownloadPdfButton orderId={order.id} />
          <Link href={`/admin/pedidos/${order.id}/editar`} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-neutral-900 text-white shadow-sm hover:bg-neutral-800 h-9 px-4 py-2">
            Editar Pedido
          </Link>
        </div>
      </div>

      {/* Documento Imprimible (Contenedor Wrapper) */}
      <div className="max-w-4xl mx-auto mt-6">
        <div id="pdf-content" className="bg-white border rounded-xl shadow-sm p-8 md:p-12 w-full flex flex-col justify-between" style={{ minHeight: '100%' }}>
          
          <div>
            {/* Header Documento */}
            <div className="flex justify-between items-start border-b pb-10 mb-10">
              <div className="flex items-center gap-4">
                {/* Logo Placeholder */}
                <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center text-white font-serif text-2xl font-bold">
                  B
                </div>
                <div>
                  <h2 className="text-3xl font-serif font-bold text-neutral-900">Buitrago</h2>
                  <p className="text-base text-neutral-500 mt-1">Recibo de Pedido Oficial</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-neutral-900">Pedido #{order.id.slice(-6).toUpperCase()}</p>
                <p className="text-base text-neutral-500 mt-1">
                  Solicitado: {formatDate(order.orderDate || order.createdAt)}
                </p>
                {order.estimatedDeliveryDate && (
                  <p className="text-base font-medium text-amber-700 mt-1 bg-amber-50 inline-block px-3 py-1 rounded-md border border-amber-200/50">
                    Entrega estimada: {formatDate(order.estimatedDeliveryDate)}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              
              {/* Columna Izquierda: Cliente y Precios */}
              <div className="space-y-12">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">Información del Cliente</h3>
                  <p className="font-serif text-2xl font-bold text-neutral-900">{order.customerName}</p>
                  {order.whatsappNumber && (
                    <div className="mt-2">
                      <p className="text-neutral-600 text-base">WhatsApp: {order.whatsappNumber}</p>
                      <p className="mt-1 text-base" data-hide-pdf="true">
                        <a href={`https://wa.me/${order.whatsappNumber.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline font-medium">
                          Ver chat de WhatsApp
                        </a>
                      </p>
                    </div>
                  )}
                  {order.facebookChatLink && (
                    <p className="text-neutral-600 mt-2 text-base break-all" data-hide-pdf="true">
                      <a href={order.facebookChatLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Ver chat de Facebook
                      </a>
                    </p>
                  )}
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">Resumen Financiero</h3>
                  <div className="bg-neutral-50 rounded-xl p-6 border">
                    <div className="flex justify-between items-center mb-4 text-lg">
                      <span className="text-neutral-600">Presupuesto Total</span>
                      <span className="font-bold">{formatMoney(order.totalBudget)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 text-lg">
                      <span className="text-neutral-600">Abono Inicial</span>
                      <span className="font-bold text-green-700">{formatMoney(order.advancePayment)}</span>
                    </div>
                    <div className="pt-4 border-t border-neutral-200 flex justify-between items-center">
                      <span className="font-medium text-neutral-900 text-lg">Saldo Restante</span>
                      <span className="font-black text-2xl text-orange-600">{formatMoney(debt)}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">Estado del Pedido</h3>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-bold ${
                    order.status === OrderStatus.COMPLETED ? "bg-green-100 text-green-800" :
                    order.status === OrderStatus.CANCELLED ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {order.status === OrderStatus.COMPLETED ? "Realizado" :
                     order.status === OrderStatus.CANCELLED ? "Cancelado" : "Pendiente"}
                  </span>
                </section>
              </div>

              {/* Columna Derecha: Mueble y Detalles */}
              <div className="space-y-10">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">Mueble Solicitado</h3>
                  
                  {order.productId && order.product?.image && (
                    <div className="mb-6 rounded-xl overflow-hidden border border-neutral-200 relative bg-neutral-50 flex items-center justify-center p-2" style={{ maxHeight: '300px' }}>
                      {/* Usamos el proxy nativo de Next.js para evitar errores CORS en html-to-image y que no se rompa la foto */}
                      <img 
                        src={`/_next/image?url=${encodeURIComponent(order.product.image)}&w=1080&q=75`} 
                        alt={itemName || ""} 
                        className="w-full h-full object-contain" 
                        style={{ maxHeight: '280px' }}
                      />
                    </div>
                  )}
                  
                  <h4 className="font-serif text-3xl font-bold text-neutral-900 mb-6">{itemName}</h4>
                  
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-lg border-t border-b py-6">
                    <div>
                      <span className="block text-neutral-500 mb-1 text-sm font-bold uppercase">Medidas</span>
                      <span className="font-medium text-neutral-900">{order.dimensions || "—"}</span>
                    </div>
                    <div>
                      <span className="block text-neutral-500 mb-1 text-sm font-bold uppercase">Madera</span>
                      <span className="font-medium text-neutral-900">{order.wood || "—"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-neutral-500 mb-1 text-sm font-bold uppercase">Acabado (Pintura/Barniz)</span>
                      <span className="font-medium text-neutral-900">{order.finish || "—"}</span>
                    </div>
                  </div>
                </section>

                {order.customDescription && (
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">Notas Adicionales</h3>
                    <div className="bg-amber-50/50 border border-amber-200/60 p-6 rounded-xl text-lg text-neutral-800 whitespace-pre-wrap">
                      {order.customDescription}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>

          {/* Footer Documento */}
          <div className="mt-24 pt-10 border-t border-neutral-200 text-center text-sm text-neutral-400">
            <p className="font-bold text-neutral-500 text-base">Buitrago - Carpintería y Diseño de Autor</p>
            <p className="mt-2">Documento generado automáticamente el {formatDate(new Date())}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

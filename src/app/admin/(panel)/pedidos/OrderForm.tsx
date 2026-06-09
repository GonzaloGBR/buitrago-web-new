"use client";

import { useState, useActionState } from "react";
import { OrderStatus, Product, Category } from "@prisma/client";
import { createOrderAction, updateOrderAction, OrderFormState } from "@/app/admin/actions/orders";

export default function OrderForm({ 
  products, 
  categories,
  order = null 
}: { 
  products: Product[]; 
  categories: Category[];
  order?: any 
}) {
  const isEditing = !!order;
  const [isCustom, setIsCustom] = useState(isEditing ? !order.productId : false);
  const [selectedProductId, setSelectedProductId] = useState<string>(order?.productId || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    order?.productId ? (products.find(p => p.id === order.productId)?.categorySlug || "") : ""
  );

  const filteredProducts = products.filter(p => !selectedCategory || p.categorySlug === selectedCategory);
  const [state, formAction, pending] = useActionState<OrderFormState, FormData>(
    isEditing ? updateOrderAction.bind(null, order.id) : createOrderAction,
    null
  );

  return (
    <form action={formAction} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border shadow-sm">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {state.error}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-medium text-lg border-b pb-2">Información del Cliente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre del Cliente *</label>
            <input 
              type="text" 
              name="customerName" 
              defaultValue={order?.customerName}
              required
              className="w-full flex h-10 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">WhatsApp</label>
            <input 
              type="text" 
              name="whatsappNumber" 
              defaultValue={order?.whatsappNumber || ""}
              placeholder="+57 300 000 0000"
              className="w-full flex h-10 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Link al Chat de Facebook</label>
            <input 
              type="url" 
              name="facebookChatLink" 
              defaultValue={order?.facebookChatLink || ""}
              placeholder="https://facebook.com/messages/t/..."
              className="w-full flex h-10 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg border-b pb-2">Detalles del Mueble</h3>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              checked={!isCustom} 
              onChange={() => setIsCustom(false)} 
              className="accent-neutral-900"
            />
            Mueble del Catálogo
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              checked={isCustom} 
              onChange={() => setIsCustom(true)} 
              className="accent-neutral-900"
            />
            Mueble Personalizado
          </label>
        </div>

        {!isCustom ? (
          <div className="space-y-4">
            <input type="hidden" name="productId" value={selectedProductId} />
            <div className="space-y-2">
              <label className="text-sm font-medium">1. Seleccionar Categoría</label>
              <select 
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedProductId("");
                }}
                className="w-full flex h-10 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
              >
                <option value="">-- Todas las categorías --</option>
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">2. Seleccionar Mueble *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
                {filteredProducts.length === 0 ? (
                  <p className="text-sm text-neutral-500 col-span-full">No hay muebles en esta categoría.</p>
                ) : (
                  filteredProducts.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProductId(p.id)}
                      className={`relative rounded-lg border-2 p-2 text-left transition-all flex flex-col ${
                        selectedProductId === p.id ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-300 bg-white"
                      }`}
                    >
                      {p.image ? (
                        <div className="aspect-square w-full rounded-md overflow-hidden bg-neutral-100 mb-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="aspect-square w-full rounded-md bg-neutral-100 mb-2 flex items-center justify-center text-xs text-neutral-400">
                          Sin foto
                        </div>
                      )}
                      <span className="block text-xs font-medium truncate w-full">{p.name}</span>
                    </button>
                  ))
                )}
              </div>
              {!selectedProductId && (
                <p className="text-xs text-red-500 mt-1">Debes hacer clic en uno de los muebles para seleccionarlo.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre del Mueble Personalizado *</label>
              <input 
                type="text" 
                name="customFurnitureName" 
                defaultValue={order?.customFurnitureName || ""}
                required={isCustom}
                className="w-full flex h-10 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
              />
            </div>
          </div>
        )}

        <div className="space-y-2 pt-4">
          <label className="text-sm font-medium">Descripción / Notas Adicionales</label>
          <textarea 
            name="customDescription" 
            defaultValue={order?.customDescription || ""}
            rows={3}
            placeholder="Añade especificaciones, detalles extra o información adicional sobre el mueble..."
            className="w-full flex rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent resize-y"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <label className="text-sm font-medium">Medidas</label>
            <input 
              type="text" 
              name="dimensions" 
              defaultValue={order?.dimensions || ""}
              placeholder="Ej. 120x60x80"
              className="w-full flex h-10 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Acabado (Pintura/Barniz)</label>
            <select 
              name="finish" 
              defaultValue={order?.finish || ""}
              className="w-full flex h-10 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
            >
              <option value="">-- Seleccionar --</option>
              <option value="Brillante">Brillante</option>
              <option value="Semi-brillante">Semi-brillante</option>
              <option value="Mate">Mate</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Madera</label>
            <select 
              name="wood" 
              defaultValue={order?.wood || ""}
              className="w-full flex h-10 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
            >
              <option value="">-- Seleccionar --</option>
              <option value="Cedro">Cedro</option>
              <option value="Petiribi">Petiribi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg border-b pb-2">Finanzas, Fechas y Estado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Presupuesto Total ($) *</label>
            <input 
              type="text" 
              name="totalBudget" 
              defaultValue={order?.totalBudget || 0}
              required
              className="w-full flex h-10 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Abono Inicial ($) *</label>
            <input 
              type="text" 
              name="advancePayment" 
              defaultValue={order?.advancePayment || 0}
              required
              className="w-full flex h-10 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha de Solicitud (Pedido)</label>
            <input 
              type="date" 
              name="orderDate" 
              defaultValue={order?.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
              className="w-full flex h-10 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha Estimada de Entrega</label>
            <input 
              type="date" 
              name="estimatedDeliveryDate" 
              defaultValue={order?.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toISOString().split('T')[0] : ""}
              className="w-full flex h-10 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
            />
          </div>
          {isEditing && (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Estado del Pedido</label>
              <select 
                name="status" 
                defaultValue={order?.status || OrderStatus.PENDING}
                className="w-full flex h-10 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
              >
                <option value={OrderStatus.PENDING}>Pendiente</option>
                <option value={OrderStatus.COMPLETED}>Realizado</option>
                <option value={OrderStatus.CANCELLED}>Cancelado</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <a 
          href="/admin/pedidos"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border bg-white hover:bg-neutral-100 h-10 px-4 py-2"
        >
          Cancelar
        </a>
        <button 
          type="submit" 
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-neutral-900 text-white hover:bg-neutral-800 h-10 px-4 py-2 disabled:opacity-50"
        >
          {pending ? "Guardando..." : isEditing ? "Actualizar Pedido" : "Crear Pedido"}
        </button>
      </div>
    </form>
  );
}

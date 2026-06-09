"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/app/admin/actions/guard";
import { OrderStatus } from "@prisma/client";

export type OrderFormState = { error?: string } | null;

function parseFields(formData: FormData) {
  const customerName = String(formData.get("customerName") ?? "").trim();
  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim() || null;
  const facebookChatLink = String(formData.get("facebookChatLink") ?? "").trim() || null;
  
  const productId = String(formData.get("productId") ?? "").trim() || null;
  const customFurnitureName = String(formData.get("customFurnitureName") ?? "").trim() || null;
  const customDescription = String(formData.get("customDescription") ?? "").trim() || null;
  
  const dimensions = String(formData.get("dimensions") ?? "").trim() || null;
  const finish = String(formData.get("finish") ?? "").trim() || null;
  const wood = String(formData.get("wood") ?? "").trim() || null;
  
  const statusStr = String(formData.get("status") ?? "PENDING").trim() as OrderStatus;
  const status = Object.values(OrderStatus).includes(statusStr) ? statusStr : OrderStatus.PENDING;
  
  // Sanitizar formato numérico argentino: "180.000,50" -> "180000.50"
  const parseMoney = (val: string) => {
    const sanitized = val.replace(/\./g, "").replace(/,/g, ".");
    return parseFloat(sanitized);
  };

  const totalBudget = parseMoney(String(formData.get("totalBudget") ?? "0"));
  const advancePayment = parseMoney(String(formData.get("advancePayment") ?? "0"));

  const orderDateRaw = String(formData.get("orderDate") ?? "").trim();
  const estimatedDeliveryDateRaw = String(formData.get("estimatedDeliveryDate") ?? "").trim();

  // Parse dates appending T12:00:00Z to prevent midnight timezone shifting (-1 day)
  const orderDate = orderDateRaw ? new Date(`${orderDateRaw}T12:00:00Z`) : null;
  const estimatedDeliveryDate = estimatedDeliveryDateRaw ? new Date(`${estimatedDeliveryDateRaw}T12:00:00Z`) : null;

  return {
    customerName,
    whatsappNumber,
    facebookChatLink,
    productId,
    customFurnitureName,
    customDescription,
    dimensions,
    finish,
    wood,
    status,
    totalBudget: isNaN(totalBudget) ? 0 : totalBudget,
    advancePayment: isNaN(advancePayment) ? 0 : advancePayment,
    orderDate: orderDate && !isNaN(orderDate.getTime()) ? orderDate : null,
    estimatedDeliveryDate: estimatedDeliveryDate && !isNaN(estimatedDeliveryDate.getTime()) ? estimatedDeliveryDate : null,
  };
}

export async function createOrderAction(
  _prev: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  await assertAdmin();
  const f = parseFields(formData);

  if (!f.customerName) {
    return { error: "El nombre del cliente es obligatorio." };
  }

  if (!f.productId && !f.customFurnitureName) {
    return { error: "Debes seleccionar un producto existente o escribir el nombre de un mueble personalizado." };
  }

  let newOrderId: string;
  try {
    const order = await prisma.order.create({
      data: f,
    });
    newOrderId = order.id;
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { error: `Error: ${error?.message || "Desconocido"}` };
  }

  revalidatePath("/admin/pedidos");
  redirect(`/admin/pedidos/${newOrderId}?ok=1`);
}

export async function updateOrderAction(
  id: string,
  _prev: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  await assertAdmin();
  const f = parseFields(formData);

  if (!f.customerName) {
    return { error: "El nombre del cliente es obligatorio." };
  }

  if (!f.productId && !f.customFurnitureName) {
    return { error: "Debes seleccionar un producto existente o escribir el nombre de un mueble personalizado." };
  }

  try {
    await prisma.order.update({
      where: { id },
      data: f,
    });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return { error: `Error: ${error?.message || "Desconocido"}` };
  }

  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
  redirect(`/admin/pedidos/${id}?ok=1`);
}

export async function updateOrderStatusAction(
  id: string,
  status: OrderStatus
): Promise<{ error?: string; success?: boolean }> {
  await assertAdmin();
  try {
    await prisma.order.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/pedidos");
    revalidatePath(`/admin/pedidos/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { error: "No se pudo actualizar el estado." };
  }
}

export async function deleteOrderAction(
  id: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData?: FormData
): Promise<void> {
  await assertAdmin();
  try {
    await prisma.order.delete({ where: { id } });
  } catch (error: any) {
    console.error("Error al eliminar pedido:", error);
    return; // ideally return state, but redirect handles it in original Next logic if we handled errors, for now let's just use redirect for failure/success outside
  }
  
  revalidatePath("/admin/pedidos");
  redirect("/admin/pedidos?deleted=1");
}

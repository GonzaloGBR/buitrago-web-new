import { prisma } from "./src/lib/prisma";

async function main() {
  try {
    const order = await prisma.order.create({
      data: {
        customerName: "Test User",
        totalBudget: 100,
        advancePayment: 50,
        customFurnitureName: "Test Furniture",
        // dimensions: "10x10", // omitting these for now to see if it's the client schema issue
      }
    });
    console.log("Success:", order.id);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().finally(() => process.exit(0));

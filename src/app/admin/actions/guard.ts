"use server";

import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";

export async function assertAdmin() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}

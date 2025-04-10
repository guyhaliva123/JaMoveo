"use server";

import { prisma } from "@/lib/db";

export async function checkAdminExists() {
  try {
    const admin = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });
    if (admin) {
      console.log("Admin exists");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking admin count:", error);
    return false;
  }
}

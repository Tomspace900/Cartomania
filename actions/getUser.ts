"use server";

import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUser() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        console.error("Utilisateur introuvable");
        return undefined;
      }
      return user;
    } else {
      console.error("Utilisateur introuvable");
      return undefined;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return undefined;
  }
}

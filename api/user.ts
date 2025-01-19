'use server';

import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCurrentUser() {
	try {
		const session = await auth();
		const userId = session?.user?.id;

		if (!userId) {
			console.error('Utilisateur introuvable');
			return undefined;
		}

		return getUser(userId);
	} catch (error) {
		console.error("Erreur lors de la récupération de l'utilisateur :", error);
		return undefined;
	}
}

export async function getUsers() {
	try {
		const users = await prisma.user.findMany();
		return users;
	} catch (error) {
		console.error('Erreur lors de la récupération des utilisateurs :', error);
		return [];
	}
}

export async function getUser(id: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			console.error('Utilisateur introuvable');
			return undefined;
		}

		return user;
	} catch (error) {
		console.error("Erreur lors de la récupération de l'utilisateur :", error);
		return undefined;
	}
}

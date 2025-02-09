'use server';

import { PrismaClient, GameType, RegionCode, Score } from '@prisma/client';

const prisma = new PrismaClient();

export async function getScoreById(id: string) {
	try {
		const score = await prisma.score.findUnique({
			where: { id },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
				gameMode: true,
				region: true,
			},
		});
		return score;
	} catch (error) {
		console.error('Error fetching score:', error);
		throw new Error('Failed to fetch score');
	}
}

export type TopScore = {
	id: string;
	time: number;
	errors: number;
	completed: boolean;
	user?: {
		id: string;
		name: string | null;
		image: string | null;
	};
	gameMode: {
		id: number;
		type: GameType;
	};
	region: {
		id: number;
		code: RegionCode;
	};
};

export async function getUserTopScores(
	userId: string,
	gameType: GameType,
	regionCode: RegionCode,
	limit: number = 5
): Promise<TopScore[]> {
	try {
		const gameMode = await prisma.gameMode.findUnique({
			where: { type: gameType },
		});
		const region = await prisma.region.findUnique({
			where: { code: regionCode },
		});

		if (!gameMode || !region) {
			throw new Error('GameMode or Region not found');
		}

		const scores = await prisma.score.findMany({
			where: {
				userId,
				gameModeId: gameMode.id,
				regionId: region.id,
				completed: true,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
				gameMode: true,
				region: true,
			},
			orderBy: [{ score: 'asc' }, { errors: 'asc' }, { time: 'asc' }, { createdAt: 'asc' }],
			take: limit,
		});
		return scores;
	} catch (error) {
		console.error('Error fetching user scores:', error);
		throw new Error('Failed to fetch user scores');
	}
}

export async function getTopScores(gameType: GameType, regionCode: RegionCode, limit: number = 10): Promise<TopScore[]> {
	try {
		const gameMode = await prisma.gameMode.findUnique({
			where: { type: gameType },
		});
		const region = await prisma.region.findUnique({
			where: { code: regionCode },
		});

		if (!gameMode || !region) {
			throw new Error('GameMode or Region not found');
		}

		const scores = await prisma.score.findMany({
			where: {
				gameModeId: gameMode.id,
				regionId: region.id,
				completed: true,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
				gameMode: true,
				region: true,
			},
			orderBy: [{ score: 'asc' }, { errors: 'asc' }, { time: 'asc' }, { createdAt: 'asc' }],
			take: limit,
		});
		return scores;
	} catch (error) {
		console.error('Error fetching top scores:', error);
		throw new Error('Failed to fetch top scores');
	}
}

export interface ICreateScore {
	userId: string;
	gameType: GameType;
	regionCode: RegionCode;
	time: number;
	errors: number;
	completed: boolean;
}

export async function createScore({ userId, gameType, regionCode, time, errors, completed }: ICreateScore): Promise<Score> {
	try {
		const gameMode = await prisma.gameMode.findUnique({
			where: { type: gameType },
		});
		const region = await prisma.region.findUnique({
			where: { code: regionCode },
		});

		if (!gameMode || !region) {
			throw new Error('GameMode or Region not found');
		}

		const score = await prisma.score.create({
			data: {
				userId,
				gameModeId: gameMode.id,
				regionId: region.id,
				time,
				errors,
				score: 0, // ! Jsp comment calculer le score
				completed,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
				gameMode: true,
				region: true,
			},
		});

		// ! Si des soucis de MaJ, ajouter un revalidatePath ici

		return score;
	} catch (error) {
		console.error('Error creating score:', error);
		throw new Error('Failed to create score');
	}
}

export async function updateScore(
	id: string,
	data: {
		time?: number;
		errors?: number;
		completed?: boolean;
	}
) {
	try {
		const score = await prisma.score.update({
			where: { id },
			data,
			include: {
				user: {
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
				gameMode: true,
				region: true,
			},
		});

		return score;
	} catch (error) {
		console.error('Error updating score:', error);
		throw new Error('Failed to update score');
	}
}

export async function deleteScore(id: string) {
	try {
		const score = await prisma.score.delete({
			where: { id },
		});

		return score;
	} catch (error) {
		console.error('Error deleting score:', error);
		throw new Error('Failed to delete score');
	}
}

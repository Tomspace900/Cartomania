import continents from '@/ressources/continents';
import { PrismaClient, GameType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	// Game Modes
	await prisma.gameMode.createMany({
		data: [
			{
				type: GameType.FLAGS,
				name: 'Flag Quiz',
				description: 'Test your knowledge of world flags by identifying the correct country flag',
			},
			{
				type: GameType.LOCATION,
				name: 'Location Challenge',
				description: 'Place countries accurately on the world map',
			},
			{
				type: GameType.CAPITALS,
				name: 'Capital Cities',
				description: 'Match countries with their capital cities',
			},
		],
		skipDuplicates: true,
	});

	// Regions
	const regions = continents.map(({ name, code, latLng }) => ({
		name,
		code,
		latitude: latLng.latitude,
		longitude: latLng.longitude,
	}));
	await prisma.region.createMany({
		data: [...regions],
		skipDuplicates: true,
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

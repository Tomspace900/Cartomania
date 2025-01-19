import { TopScore } from '@/api/score';
import { useUser } from '@/hooks/useUser';
import { Score } from '@prisma/client';
import { Ban, Hourglass, LoaderIcon, Medal, Trophy } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { cn } from './ui/utils';
import { formatTimer } from '@/lib/utils';

interface ITopScoresProps {
	topScores?: TopScore[];
	currentScore?: Score | null;
}

const TopScores = ({ topScores, currentScore }: ITopScoresProps) => {
	const { user } = useUser();

	return (
		<div className="bg-primary/10 dark:bg-white/10 backdrop-blur-sm rounded-lg p-4 w-[400px] max-w-full">
			<h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary dark:text-white">
				<Trophy className="h-7 w-7" />
				Best scores
			</h3>
			<div className="space-y-2">
				{topScores ? (
					topScores.slice(0, 10).map((score, index) => <ScoreLine key={score.id} score={score} index={index} />)
				) : (
					<div className="w-full flex justify-center">
						<LoaderIcon className="h-10 w-10 animate-spin" />
					</div>
				)}
				{currentScore?.completed && user && (
					<div className="pt-4">
						<ScoreLine score={{ user: user, time: currentScore.time, errors: currentScore.errors }} index={-1} />
					</div>
				)}
			</div>
		</div>
	);
};

function podiumClassName(index: number) {
	switch (index) {
		case -1:
			return 'bg-green-300/80 dark:bg-green-300/80';
		case 0:
			return 'bg-yellow-300/80 dark:bg-yellow-300/80';
		case 1:
			return 'bg-gray-300/70 dark:bg-gray-300/70';
		case 2:
			return 'bg-yellow-600/60 dark:bg-yellow-600/60';
		default:
			return 'bg-primary/20 dark:bg-white/20';
	}
}

interface IScoreLineProps {
	score: { id?: string; user: { name: string | null; image: string | null }; time: number; errors: number };
	index: number;
	className?: string;
}

const ScoreLine = ({ score, index, className }: IScoreLineProps) => {
	const newScore = index < 0;

	return (
		<div
			key={score.id}
			className={cn('flex items-center justify-between py-2 px-4 rounded text-lg', podiumClassName(index), className)}
		>
			<div className="flex items-center gap-4">
				<span>{newScore ? 'New' : index < 3 ? <Medal className="h-6 w-6" /> : `#${index + 1}`}</span>
				{score.user.image && (
					<Image src={score.user.image} alt="profile-pic" width={30} height={30} className="rounded-full" />
				)}
			</div>
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-1">
					{formatTimer(score.time)}
					<Hourglass className="h-5 w-5" />
				</div>
				<div className="flex items-center gap-1 text-red-500">
					{score.errors}
					<Ban className="h-5 w-5" />
				</div>
			</div>
		</div>
	);
};

export default TopScores;

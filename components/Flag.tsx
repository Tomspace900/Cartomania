'use client';

import Image from 'next/image';
import { GameCountry, QuestionStatus, useGameState } from '@/contexts/GameContext';
import { useState } from 'react';

interface FlagProps {
	country: GameCountry;
	isLazy?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_FLAGCDN_BASE_URL;

export const Flag = ({ country, isLazy }: FlagProps) => {
	const [status, setStatus] = useState<QuestionStatus>('idle');
	const { questionStatus, handleClickedCountry, gameState } = useGameState();

	const isDisabled = gameState !== 'playing' || (status !== 'incorrect' && country.disabled);

	const src = `${API_URL}/w320/${country.cca2.toLowerCase()}.webp`;

	const handleClick = () => {
		if (isDisabled || questionStatus !== 'idle') return;
		const result = handleClickedCountry(country);
		setStatus(result);
		setTimeout(() => setStatus('idle'), 500);
	};

	return (
		<div
			className={`rounded-md ${questionStatus === 'idle' ? 'cursor-pointer' : 'pointer-events-none'} hover:scale-105 transition-transform duration-200 ease-in-out ${
				isDisabled
					? 'pointer-events-none opacity-40'
					: status === 'incorrect'
						? 'error-shake error-red'
						: status === 'correct'
							? 'success-bounce success-green'
							: ''
			}`}
		>
			<Image
				onClick={handleClick}
				src={src}
				alt={`${country.cca3}_flag`}
				width={130}
				height={90}
				className="rounded-md shadow-md h-auto"
				loading={isLazy ? 'lazy' : 'eager'}
			/>
		</div>
	);
};

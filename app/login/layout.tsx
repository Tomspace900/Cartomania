import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

const prisma = new PrismaClient();

const layout = async ({ children }: { children: React.ReactNode }) => {
	const users = await prisma.user.findMany();
	const session = await auth();

	if (session?.user) {
		redirect('/');
	}

	return (
		<div className="flex flex-col h-full w-full items-center justify-center">
			<div>
				All users :
				{users.map((user) => (
					<li key={user.id}>{user.email}</li>
				))}
			</div>
			{children}
		</div>
	);
};

export default layout;

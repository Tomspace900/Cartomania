'use server';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

const layout = async ({ children }: { children: React.ReactNode }) => {
	const session = await auth();

	if (session?.user) {
		redirect('/');
	}

	return <div className="flex flex-col h-full w-full items-center justify-center">{children}</div>;
};

export default layout;

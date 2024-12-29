import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

const layout = async ({ children }: { children: React.ReactNode }) => {
	const session = await auth();

	if (!session?.user) {
		redirect('/');
	}

	return <>{children}</>;
};

export default layout;

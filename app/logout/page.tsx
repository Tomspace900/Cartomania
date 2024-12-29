'use client';

import Loader from '@/components/Loader';
import { signOut } from 'next-auth/react';
import React from 'react';

const SignOut = () => {
	signOut({ callbackUrl: '/' });

	return (
		<div className="h-full items-center">
			<Loader text="Signing out..." />
		</div>
	);
};

export default SignOut;

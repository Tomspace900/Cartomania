'use client';

import { getUser } from '@/actions/getUser';
import { User } from '@prisma/client';
import { useEffect, useState } from 'react';

export function useUser() {
	const [user, setUser] = useState<User>();

	useEffect(() => {
		getUser().then((u) => setUser(u));
	}, []);

	const isAdmin = user?.role === 'admin';

	return {
		user,
		isAdmin,
	};
}

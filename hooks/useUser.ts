'use client';

import { getCurrentUser } from '@/api/user';
import { User } from '@prisma/client';
import { useEffect, useState } from 'react';

export function useUser() {
	const [user, setUser] = useState<User>();

	useEffect(() => {
		getCurrentUser().then((u) => setUser(u));
	}, []);

	const isAdmin = user?.role === 'admin';

	return {
		user,
		isAdmin,
	};
}

'use client';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { History, LogOut, Shield, User } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/hooks/userHooks';
import Image from 'next/image';

const ProfilePopover = () => {
	const { user, isAdmin } = useUser();

	return (
		user && (
			<Popover>
				<Button asChild variant={'secondary'}>
					<PopoverTrigger>
						<div className="hidden sm:block">{user.name}</div>
						<User className="sm:ml-2 h-4 w-4" />
					</PopoverTrigger>
				</Button>
				<PopoverContent className="flex flex-col gap-4 mx-4 w-fit min-w-[220px]">
					<div className="flex flex-col gap-2 px-2">
						<div className="flex items-center gap-4">
							{user.image && (
								<Image src={user.image} alt="profile-pic" width={40} height={40} className="rounded-full" />
							)}
							<span className="text-lg">{user.name}</span>
						</div>
						{/* {scores && scores.length > 0 && (
              <div className="flex justify-between text-lg">
                <span>{`Games played:`}</span>
                <span>{scores.length}</span>
              </div>
            )} */}
					</div>
					<div className="flex flex-col gap-2">
						{isAdmin && (
							<Button
								asChild
								variant="accent"
								// disabled={scores && scores.length > 0}
							>
								<Link href={'/admin/edit'}>
									Admin
									<Shield className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						)}

						{isAdmin && ( // Temporarily disabled for users: waiting for database
							<Button
								asChild
								// disabled={scores && scores.length > 0}
							>
								{/** // TODO */}
								<Link href={'/history'}>
									History
									<History className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						)}

						<Button asChild variant="destructive">
							<Link href={'/logout'}>
								Logout
								<LogOut className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		)
	);
};

export default ProfilePopover;

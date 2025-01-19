import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="text-center text-sm mt-auto mb-4 flex flex-col gap-2">
			<span className="flex gap-1">
				© {currentYear} Cartomania. All rights reserved.
				<Link href={'/privacy'} className="hover:text-muted-foreground flex items-center gap-1">
					Privacy policy <ExternalLink className="h-3 w-3" />
				</Link>
			</span>
			<span>Created by Thomas GENDRON</span>
		</footer>
	);
};

export default Footer;

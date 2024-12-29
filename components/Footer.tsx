import React from 'react';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="text-center text-sm mt-auto mb-4 flex flex-col gap-2">
			<span>© {currentYear} Cartomania. All rights reserved.</span>
			<span>Created by Thomas GENDRON</span>
		</footer>
	);
};

export default Footer;

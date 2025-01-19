import { NextRequest, NextResponse } from 'next/server';
import countries from '@/ressources/countries.json';
import { Country } from '@/ressources/types';

export async function GET(request: NextRequest, { params }: { params: Promise<{ code?: string }> }) {
	const { code: countryCode } = await params;
	const searchParams = request.nextUrl.searchParams;
	const unMembersOnly = searchParams.get('UN') !== null;

	let countryList = countries as unknown as Country[];

	if (unMembersOnly) {
		countryList = countryList.filter((country: Country) => country.UNMember);
	}

	if (!countryCode) {
		return NextResponse.json(countryList);
	}

	if (Array.isArray(countryCode)) {
		return NextResponse.json({ error: 'Invalid country code' }, { status: 400 });
	}

	const country = countryList.find(
		(c: Country) => c.cca2 === countryCode.toUpperCase() || c.cca3 === countryCode.toUpperCase()
	);

	if (!country) {
		return NextResponse.json({ error: 'Country not found' }, { status: 404 });
	}

	return NextResponse.json(country);
}

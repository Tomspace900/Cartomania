import { NextRequest, NextResponse } from 'next/server';
import countries from '@/ressources/countries.json';
import { Country } from '@/ressources/types';

export async function GET(request: NextRequest, { params }: { params: Promise<{ code?: string }> }) {
	const { code: countryCode } = await params;

	if (!countryCode) {
		return NextResponse.json(countries as unknown as Country[]);
	}

	if (Array.isArray(countryCode)) {
		return NextResponse.json({ error: 'Invalid country code' }, { status: 400 });
	}

	const country = (countries as unknown as Country[]).find(
		(c: Country) => c.cca2 === countryCode.toUpperCase() || c.cca3 === countryCode.toUpperCase()
	);

	if (!country) {
		return NextResponse.json({ error: 'Country not found' }, { status: 404 });
	}

	return NextResponse.json(country);
}

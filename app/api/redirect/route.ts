import { NextResponse } from 'next/server';

export async function GET() {
  // Redirect to the custom URL scheme
  return NextResponse.redirect('sikafx://volume/callback', 302);
}


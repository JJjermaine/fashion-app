import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Generate a signature for a secure upload
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    // Ensure your secret is correctly accessed from environment variables
    process.env.CLOUDINARY_API_SECRET as string
  );

  return NextResponse.json({ signature, timestamp });
}
import cloudinary from '@/lib/cloudinary'; // <-- Import your configured instance
import { NextResponse } from 'next/server';

// This function will securely sign parameters for a direct client-side upload
export async function POST(request: Request) {
  try {
    const timestamp = Math.round((new Date()).getTime() / 1000);

    // Generate the signature on the server
    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
    }, process.env.CLOUDINARY_API_SECRET as string);

    return NextResponse.json({ signature, timestamp });
  } catch (error) {
    console.error('Error signing Cloudinary params:', error);
    return NextResponse.json({ error: 'Failed to sign Cloudinary params' }, { status: 500 });
  }
}
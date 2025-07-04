// /api/delete-cloudinary-image/route.ts

import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary'; // Import your configured instance

export async function POST(req: NextRequest) {
  try {
    const { public_id } = await req.json();

    if (!public_id) {
      return NextResponse.json({ error: 'Missing public_id' }, { status: 400 });
    }

    // The SDK handles all the complex authentication and request signing for you
    const result = await cloudinary.uploader.destroy(public_id);

    // Check the result from the SDK call
    if (result.result === 'ok') {
      return NextResponse.json({ success: true });
    } else {
      // If it's not 'ok', it could be 'not found' or an error
      console.error('Cloudinary deletion failed:', result);
      return NextResponse.json(
        { error: `Cloudinary error: ${result.result}`, details: result },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in delete-cloudinary-image route:', error);
    return NextResponse.json(
      { error: 'Failed to delete image due to a server error.' },
      { status: 500 }
    );
  }
}
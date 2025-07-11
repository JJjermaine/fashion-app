// app/api/news/route.ts
import { NextResponse } from 'next/server';

// In-memory cache for development (in production, consider Redis or similar)
let cache: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export async function GET() {
  const apiKey = process.env.NEWS_API;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'News API key is not configured' },
      { status: 500 }
    );
  }

  // Check if we have valid cached data
  const now = Date.now();
  if (cache && (now - cache.timestamp) < CACHE_DURATION) {
    console.log('Returning cached news data');
    return NextResponse.json(cache.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600', // 30 min cache, 1 hour stale
        'X-Cache': 'HIT'
      }
    });
  }

  const query = "fashion trends";
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    query
  )}&apiKey=${apiKey}&language=en&sortBy=publishedAt&pageSize=10`;

  try {
    console.log('Fetching fresh news data from API');
    const response = await fetch(url, {
      next: { revalidate: 1800 } // Next.js cache for 30 minutes
    });
    
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update cache
    cache = {
      data,
      timestamp: now
    };

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // If we have stale cache data, return it as fallback
    if (cache) {
      console.log('Returning stale cached data due to API error');
      return NextResponse.json(cache.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
          'X-Cache': 'STALE'
        }
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
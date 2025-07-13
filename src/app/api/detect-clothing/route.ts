import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Roboflow API configuration
    const apiKey = process.env.ROBOFLOW_API;
    const modelId = "vision1-tffll/1";
    const apiUrl = "https://serverless.roboflow.com";

    // Make request to Roboflow API with correct format
    const response = await fetch(`${apiUrl}/${modelId}?api_key=${apiKey}&image=${encodeURIComponent(imageUrl)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Roboflow API error response:', errorText);
      throw new Error(`Roboflow API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    // Process the results to extract clothing items and brands
    const predictions = result.predictions || [];
    
    // Extract clothing categories and brands
    const clothingItems = predictions
      .filter((pred: any) => pred.confidence > 0.5) // Filter by confidence
      .map((pred: any) => ({
        class: pred.class,
        confidence: pred.confidence,
        type: 'clothing'
      }));

    // Group by clothing type and get the most confident predictions
    const clothingTypes = clothingItems.reduce((acc: any, item: any) => {
      if (!acc[item.class]) {
        acc[item.class] = item;
      } else if (item.confidence > acc[item.class].confidence) {
        acc[item.class] = item;
      }
      return acc;
    }, {});

    // Extract brands if available (you might need to adjust this based on actual API response)
    const brands = predictions
      .filter((pred: any) => pred.class && pred.class.toLowerCase().includes('brand'))
      .map((pred: any) => ({
        name: pred.class,
        confidence: pred.confidence,
        type: 'brand'
      }));

    return NextResponse.json({
      clothing: Object.values(clothingTypes),
      brands: brands.length > 0 ? brands : [],
      rawPredictions: predictions // Include raw data for debugging
    });

  } catch (error) {
    console.error('Error detecting clothing:', error);
    return NextResponse.json(
      { error: 'Failed to detect clothing items' },
      { status: 500 }
    );
  }
} 
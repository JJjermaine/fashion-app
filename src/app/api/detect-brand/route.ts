// pages/api/detect-brand-vertex.js
import type { NextApiRequest, NextApiResponse } from 'next';
const { PredictionServiceClient } = require("@google-cloud/aiplatform");
const { v4: uuidv4 } = require('uuid');

const project = process.env.GCLOUD_PROJECT;
const location = "us-central1"; // Or your preferred location
const endpointId = "celebrity-recognition_v1"; // Example endpoint for celebrity recognition

const clientOptions = {
  apiEndpoint: `${location}-aiplatform.googleapis.com`,
};

const client = new PredictionServiceClient(clientOptions);

async function detectBrand(imageUrl: string) {
  const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;

  // Download the image and convert to Base64
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const encodedImage = Buffer.from(imageBuffer).toString('base64');

  const instance = {
    content: encodedImage,
  };
  const parameters = {
    confidenceThreshold: 0.5,
    maxPredictions: 5,
  };

  const request = {
    endpoint,
    instances: [instance],
    parameters,
  };

  const [response] = await client.predict(request);
  return response.predictions;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    const predictions = await detectBrand(imageUrl);
    res.status(200).json(predictions);
  } catch (error) {
    console.error("Error with Vertex AI brand detection:", error);
    res.status(500).json({ error: 'Failed to detect brands with Vertex AI' });
  }
}
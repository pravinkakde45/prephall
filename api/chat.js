export default async function handler(req, res) {
  // Only allow POST requests for this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Missing Anthropic API Key in Environment Variables' });
  }

  try {
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      // Pass the frontend request body directly to the Anthropic API
      body: JSON.stringify(req.body)
    });

    // Parse the response from Anthropic
    const data = await anthropicResponse.json();
    
    // Send it back to the frontend
    return res.status(anthropicResponse.status).json(data);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to communicate with Anthropic API' });
  }
}

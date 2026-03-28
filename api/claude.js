// api/claude.js — Vercel serverless function
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured — check Vercel environment variables' })
  }

  try {
    // Safely parse body
    let body = req.body
    if (typeof body === 'string') {
      try { body = JSON.parse(body) } catch(e) {
        return res.status(400).json({ error: 'Invalid JSON in request body' })
      }
    }

    // Build a clean, minimal request to Anthropic
    const anthropicPayload = {
      model: body.model || 'claude-sonnet-4-6',
      max_tokens: body.max_tokens || 3000,
      messages: body.messages,
      ...(body.system ? { system: body.system } : {})
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(anthropicPayload),
    })

    const data = await response.json()

    // If Anthropic returns an error, include their full message
    if (!response.ok) {
      console.error('Anthropic error:', JSON.stringify(data))
      return res.status(response.status).json({
        error: `Anthropic API error ${response.status}: ${data?.error?.message || JSON.stringify(data)}`
      })
    }

    return res.status(200).json(data)

  } catch (error) {
    console.error('Proxy error:', error)
    return res.status(500).json({ error: 'Proxy error: ' + error.message })
  }
}
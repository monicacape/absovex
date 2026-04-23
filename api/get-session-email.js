import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'Missing sessionId' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || !session.customer_email) {
      return res.status(400).json({ error: 'Email not found in session' });
    }

    return res.status(200).json({ email: session.customer_email });
  } catch (error) {
    console.error('Stripe session retrieval error:', error);
    return res.status(500).json({ error: 'Failed to retrieve session' });
  }
}

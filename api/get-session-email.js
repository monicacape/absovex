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

    console.log('Session retrieved:', JSON.stringify(session, null, 2));
    console.log('Customer email field:', session.customer_email);
    console.log('Customer details:', session.customer_details);

    // Try different email field names
    const email = session.customer_email ||
                  session.customer?.email ||
                  session.customer_details?.email;

    if (!email) {
      console.error('No email found in session. Full session object logged above.');
      return res.status(400).json({ error: 'Email not found in session' });
    }

    return res.status(200).json({ email });
  } catch (error) {
    console.error('Stripe session retrieval error:', error);
    return res.status(500).json({ error: 'Failed to retrieve session' });
  }
}

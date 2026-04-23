import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { promoCode } = req.body || {};
  const origin = req.headers.origin || 'https://absovex.com';

  try {
    const sessionParams = {
      mode: 'payment',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${origin}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?cancelled=true`,
      allow_promotion_codes: true,
      custom_text: {
        submit: {
          message: "We'll email your report to this address. Please use a real email to receive it."
        }
      },
    };

    // Apply coupon if promo code matches STRIPE_COUPON_ID
    if (promoCode && process.env.STRIPE_COUPON_ID) {
      sessionParams.discounts = [{ coupon: process.env.STRIPE_COUPON_ID }];
      delete sessionParams.allow_promotion_codes;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return res.status(200).json({ sessionId: session.id, sessionUrl: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message });
  }
}

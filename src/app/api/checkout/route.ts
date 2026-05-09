import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
  apiVersion: '2025-02-24.acacia' as any,
});

// We need to define prices in our app or from env.
// Ideally these are Stripe Price IDs created in the dashboard.
// For the purpose of this task, we will create dynamic prices if they don't exist
// or just use generic amounts.
const PRICES = {
  pro: { amount: 1900, name: 'Pro Plan' },
  agency: { amount: 4900, name: 'Agency Plan' },
  lifetime: { amount: 9900, name: 'Lifetime Deal' }
};

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { plan } = await req.json();

    if (plan !== 'pro' && plan !== 'agency' && plan !== 'lifetime') {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const mode = plan === 'lifetime' ? 'payment' : 'subscription';

    const priceData: any = {
      currency: 'usd',
      product_data: {
        name: PRICES[plan as keyof typeof PRICES].name,
      },
      unit_amount: PRICES[plan as keyof typeof PRICES].amount,
    };

    if (mode === 'subscription') {
      priceData.recurring = { interval: 'month' };
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer_email: user.email,
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${appUrl}/tool?success=true`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      client_reference_id: user.id, // Pass user id to link in webhook
      metadata: {
        userId: user.id,
        plan: plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

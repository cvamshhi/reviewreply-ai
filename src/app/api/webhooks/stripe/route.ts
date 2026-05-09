import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
  apiVersion: '2025-02-24.acacia' as any,
});

// We need a Supabase service role client to bypass RLS in webhooks
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://dummy.com',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId && plan) {
      // Update user plan in Supabase
      // Works for both one-time payments (LTD) and subscriptions
      const { error } = await supabaseAdmin
        .from('users')
        .update({
          plan: plan,
          stripe_customer_id: session.customer as string,
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user plan:', error);
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    // When subscription is cancelled, revert to free plan
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    const { error } = await supabaseAdmin
        .from('users')
        .update({ plan: 'free' })
        .eq('stripe_customer_id', customerId);

    if (error) {
        console.error('Error reverting user plan:', error);
    }
  }

  return new NextResponse('OK', { status: 200 });
}

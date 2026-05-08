# ReviewReply.ai

A complete, production-ready web application built with Next.js 14, Tailwind CSS, Supabase, Stripe, and OpenAI.

This app allows small business owners to paste Google reviews and instantly generate professional, AI-crafted replies.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase
- **Payments:** Stripe
- **AI:** OpenAI GPT-4o API
- **Hosting:** Vercel

## Step-by-Step Setup Instructions

### 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to your project's **SQL Editor**.
3. Copy the contents of `database_schema.sql` from the root of this repository.
4. Paste the SQL into the editor and click **Run**. This will create the required `users`, `usage`, and `replies` tables, set up Row Level Security (RLS) policies, and create triggers and functions.
5. Go to **Project Settings > API** to find your URLs and Keys.

### 2. OpenAI Setup
1. Go to the [OpenAI Platform](https://platform.openai.com) and sign up/log in.
2. Navigate to **API Keys** and generate a new secret key.
3. Save this key; you will need it for the `.env` file.

### 3. Stripe Setup
1. Create a [Stripe](https://stripe.com) account and log in to the Dashboard.
2. Toggle "Test mode" on in the top right corner.
3. Go to **Products** and create two new products:
   - **Pro Plan:** Recurring, $19/month
   - **Agency Plan:** Recurring, $49/month
   *(Note: The code dynamically handles checkouts, but creating the actual products ensures your dashboard reporting works correctly).*
4. Go to **Developers > API keys** and copy your `Publishable key` and `Secret key`.
5. Go to **Developers > Webhooks** and add an endpoint.
   - Endpoint URL: `https://your-domain.com/api/webhooks/stripe` (use a service like ngrok for local testing, e.g., `https://your-ngrok-url.app/api/webhooks/stripe`).
   - Listen to events: `checkout.session.completed` and `customer.subscription.deleted`.
6. Reveal and copy the **Signing secret** (Webhook Secret).

### 4. Environment Variables
1. Rename `.env.example` to `.env.local` for local development.
2. Fill in the values:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Running Locally and Testing
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.
4. **Test the flow:**
   - Try the tool as a guest (limited to 3 tries via localStorage).
   - Sign up for a new account (creates auth user and inserts into public `users` and `usage` tables).
   - Use the tool up to 5 times to hit the free tier limit.
   - Click "Upgrade" and test the Stripe checkout flow. (Use a Stripe test card like `4242 4242 4242 4242` for successful payment).
   - *(Optional)* Trigger the Stripe webhook locally using the [Stripe CLI](https://stripe.com/docs/stripe-cli) to verify your plan updates to 'pro' or 'agency' in Supabase.

### 6. Deployment (Vercel)
1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com) and click **Add New > Project**.
3. Import your GitHub repository.
4. In the Vercel project settings, go to the **Environment Variables** section.
5. Add all the variables from your `.env.local` file (ensure `NEXT_PUBLIC_APP_URL` is set to your production Vercel URL).
6. Click **Deploy**. Vercel will automatically build and deploy your application.

## Features
- **Responsive Design:** Mobile-first approach using Tailwind CSS.
- **AI Integration:** Direct connection to OpenAI's GPT-4o model with specific reputation management prompts.
- **Tiered Access:** Guest limits, free tier month-over-month reset limits, and paid unlimited limits.
- **Webhook Handlers:** Secure server-side stripe subscription processing.
- **Added UX:** Copy to clipboard, download as `.txt`, share via WhatsApp, and live character counting.
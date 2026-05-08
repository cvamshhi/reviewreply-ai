-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  plan TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can read their own data." ON users
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update their own data." ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create usage table
CREATE TABLE usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  reply_count INTEGER DEFAULT 0,
  reset_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for usage
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own usage
CREATE POLICY "Users can read their own usage." ON usage
  FOR SELECT USING (auth.uid() = user_id);

-- Create replies table
CREATE TABLE replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  review_text TEXT,
  business_type TEXT,
  tone TEXT,
  generated_reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for replies
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own replies
CREATE POLICY "Users can read their own replies." ON replies
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own replies
CREATE POLICY "Users can insert their own replies." ON replies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger to create a user entry in the public.users table when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);

  -- Create initial usage record
  INSERT INTO public.usage (user_id, reply_count, reset_date)
  VALUES (new.id, 0, date_trunc('month', current_date) + interval '1 month');

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Increment usage helper for RPC
CREATE OR REPLACE FUNCTION increment_usage(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.usage
  SET reply_count = reply_count + 1
  WHERE id = row_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

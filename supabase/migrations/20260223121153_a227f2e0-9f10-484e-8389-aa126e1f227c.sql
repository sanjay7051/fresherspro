
-- Create payments table to track verified payments
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  razorpay_payment_id TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'verified',
  download_token UUID NOT NULL DEFAULT gen_random_uuid(),
  token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 hour'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- No direct client access - only edge functions with service role can insert/read
-- Public can check if a download token is valid (read-only, scoped to token)
CREATE POLICY "Allow token validation" ON public.payments
  FOR SELECT USING (download_token::text = current_setting('request.headers', true)::json->>'x-download-token');

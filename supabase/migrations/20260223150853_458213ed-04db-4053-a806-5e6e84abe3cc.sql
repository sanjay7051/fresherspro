
-- Drop old policy and create improved one with expiration check
DROP POLICY IF EXISTS "Allow token validation" ON public.payments;

CREATE POLICY "Allow token validation" ON public.payments
  FOR SELECT USING (
    download_token::text = current_setting('request.headers', true)::json->>'x-download-token'
    AND token_expires_at > now()
    AND status = 'verified'
  );

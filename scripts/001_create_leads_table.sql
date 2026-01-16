-- Create the leads table to store audit data
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Step 1: Business data
  monthly_visits INTEGER NOT NULL,
  checkout_rate DECIMAL(5,2) NOT NULL,
  conversion_rate DECIMAL(5,2) NOT NULL,
  product_price DECIMAL(12,2) NOT NULL,
  cac DECIMAL(12,2),
  
  -- Calculated values
  monthly_loss DECIMAL(12,2),
  annual_loss DECIMAL(12,2),
  true_value_per_lead DECIMAL(12,2),
  recovered_revenue DECIMAL(12,2),
  recovery_rate INTEGER,
  
  -- Step 6: Personal data
  name TEXT,
  email TEXT,
  whatsapp TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for lead capture)
CREATE POLICY "Allow anonymous inserts" ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow anonymous updates (for completing the form)
CREATE POLICY "Allow anonymous updates" ON public.leads
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create policy to allow service role full access
CREATE POLICY "Allow service role full access" ON public.leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads(email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);

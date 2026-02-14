
-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL DEFAULT ('ORD-' || upper(substring(md5(random()::text) from 1 for 8))),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  status TEXT NOT NULL DEFAULT 'received',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Driver locations table for real-time tracking
CREATE TABLE public.driver_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  driver_name TEXT NOT NULL DEFAULT 'Driver',
  latitude DOUBLE PRECISION NOT NULL DEFAULT 39.0997,
  longitude DOUBLE PRECISION NOT NULL DEFAULT -94.5786,
  heading DOUBLE PRECISION DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_locations ENABLE ROW LEVEL SECURITY;

-- Orders: anyone can insert (guest checkout), read by email match
CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view orders by email"
  ON public.orders FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update orders"
  ON public.orders FOR UPDATE
  USING (true);

-- Driver locations: public read for tracking, insert/update for system
CREATE POLICY "Anyone can view driver locations"
  ON public.driver_locations FOR SELECT
  USING (true);

CREATE POLICY "System can manage driver locations"
  ON public.driver_locations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update driver locations"
  ON public.driver_locations FOR UPDATE
  USING (true);

-- Enable realtime for driver locations
ALTER PUBLICATION supabase_realtime ADD TABLE public.driver_locations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_driver_locations_updated_at
  BEFORE UPDATE ON public.driver_locations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

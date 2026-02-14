import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Package, ChefHat, Truck, CheckCircle, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const driverIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const restaurantIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
});

// Kansas City restaurant coords
const RESTAURANT_COORDS: [number, number] = [39.0997, -94.5786];

const statusSteps = [
  { key: 'received', label: 'Received', icon: Package },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'in-transit', label: 'In Transit', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface DriverLocation {
  latitude: number;
  longitude: number;
  driver_name: string;
}

const TrackingPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [driverLoc, setDriverLoc] = useState<DriverLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      setOrder(data);
      setLoading(false);
    };

    const fetchDriver = async () => {
      const { data } = await supabase
        .from('driver_locations')
        .select('*')
        .eq('order_id', orderId)
        .single();
      if (data) setDriverLoc(data as DriverLocation);
    };

    fetchOrder();
    fetchDriver();

    // Real-time subscriptions
    const orderChannel = supabase
      .channel(`order-${orderId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, (payload) => {
        setOrder((prev: any) => ({ ...prev, ...payload.new }));
      })
      .subscribe();

    const driverChannel = supabase
      .channel(`driver-${orderId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'driver_locations', filter: `order_id=eq.${orderId}` }, (payload) => {
        setDriverLoc(payload.new as DriverLocation);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(driverChannel);
    };
  }, [orderId]);

  const currentStepIndex = order ? statusSteps.findIndex(s => s.key === order.status) : 0;
  const mapCenter: [number, number] = driverLoc
    ? [driverLoc.latitude, driverLoc.longitude]
    : RESTAURANT_COORDS;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 container mx-auto px-4 text-center">
          <p className="font-body text-muted-foreground">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Order Not Found</h1>
          <Link to="/orders" className="text-primary font-body font-semibold hover:underline">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 container mx-auto px-4 max-w-4xl">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm mb-6 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back to Orders
        </Link>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Track Order</h1>
            <p className="font-body text-sm text-muted-foreground">{order.order_number}</p>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <MapPin size={18} />
            <span className="font-body text-sm font-semibold">Live Tracking</span>
          </div>
        </div>

        {/* Status Progress */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex justify-between items-center">
            {statusSteps.map((step, i) => {
              const StepIcon = step.icon;
              const isActive = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={step.key} className="flex flex-col items-center flex-1 relative">
                  {i > 0 && (
                    <div className={`absolute top-5 right-1/2 w-full h-0.5 -z-10 ${
                      i <= currentStepIndex ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    isCurrent ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <StepIcon size={18} />
                  </div>
                  <span className={`font-body text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-6" style={{ height: '400px' }}>
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={mapCenter} />

            {/* Restaurant marker */}
            <Marker position={RESTAURANT_COORDS} icon={restaurantIcon}>
              <Popup>
                <strong>Swahili Coastal Hub</strong><br />
                1234 Main Street, Kansas City, KS
              </Popup>
            </Marker>

            {/* Driver marker */}
            {driverLoc && (
              <Marker position={[driverLoc.latitude, driverLoc.longitude]} icon={driverIcon}>
                <Popup>
                  <strong>{driverLoc.driver_name}</strong><br />
                  Your delivery driver
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Order Details */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">Order Details</h3>
          <div className="space-y-2 mb-4">
            {(order.items as any[]).map((item: any, i: number) => (
              <div key={i} className="flex justify-between font-body text-sm">
                <span className="text-foreground">{item.name} × {item.quantity}</span>
                <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 flex justify-between font-body font-bold text-lg">
            <span className="text-foreground">Total</span>
            <span className="text-primary">${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrackingPage;

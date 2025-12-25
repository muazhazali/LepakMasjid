import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Mosque } from '@/types';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MosqueMapProps {
  mosques: Mosque[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (mosque: Mosque) => void;
  className?: string;
}

// Component to fit map bounds to markers
function FitBounds({ mosques }: { mosques: Mosque[] }) {
  const map = useMap();

  useEffect(() => {
    if (mosques.length > 0) {
      const bounds = L.latLngBounds(
        mosques.map((m) => [m.lat, m.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, mosques]);

  return null;
}

export const MosqueMap = ({
  mosques,
  center = [3.1390, 101.6869], // Default to KL
  zoom = 11,
  onMarkerClick,
  className = 'h-[500px] w-full rounded-lg',
}: MosqueMapProps) => {
  const mapRef = useRef<L.Map | null>(null);

  if (mosques.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted rounded-lg`}>
        <p className="text-muted-foreground">No mosques to display on map</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={className}
      scrollWheelZoom={true}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mosques.map((mosque) => (
        <Marker
          key={mosque.id}
          position={[mosque.lat, mosque.lng]}
          eventHandlers={{
            click: () => onMarkerClick?.(mosque),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-sm">{mosque.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{mosque.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      <FitBounds mosques={mosques} />
    </MapContainer>
  );
};


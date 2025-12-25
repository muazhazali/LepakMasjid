import { useState, useEffect } from 'react';
import { MosqueMap } from './MosqueMap';
import type { Mosque } from '@/types';
import { useNavigate } from 'react-router-dom';

interface MapViewProps {
  mosques: Mosque[];
  className?: string;
}

export const MapView = ({ mosques, className }: MapViewProps) => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // User denied or error getting location
          setUserLocation(null);
        }
      );
    }
  }, []);

  const handleMarkerClick = (mosque: Mosque) => {
    navigate(`/mosque/${mosque.id}`);
  };

  const center = userLocation || (mosques.length > 0 
    ? [mosques[0].lat, mosques[0].lng] as [number, number]
    : [3.1390, 101.6869] as [number, number]); // Default to KL

  return (
    <div className={className}>
      <MosqueMap
        mosques={mosques}
        center={center}
        zoom={userLocation ? 13 : 11}
        onMarkerClick={handleMarkerClick}
      />
    </div>
  );
};


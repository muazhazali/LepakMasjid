import { useEffect, useState } from "react";
import polyline from "@mapbox/polyline";

export type RoutePoint = { lat: number; lon: number };

export function useRoutes(
  from: { lat: number; lon: number } | null,
  to: { lat: number; lon: number } | null
) {
  const [routes, setRoutes] = useState<RoutePoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    if (!from || !to) {
      setRoutes([]);
      return;
    }

    const fetchRoute = async () => {
      setLoading(true);

      const body = {
        origin: {
          location: { latLng: { latitude: from.lat, longitude: from.lon } },
        },
        destination: {
          location: { latLng: { latitude: to.lat, longitude: to.lon } },
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        routeModifiers: {
          avoidTolls: true,
          avoidHighways: false,
        },
      };

      try {
        const res = await fetch(
          "https://routes.googleapis.com/directions/v2:computeRoutes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_API_KEY,
              "X-Goog-FieldMask":
                "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
            },
            body: JSON.stringify(body),
          }
        );

        const data = await res.json();
        console.log(data);

        if (!data.routes?.length) {
          setRoutes([]);
          return;
        }

        const decoded = polyline.decode(
          data.routes[0].polyline.encodedPolyline
        );

        const distanceKm = data.routes[0].distanceMeters ;

        const durationSeconds = parseInt(
          data.routes[0].duration.replace("s", "")
        );
        const durationMinutes = durationSeconds ;

       
        setDistance(distanceKm)
        setDuration(durationMinutes)

        const routePoints: RoutePoint[] = decoded.map(
          ([lat, lon]: [number, number]) => ({
            lat,
            lon,
          })
        );

        setRoutes(routePoints);
      } catch (err) {
        console.error("Error fetching route:", err);
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [from, to]);

  return { loading, routes, duration, distance};
}

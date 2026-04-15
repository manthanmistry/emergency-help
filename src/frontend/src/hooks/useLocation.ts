import type { UserLocation } from "@/types";
import { useCallback, useState } from "react";

export interface LocationState {
  location: UserLocation | null;
  isLoading: boolean;
  error: string | null;
}

export function useLocation(): [
  UserLocation | null,
  () => void,
  boolean,
  string | null,
] {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
        setLocation({ lat, lng, mapsUrl });
        setIsLoading(false);
      },
      (err) => {
        const messages: Record<number, string> = {
          1: "Location access denied. Please allow location access.",
          2: "Unable to determine your location.",
          3: "Location request timed out. Please try again.",
        };
        setError(messages[err.code] ?? "Failed to get location.");
        setIsLoading(false);
      },
      { timeout: 10000, maximumAge: 30000 },
    );
  }, []);

  return [location, fetchLocation, isLoading, error];
}

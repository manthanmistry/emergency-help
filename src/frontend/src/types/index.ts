// Core domain types for Emergency Help app

export interface EmergencyService {
  id: string;
  name: string;
  phone: string;
  icon: string;
  color: "red" | "blue" | "orange" | "pink";
  description: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  mapsUrl: string;
}

export type Theme = "light" | "dark";

export interface AppState {
  theme: Theme;
  contacts: EmergencyContact[];
  userLocation: UserLocation | null;
}

export type ValidatorStatus = "active" | "inactive";

export type Validator = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  stake: number;
  status: ValidatorStatus;
  uptime: number;
};

type Location = {
  city: string;
  lat: number;
  lng: number;
};

const VALIDATOR_LOCATIONS: Location[] = [
  { city: "Warsaw", lat: 52.2297, lng: 21.0122 },
  { city: "London", lat: 51.5074, lng: -0.1278 },
  { city: "Paris", lat: 48.8566, lng: 2.3522 },
  { city: "Berlin", lat: 52.52, lng: 13.405 },
  { city: "Amsterdam", lat: 52.3676, lng: 4.9041 },
  { city: "Singapore", lat: 1.3521, lng: 103.8198 },
  { city: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { city: "Sydney", lat: -33.8688, lng: 151.2093 },
  { city: "New York", lat: 40.7128, lng: -74.006 },
  { city: "San Francisco", lat: 37.7749, lng: -122.4194 },
  { city: "Toronto", lat: 43.6532, lng: -79.3832 },
  { city: "São Paulo", lat: -23.5505, lng: -46.6333 },
  { city: "Dubai", lat: 25.2048, lng: 55.2708 },
  { city: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  { city: "Mumbai", lat: 19.076, lng: 72.8777 },
];

const MIN_STAKE = 1_000_000;
const MAX_EXTRA_STAKE = 9_000_000;

export function generateMockValidators(): Validator[] {
  return VALIDATOR_LOCATIONS.map((location, index) => {
    const isActive = Math.random() > 0.2;

    const stake = MIN_STAKE + Math.random() * MAX_EXTRA_STAKE;

    const uptime = isActive
      ? 98.5 + Math.random() * 1.5
      : 85 + Math.random() * 10;

    return {
      id: `iota_validator_${index.toString().padStart(8, "0")}`,
      name: `${location.city} Node ${index + 1}`,
      lat: location.lat,
      lng: location.lng,
      stake,
      status: isActive ? "active" : "inactive",
      uptime,
    };
  });
}
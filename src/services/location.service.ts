import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

export type LocationCoords = {
  latitude: number;
  longitude: number;
};

export type ResolvedAddress = {
  displayName: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

export type CurrentLocationResult = {
  coords: LocationCoords;
  /** Readable label for the Location field (falls back to coordinates if geocoding fails). */
  label: string;
  /** Structured address parts from reverse geocoding, when available. */
  address?: ResolvedAddress;
};

export class LocationPermissionError extends Error {
  constructor(message = 'Location permission denied.') {
    super(message);
    this.name = 'LocationPermissionError';
  }
}

let configured = false;

const ensureConfigured = () => {
  if (configured) {
    return;
  }
  // "whenInUse" keeps us on the free, on-device provider — no Google Maps API key required.
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
    locationProvider: 'auto',
  });
  configured = true;
};

/**
 * Requests foreground location permission.
 * Android uses the shared PermissionsAndroid flow; iOS defers to the native prompt.
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const already = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (already) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Allow location access to use your current location for this task.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
    return status === PermissionsAndroid.RESULTS.GRANTED;
  }

  return true;
};

/** Formats coordinates into a readable label until reverse geocoding is available. */
export const formatCoordinatesLabel = (coords: LocationCoords): string =>
  `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;

type GeolocationOptions = {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
};

// High accuracy waits for a precise GPS fix; the low-accuracy fallback uses the
// network/last-known provider so a slow or indoor GPS lock still resolves.
const HIGH_ACCURACY_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 10000,
};

const LOW_ACCURACY_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: false,
  timeout: 30000,
  maximumAge: 60000,
};

const readCurrentPosition = (options: GeolocationOptions): Promise<LocationCoords> =>
  new Promise<LocationCoords>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        reject(new Error(error.message || 'Unable to fetch your current location.'));
      },
      options,
    );
  });

const getCurrentCoords = async (): Promise<LocationCoords> => {
  ensureConfigured();

  const granted = await requestLocationPermission();
  if (!granted) {
    throw new LocationPermissionError();
  }

  try {
    return await readCurrentPosition(HIGH_ACCURACY_OPTIONS);
  } catch (error) {
    if (error instanceof LocationPermissionError) {
      throw error;
    }
    // High-accuracy GPS can time out indoors or on a cold start — retry with the
    // faster network/last-known provider before surfacing an error.
    return readCurrentPosition(LOW_ACCURACY_OPTIONS);
  }
};

const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

// Nominatim's usage policy requires a descriptive User-Agent identifying the app.
const NOMINATIM_HEADERS = {
  'User-Agent': 'SAMN-TaskManager/1.0 (react-native app)',
  Accept: 'application/json',
};

type NominatimAddress = {
  suburb?: string;
  neighbourhood?: string;
  hamlet?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  country?: string;
  postcode?: string;
};

type NominatimReverseResponse = {
  display_name?: string;
  address?: NominatimAddress;
};

const buildAddressLabel = (address: NominatimAddress, fallback?: string): string => {
  const locality =
    address.suburb || address.neighbourhood || address.hamlet || undefined;
  const city = address.city || address.town || address.village || address.county;
  const parts = [locality, city, address.state].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(', ');
  }
  return fallback ?? '';
};

// Cache the most recent lookup for the session so repeated taps at the same
// spot don't hit the public Nominatim service again.
let lastReverseGeocode: { key: string; address: ResolvedAddress } | null = null;

const coordsCacheKey = (coords: LocationCoords): string =>
  `${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}`;

/**
 * Reverse geocodes coordinates into a readable address via OpenStreetMap Nominatim.
 * Returns `null` on network/parse failure so callers can fall back to coordinates.
 */
export const reverseGeocode = async (
  coords: LocationCoords,
): Promise<ResolvedAddress | null> => {
  const key = coordsCacheKey(coords);
  if (lastReverseGeocode && lastReverseGeocode.key === key) {
    return lastReverseGeocode.address;
  }

  try {
    const { data } = await axios.get<NominatimReverseResponse>(NOMINATIM_REVERSE_URL, {
      params: {
        format: 'jsonv2',
        lat: coords.latitude,
        lon: coords.longitude,
      },
      headers: NOMINATIM_HEADERS,
      timeout: 15000,
    });

    const rawAddress = data.address ?? {};
    const address: ResolvedAddress = {
      displayName: buildAddressLabel(rawAddress, data.display_name),
      city: rawAddress.city || rawAddress.town || rawAddress.village || rawAddress.county,
      state: rawAddress.state,
      country: rawAddress.country,
      postalCode: rawAddress.postcode,
    };

    if (!address.displayName) {
      return null;
    }

    lastReverseGeocode = { key, address };
    return address;
  } catch {
    return null;
  }
};

/**
 * Requests permission, resolves the device's current GPS position, and reverse
 * geocodes it into a readable address. Falls back to coordinates when the
 * geocoding service is unreachable.
 * Throws {@link LocationPermissionError} when permission is not granted.
 */
export const getCurrentLocation = async (): Promise<CurrentLocationResult> => {
  const coords = await getCurrentCoords();
  const address = await reverseGeocode(coords);

  return {
    coords,
    label: address?.displayName || formatCoordinatesLabel(coords),
    address: address ?? undefined,
  };
};

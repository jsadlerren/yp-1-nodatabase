import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Compass, CheckCircle2, AlertCircle } from 'lucide-react';
import { DeliveryAddress } from '../types';

interface GoogleMapsAddressPickerProps {
  address: DeliveryAddress;
  onAddressChange?: (address: DeliveryAddress) => void;
  interactive?: boolean;
  height?: string;
  zoom?: number;
  showSearchPresets?: boolean;
}

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDwIPN2Fr_Sbzv0j_MKKujMAVED6bS4Ooo';

const PRESET_LOCATIONS = [
  { name: 'New York (Manhattan)', street: '767 5th Ave', city: 'New York', state: 'NY', zip: '10153', lat: 40.7638, lng: -73.9729 },
  { name: 'San Francisco (Market St)', street: '835 Market St', city: 'San Francisco', state: 'CA', zip: '94103', lat: 37.7849, lng: -122.4068 },
  { name: 'Mountain View (Googleplex)', street: '1600 Amphitheatre Pkwy', city: 'Mountain View', state: 'CA', zip: '94043', lat: 37.4220, lng: -122.0841 },
  { name: 'Chicago (Michigan Ave)', street: '835 N Michigan Ave', city: 'Chicago', state: 'IL', zip: '60611', lat: 41.8981, lng: -87.6243 },
  { name: 'Austin (Downtown)', street: '300 W 6th St', city: 'Austin', state: 'TX', zip: '78701', lat: 30.2694, lng: -97.7452 },
];

export const GoogleMapsAddressPicker: React.FC<GoogleMapsAddressPickerProps> = ({
  address,
  onAddressChange,
  interactive = true,
  height = '320px',
  zoom = 15,
  showSearchPresets = true,
}) => {
  const [markerPosition, setMarkerPosition] = useState({
    lat: address.lat || 40.7638,
    lng: address.lng || -73.9729,
  });
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (address.lat && address.lng) {
      setMarkerPosition({ lat: address.lat, lng: address.lng });
    }
  }, [address.lat, address.lng]);

  const handleMapClick = useCallback(
    (e: any) => {
      if (!interactive || !onAddressChange) return;
      if (e.detail && e.detail.latLng) {
        const newLat = e.detail.latLng.lat;
        const newLng = e.detail.latLng.lng;
        setMarkerPosition({ lat: newLat, lng: newLng });
        onAddressChange({
          ...address,
          lat: Number(newLat.toFixed(6)),
          lng: Number(newLng.toFixed(6)),
          formattedAddress: `${address.street || 'Selected Point'}, ${address.city || ''} (${newLat.toFixed(4)}, ${newLng.toFixed(4)})`,
        });
      }
    },
    [interactive, onAddressChange, address]
  );

  const handleMarkerDragEnd = useCallback(
    (e: any) => {
      if (!interactive || !onAddressChange) return;
      if (e.latLng) {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        setMarkerPosition({ lat: newLat, lng: newLng });
        onAddressChange({
          ...address,
          lat: Number(newLat.toFixed(6)),
          lng: Number(newLng.toFixed(6)),
        });
      }
    },
    [interactive, onAddressChange, address]
  );

  const applyPreset = (preset: typeof PRESET_LOCATIONS[0]) => {
    if (!onAddressChange) return;
    setMarkerPosition({ lat: preset.lat, lng: preset.lng });
    onAddressChange({
      ...address,
      street: preset.street,
      city: preset.city,
      state: preset.state,
      zipCode: preset.zip,
      lat: preset.lat,
      lng: preset.lng,
      formattedAddress: `${preset.street}, ${preset.city}, ${preset.state} ${preset.zip}, USA`,
    });
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm flex flex-col">
      {/* Top Map header bar */}
      <div className="bg-slate-900 text-white px-3.5 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold tracking-wide uppercase text-[11px] text-slate-300">
            {interactive ? 'Google Maps Delivery Geolocation' : 'DHL Delivery Destination Pin'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span className="font-mono">
            {markerPosition.lat.toFixed(4)}°, {markerPosition.lng.toFixed(4)}°
          </span>
          {interactive && (
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-500/30">
              Click map to adjust pin
            </span>
          )}
        </div>
      </div>

      {/* Preset Quick Select for instant realistic testing */}
      {interactive && showSearchPresets && (
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-500 text-[11px] font-medium whitespace-nowrap flex items-center gap-1">
            <Compass className="w-3 h-3 text-slate-400" /> Fast Pre-fill:
          </span>
          {PRESET_LOCATIONS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-2 py-1 rounded-md text-[11px] bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 font-medium text-slate-700 whitespace-nowrap transition-colors shadow-xs"
            >
              {preset.name}
            </button>
          ))}
        </div>
      )}

      {/* Map canvas container */}
      <div style={{ height, width: '100%', position: 'relative' }}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            style={{ width: '100%', height: '100%' }}
            defaultCenter={markerPosition}
            center={markerPosition}
            defaultZoom={zoom}
            zoom={zoom}
            gestureHandling={interactive ? 'greedy' : 'cooperative'}
            disableDefaultUI={!interactive}
            mapId="DEMO_MAP_ID"
            onClick={handleMapClick}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            <AdvancedMarker
              position={markerPosition}
              draggable={interactive}
              onDragEnd={handleMarkerDragEnd}
              title={address.formattedAddress || address.street || 'Delivery Destination'}
            >
              <Pin
                background="#0f172a"
                glyphColor="#10b981"
                borderColor="#ffffff"
                scale={1.2}
              />
            </AdvancedMarker>
          </Map>
        </APIProvider>

        {/* Address badge overlay */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md rounded-lg p-2.5 shadow-md border border-slate-200 text-xs flex items-start gap-2.5 pointer-events-none">
          <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 mt-0.5">
            <Navigation className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 truncate">
              {address.fullName || 'Recipient'} • {address.street || 'No street address entered'}
            </p>
            <p className="text-slate-500 text-[11px] truncate">
              {address.city ? `${address.city}, ${address.state} ${address.zipCode}, ${address.country}` : 'Enter your address above to view exact coordinates'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

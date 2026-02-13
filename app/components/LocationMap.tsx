"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Iconos Fix
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Subcomponente: Solo detecta clicks si NO es readonly
function LocationMarker({ position, onLocationSelect, readonly }: { position: [number, number] | null, onLocationSelect?: (lat: number, lng: number) => void, readonly?: boolean }) {
  const map = useMapEvents({
    click(e) {
      if (!readonly && onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
        map.flyTo(e.latlng, map.getZoom());
      }
    },
  });

  return position ? <Marker position={position} interactive={!readonly} /> : null;
}

interface LocationMapProps {
  lat?: number;
  lng?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  readonly?: boolean; // 👈 Nueva propiedad para bloquear el mapa
}

export default function LocationMap({ lat, lng, onLocationSelect, readonly = false }: LocationMapProps) {
  const defaultPosition: [number, number] = [-34.6037, -58.3816];
  const position: [number, number] | null = lat && lng ? [lat, lng] : null;

  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-300 z-0 relative">
      <MapContainer 
        center={position || defaultPosition} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        dragging={!readonly} // Si es readonly, no dejamos arrastrar tanto
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} onLocationSelect={onLocationSelect} readonly={readonly} />
      </MapContainer>
      
      {!readonly && (
        <p className="text-xs text-gray-500 mt-1 text-center bg-white py-1">
          📍 Haz click para definir la ubicación exacta
        </p>
      )}
    </div>
  );
}
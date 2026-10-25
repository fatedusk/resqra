import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { AnimalReport, Organisation, AreaAlert } from '../types';
import { Link } from 'react-router-dom';
import { Phone, Navigation } from 'lucide-react';

// Fix Leaflet default icon paths in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Custom SVG Icons for Leaflet
const createCustomIcon = (bgColor: string, iconSvg: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border: 2.5px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
      ">
        ${iconSvg}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });
};

const ngoIcon = createCustomIcon(
  '#0d9488',
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
);

const hospitalIcon = createCustomIcon(
  '#2563eb',
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`
);

const urgentCaseIcon = createCustomIcon(
  '#e11d48',
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
);

const userPinIcon = createCustomIcon(
  '#10b981',
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>`
);

// Map click handler helper for location picker
const LocationPickerEvents: React.FC<{ onPick?: (lat: number, lng: number) => void }> = ({ onPick }) => {
  useMapEvents({
    click(e) {
      if (onPick) {
        onPick(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
      }
    }
  });
  return null;
};

// Map controller to ensure reliable rendering and dynamic pan/zoom
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  const [lat, lng] = center;

  useEffect(() => {
    // Invalidate map size so layout transitions and flex dimensions do not break tiles
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 300);

    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', onResize);
    };
  }, [map]);

  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], zoom, { animate: true });
    }
  }, [lat, lng, zoom, map]);

  return null;
};

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  reports?: AnimalReport[];
  organisations?: Organisation[];
  alerts?: AreaAlert[];
  userLocation?: [number, number];
  onSelectLocation?: (lat: number, lng: number) => void;
  selectedMarkerLocation?: [number, number];
  height?: string;
  className?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  center = [28.5697, 77.3208], // Noida Sector 12
  zoom = 13,
  reports = [],
  organisations = [],
  alerts = [],
  userLocation,
  onSelectLocation,
  selectedMarkerLocation,
  height = '420px',
  className = ''
}) => {
  // 100% Free OpenStreetMap tile server (requires NO API key and has NO watermark)
  const tileUrl = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';

  return (
    <div style={{ height }} className={`w-full relative overflow-hidden rounded-2xl shadow-inner ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <MapController center={center} zoom={zoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url={tileUrl}
          maxZoom={19}
        />

        {/* Location Picker Click Listener */}
        {onSelectLocation && <LocationPickerEvents onPick={onSelectLocation} />}

        {/* Selected Marker for Picker */}
        {selectedMarkerLocation && (
          <Marker position={selectedMarkerLocation} icon={userPinIcon}>
            <Popup>
              <div className="text-xs p-1 font-sans">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block">Reported Location Pin</span>
                <span className="text-slate-600 dark:text-slate-300">{selectedMarkerLocation[0]}, {selectedMarkerLocation[1]}</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* User Location */}
        {userLocation && (
          <Marker position={userLocation} icon={userPinIcon}>
            <Popup>
              <div className="text-xs p-1 font-sans">
                <span className="font-bold text-slate-900 dark:text-white block">You Are Here</span>
                <span className="text-slate-500 dark:text-slate-400">Sector 12, Noida</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Animal Reports */}
        {reports.map((rep) => (
          <Marker
            key={rep.id}
            position={[rep.latitude, rep.longitude]}
            icon={urgentCaseIcon}
          >
            <Popup>
              <div className="p-1 font-sans max-w-[210px]">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 px-1.5 py-0.5 rounded">
                    {rep.urgency} Urgency
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{rep.caseNumber}</span>
                </div>
                <img
                  src={rep.imageUrl}
                  alt={rep.animalType}
                  className="w-full h-24 object-cover rounded-lg my-1.5"
                />
                <h4 className="font-semibold text-xs text-slate-900 dark:text-white leading-snug">
                  {rep.animalType} • {rep.condition}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {rep.locationName}
                </p>
                <Link
                  to={`/cases/${rep.id}`}
                  className="mt-2 block w-full py-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium"
                >
                  View Case Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Organisations: NGOs & Vet Hospitals */}
        {organisations.map((org) => {
          const isHospital = org.type === 'hospital' || org.type === 'clinic';
          return (
            <Marker
              key={org.id}
              position={[org.latitude, org.longitude]}
              icon={isHospital ? hospitalIcon : ngoIcon}
            >
              <Popup>
                <div className="p-1 font-sans max-w-[220px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isHospital
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                      }`}
                    >
                      {isHospital ? 'Veterinary Hospital' : 'Animal Welfare NGO'}
                    </span>
                    {org.isVerified && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{org.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{org.address}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                    {org.distanceKm ? `~${org.distanceKm} km away` : 'Nearby'} • {org.openHours}
                  </p>

                  <div className="mt-2.5 flex items-center gap-1.5">
                    <a
                      href={`tel:${org.phone}`}
                      className="flex-1 py-1 px-2 text-center bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium flex items-center justify-center gap-1 transition"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${org.latitude},${org.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1 px-2 text-center border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-200 rounded text-xs font-medium flex items-center justify-center gap-1 transition"
                    >
                      <Navigation className="w-3 h-3" /> Route
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Area Alert Clusters (e.g. Red Alert Zone) */}
        {alerts.map((alt) => (
          <Circle
            key={alt.id}
            center={[alt.latitude, alt.longitude]}
            radius={alt.radiusMeters || 2000}
            pathOptions={{
              color: '#ef4444',
              fillColor: '#ef4444',
              fillOpacity: 0.18,
              weight: 2,
              dashArray: '4, 4'
            }}
          >
            <Popup>
              <div className="p-1 font-sans">
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 px-1 rounded">
                  {alt.severity}
                </span>
                <p className="text-xs font-semibold mt-1 text-slate-900 dark:text-white">{alt.title}</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{alt.details}</p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MapPin,
  Building2,
  Stethoscope,
  AlertTriangle,
  Navigation,
  Phone,
  Search,
  Filter,
  Crosshair,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { Organisation, AnimalReport } from '../types';
import { MapComponent } from '../components/MapComponent';

export const NearbyMapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';

  const [activeTab, setActiveTab] = useState<string>(initialType);
  const [searchQuery, setSearchQuery] = useState('');
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [reports, setReports] = useState<AnimalReport[]>([]);
  const [loading, setLoading] = useState(true);

  // User location state
  const [userLocation, setUserLocation] = useState<[number, number]>([28.5697, 77.3208]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.5697, 77.3208]);
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [helpRes, repRes] = await Promise.all([
          api.getNearbyHelp(userLocation[0], userLocation[1]),
          api.getReports()
        ]);
        setOrganisations(helpRes.organisations);
        setReports(repRes.reports);
      } catch (err) {
        console.warn('Error fetching nearby map data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userLocation]);

  const handleUseGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc: [number, number] = [
            Number(pos.coords.latitude.toFixed(5)),
            Number(pos.coords.longitude.toFixed(5))
          ];
          setUserLocation(newLoc);
          setMapCenter(newLoc);
          setMapZoom(14);
        },
        (err) => {
          console.warn('Geolocation denied or unavailable:', err);
          // Keep Noida default
        }
      );
    }
  };

  // Filter organisations
  const filteredOrgs = organisations.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.address.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'ngo') return o.type === 'ngo' || o.type === 'shelter';
    if (activeTab === 'hospital') return o.type === 'hospital' || o.type === 'clinic';
    if (activeTab === 'urgent') return false;
    return true;
  });

  // Filter reports
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.animalType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.condition.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'urgent') return r.urgency === 'Critical' || r.urgency === 'High';
    if (activeTab === 'ngo' || activeTab === 'hospital') return false;
    return true;
  });

  const handleFocusLocation = (lat: number, lng: number, id: string) => {
    setSelectedId(id);
    setMapCenter([lat, lng]);
    setMapZoom(15);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-6xl mx-auto space-y-4">
      {/* Search & Filter Header (Screen 5) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-500" />
            Nearby Help & Rescue Map
          </h2>
          <button
            onClick={handleUseGPS}
            className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1 hover:bg-emerald-100 transition"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Use My GPS</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospitals, NGOs, clinics, or shelters..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-sm"
          />
        </div>

        {/* Filter Pills (Screen 5: All, NGOs, Hospitals, Urgent Cases) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Locations', icon: Filter },
            { id: 'ngo', label: 'Rescue NGOs', icon: Building2 },
            { id: 'hospital', label: 'Vet Hospitals', icon: Stethoscope },
            { id: 'urgent', label: 'Urgent Cases', icon: AlertTriangle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedId(null);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Map */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
        <MapComponent
          center={mapCenter}
          zoom={mapZoom}
          organisations={activeTab === 'urgent' ? [] : filteredOrgs}
          reports={filteredReports}
          userLocation={userLocation}
          height="400px"
        />
      </div>

      {/* Listings Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {activeTab === 'urgent' ? 'Active Urgent Cases Near You' : 'Nearest Responders & Care Facilities'}
          </h3>
          <span className="text-xs text-slate-400">
            {activeTab === 'urgent' ? `${filteredReports.length} cases reported` : `${filteredOrgs.length} locations found`}
          </span>
        </div>

        {/* Urgent Cases Listing (if activeTab === 'urgent') */}
        {activeTab === 'urgent' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredReports.map((rep) => (
              <div
                key={rep.id}
                className={`p-4 rounded-3xl bg-white dark:bg-slate-800 border ${
                  selectedId === rep.id ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200 dark:border-slate-700'
                } shadow-sm flex flex-col justify-between space-y-3 hover:border-rose-500 transition`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                      {rep.urgency} Urgency
                    </span>
                    <span className="text-xs font-mono text-slate-400">{rep.caseNumber}</span>
                  </div>
                  <img
                    src={rep.imageUrl}
                    alt={rep.animalType}
                    className="w-full h-32 object-cover rounded-2xl mb-2"
                  />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {rep.animalType} • {rep.condition}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {rep.locationName}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => handleFocusLocation(rep.latitude, rep.longitude, rep.id)}
                    className="flex-1 py-2 text-center bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 hover:bg-rose-100 transition"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Focus on Map</span>
                  </button>
                  <Link
                    to={`/cases/${rep.id}`}
                    className="py-2 px-3 text-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <span>View Case</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Organisations Listing (when not 'urgent') */}
        {activeTab !== 'urgent' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredOrgs.map((org) => {
              const isHospital = org.type === 'hospital' || org.type === 'clinic';
              const isSelected = selectedId === org.id;

              return (
                <div
                  key={org.id}
                  className={`p-4 rounded-3xl bg-white dark:bg-slate-800 border ${
                    isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-700'
                  } shadow-sm flex flex-col justify-between space-y-3 hover:border-emerald-500 transition`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isHospital
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {isHospital ? 'Veterinary Hospital' : 'Rescue NGO'}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {org.distanceKm ? `~${org.distanceKm} km` : 'Nearby'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {org.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {org.address}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {org.services.map((svc) => (
                        <span
                          key={svc}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => handleFocusLocation(org.latitude, org.longitude, org.id)}
                      className="w-full py-1.5 text-center bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-600 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Focus on Map</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://maps.google.com/?q=${org.latitude},${org.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 text-center border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Get Route</span>
                      </a>
                      <a
                        href={`tel:${org.phone}`}
                        className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

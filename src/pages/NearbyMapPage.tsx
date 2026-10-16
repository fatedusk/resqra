import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Building2,
  Stethoscope,
  AlertTriangle,
  Navigation,
  Phone,
  Search,
  Filter,
  CheckCircle2
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

  const userLat = 28.5697;
  const userLon = 77.3208;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [helpRes, repRes] = await Promise.all([
          api.getNearbyHelp(userLat, userLon, activeTab === 'all' ? undefined : activeTab),
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
  }, [activeTab]);

  const filteredOrgs = organisations.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-6xl mx-auto space-y-4">
      {/* Search & Filter Header (Screen 5) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-500" />
            Nearby Help & Rescue Map
          </h2>
          <span className="text-xs text-slate-400">Sector 12, Noida, UP</span>
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
            { id: 'all', label: 'All', icon: Filter },
            { id: 'ngo', label: 'NGOs', icon: Building2 },
            { id: 'hospital', label: 'Hospitals', icon: Stethoscope },
            { id: 'urgent', label: 'Urgent Cases', icon: AlertTriangle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

      {/* Interactive Leaflet Map (Screen 5) */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
        <MapComponent
          center={[userLat, userLon]}
          zoom={13}
          organisations={activeTab === 'urgent' ? [] : filteredOrgs}
          reports={activeTab === 'ngo' || activeTab === 'hospital' ? [] : reports}
          userLocation={[userLat, userLon]}
          height="380px"
        />
      </div>

      {/* Nearest Veterinary Hospitals (Screen 5 reference list) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Nearest Veterinary Care & Responders
          </h3>
          <span className="text-xs text-slate-400">{filteredOrgs.length} locations found</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredOrgs.map((org) => {
            const isHospital = org.type === 'hospital' || org.type === 'clinic';
            return (
              <div
                key={org.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-3 hover:border-emerald-500 transition"
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
                      {org.distanceKm ? `~${org.distanceKm} km` : '1.2 km'}
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

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${org.latitude},${org.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 text-center border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>
                  <a
                    href={`tel:${org.phone}`}
                    className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

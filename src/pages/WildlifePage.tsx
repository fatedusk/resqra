import React, { useEffect, useState } from 'react';
import {
  Compass,
  Search,
  Shield,
  Eye,
  Trees,
  Bird,
  Fish,
  Bug,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { WildlifeSpecies } from '../types';

export const WildlifePage: React.FC = () => {
  const [speciesList, setSpeciesList] = useState<WildlifeSpecies[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<WildlifeSpecies | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWildlife = async () => {
      try {
        const res = await api.getWildlife(selectedCategory === 'All' ? undefined : selectedCategory);
        setSpeciesList(res.species);
      } catch (err) {
        console.warn('Error fetching wildlife:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWildlife();
  }, [selectedCategory]);

  const categories = [
    { id: 'All', label: 'All', icon: Compass },
    { id: 'Mammals', label: 'Mammals', icon: Trees },
    { id: 'Birds', label: 'Birds', icon: Bird },
    { id: 'Reptiles', label: 'Reptiles', icon: Shield },
    { id: 'Amphibians', label: 'Amphibians', icon: Eye },
    { id: 'Fish', label: 'Fish', icon: Fish },
    { id: 'Insects', label: 'Insects', icon: Bug }
  ];

  const filtered = speciesList.filter(
    (s) =>
      s.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.habitat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-5xl mx-auto space-y-5">
      {/* Header & Search (Screen 8) */}
      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-500" />
            Wildlife Guide
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover native species, habitat conservation, and ethical observation protocols.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search species, habitat, scientific name..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-sm"
          />
        </div>

        {/* Category Pills (Screen 8 Reference) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Species Grid (Screen 8: Bengal Tiger, Elephant, Snow Leopard, Peacock) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Featured Species
          </h3>
          <span className="text-xs text-slate-400">{filtered.length} documented</span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedSpecies(item)}
                className="group text-left rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-500 transition flex flex-col justify-between"
              >
                <div className="relative w-full h-44 overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img
                    src={item.imageUrl}
                    alt={item.commonName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                    {item.conservationStatus.split(' ')[0]}
                  </span>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                      {item.commonName}
                    </h4>
                    <p className="text-[11px] italic text-slate-400 mt-0.5">
                      {item.scientificName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {item.habitat}
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>Explore Field Guide</span>
                    <span>→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Species Detail Modal (Ethical observation & Anti-poaching protection) */}
      {selectedSpecies && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <button
              onClick={() => setSelectedSpecies(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedSpecies.imageUrl}
              alt={selectedSpecies.commonName}
              className="w-full h-52 object-cover rounded-2xl shadow-md"
            />

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {selectedSpecies.category}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                  {selectedSpecies.conservationStatus}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {selectedSpecies.commonName}
              </h3>
              <p className="text-xs italic text-slate-400">{selectedSpecies.scientificName}</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Habitat & Range:</span>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">{selectedSpecies.habitat}</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Diet:</span>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">{selectedSpecies.diet}</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Behavior:</span>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">{selectedSpecies.behavior}</p>
              </div>

              {/* Ethical Protocol Notice (Section 14 requirement) */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-600" />
                  Responsible Observation & Anti-Poaching Advisory
                </span>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                  {selectedSpecies.safetyGuidance} Precise nesting or territory GPS coordinates are intentionally obfuscated to safeguard vulnerable wildlife from disturbance or poaching.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

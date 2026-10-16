import React, { useEffect, useState } from 'react';
import {
  Heart,
  Plus,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Stethoscope,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { PetRecord } from '../types';

export const PetsPage: React.FC = () => {
  const [pets, setPets] = useState<PetRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'vaccinations' | 'health' | 'appointments'>('vaccinations');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);

  // New Record Form State
  const [recordType, setRecordType] = useState<'vaccination' | 'appointment'>('vaccination');
  const [vacName, setVacName] = useState('Bordetella (Kennel Cough)');
  const [vacDueDate, setVacDueDate] = useState('2026-11-20');
  const [aptClinic, setAptClinic] = useState('City Animal Hospital');
  const [aptReason, setAptReason] = useState('Annual Booster & Checkup');

  // New Pet Form State
  const [newPetName, setNewPetName] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('2');

  const fetchPets = async () => {
    try {
      const res = await api.getPets();
      setPets(res.pets);
    } catch (err) {
      console.warn('Error fetching pets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const currentPet = pets[0]; // Buddy (PET-001)

  const handleAddRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPet) return;

    if (recordType === 'vaccination') {
      await api.addVaccination(currentPet.id, {
        name: vacName,
        dueDate: vacDueDate,
        status: 'Upcoming'
      });
    } else {
      await api.addAppointment(currentPet.id, {
        clinic: aptClinic,
        reason: aptReason,
        dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    setIsAddRecordOpen(false);
    fetchPets();
  };

  const handleAddPetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName) return;

    await api.addPet({
      name: newPetName,
      species: 'Dog',
      breed: newPetBreed || 'Desi Indie',
      ageYears: Number(newPetAge) || 1,
      gender: 'Male',
      photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80'
    });

    setIsAddPetOpen(false);
    setNewPetName('');
    fetchPets();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          My Pets
        </h2>
        <button
          onClick={() => setIsAddPetOpen(true)}
          className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add Pet
        </button>
      </div>

      {currentPet ? (
        <>
          {/* Pet Profile Card (Screen 7 Reference) */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <img
              src={currentPet.photoUrl}
              alt={currentPet.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentPet.name}
                </h3>
                <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                  {currentPet.petCode}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentPet.breed} • {currentPet.ageYears} years
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md">
                  Active & Healthy
                </span>
                <span className="text-[10px] text-slate-400">Microchip Active</span>
              </div>
            </div>
          </div>

          {/* AI Health Summary Card (Section 13 requirement) */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-800/80 dark:to-emerald-950/30 border border-teal-200 dark:border-teal-900/60 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI Health Summary</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              Buddy has completed Rabies & DHPP. <strong>Leptospirosis</strong> booster is upcoming in August 2026. Keep preventative tick medication active during monsoon.
            </p>
          </div>

          {/* Navigation Tabs (Screen 7: Health Records, Vaccinations, Appointments) */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {[
              { id: 'health', label: 'Health Records', icon: FileText },
              { id: 'vaccinations', label: 'Vaccinations', icon: ShieldCheck },
              { id: 'appointments', label: 'Appointments', icon: Calendar }
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    isSelected
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* VACCINATIONS TAB (Screen 7 Reference) */}
          {activeTab === 'vaccinations' && (
            <div className="space-y-3 animate-in fade-in">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Vaccination Schedule
              </h4>
              <div className="space-y-2">
                {currentPet.vaccinations.map((vac) => {
                  const isCompleted = vac.status === 'Completed';
                  return (
                    <div
                      key={vac.id}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                        <div>
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                            {vac.name}
                          </h5>
                          <span className="text-[11px] text-slate-400">
                            Due: {vac.dueDate}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {vac.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HEALTH RECORDS TAB */}
          {activeTab === 'health' && (
            <div className="space-y-3 animate-in fade-in">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Clinical Records & Vet Notes
              </h4>
              <div className="space-y-2">
                {currentPet.healthRecords.map((hr) => (
                  <div
                    key={hr.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">{hr.title}</h5>
                      <span className="text-[11px] text-slate-400">{hr.date}</span>
                    </div>
                    <p className="text-[11px] text-emerald-600 font-medium">{hr.vet}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{hr.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <div className="space-y-3 animate-in fade-in">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Upcoming Vet Appointments
              </h4>
              <div className="space-y-2">
                {currentPet.appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">{apt.reason}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">{apt.clinic}</p>
                      <span className="text-[10px] text-emerald-600 font-medium">
                        {new Date(apt.dateTime).toLocaleDateString()} at 11:00 AM
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Record Action Button (Screen 7) */}
          <div className="pt-2">
            <button
              onClick={() => setIsAddRecordOpen(true)}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Record</span>
            </button>
          </div>
        </>
      ) : (
        <div className="p-8 text-center rounded-3xl bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-xs text-slate-500">No pet profile registered yet.</p>
          <button
            onClick={() => setIsAddPetOpen(true)}
            className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            Create Pet Profile
          </button>
        </div>
      )}

      {/* ADD RECORD MODAL */}
      {isAddRecordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <button
              onClick={() => setIsAddRecordOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Add Pet Record
            </h3>

            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setRecordType('vaccination')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border ${
                  recordType === 'vaccination'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                    : 'border-slate-200 text-slate-500'
                }`}
              >
                Vaccination
              </button>
              <button
                type="button"
                onClick={() => setRecordType('appointment')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border ${
                  recordType === 'appointment'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                    : 'border-slate-200 text-slate-500'
                }`}
              >
                Appointment
              </button>
            </div>

            <form onSubmit={handleAddRecordSubmit} className="space-y-3 text-xs">
              {recordType === 'vaccination' ? (
                <>
                  <div>
                    <label className="font-semibold block mb-1">Vaccine Name</label>
                    <input
                      type="text"
                      value={vacName}
                      onChange={(e) => setVacName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Due Date</label>
                    <input
                      type="date"
                      value={vacDueDate}
                      onChange={(e) => setVacDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="font-semibold block mb-1">Clinic Name</label>
                    <input
                      type="text"
                      value={aptClinic}
                      onChange={(e) => setAptClinic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Reason for Visit</label>
                    <input
                      type="text"
                      value={aptReason}
                      onChange={(e) => setAptReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold mt-2 hover:bg-emerald-700 transition"
              >
                Save Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD PET MODAL */}
      {isAddPetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <button
              onClick={() => setIsAddPetOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Add New Pet Profile
            </h3>
            <form onSubmit={handleAddPetSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Pet Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Luna"
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Breed / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Beagle or Indian Pariah"
                  value={newPetBreed}
                  onChange={(e) => setNewPetBreed(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={newPetAge}
                  onChange={(e) => setNewPetAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold mt-2 hover:bg-emerald-700 transition"
              >
                Register Pet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

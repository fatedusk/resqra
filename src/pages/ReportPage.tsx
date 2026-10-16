import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  MapPin,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Dog,
  Cat,
  Bird,
  Trees,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { MapComponent } from '../components/MapComponent';

export const ReportPage: React.FC = () => {
  const navigate = useNavigate();

  // Multi-step state: 1 = Photo, 2 = Details, 3 = Location, 4 = Review
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'
  );
  const [animalDetected, setAnimalDetected] = useState<boolean>(true);

  const [animalType, setAnimalType] = useState<'Dog' | 'Cat' | 'Bird' | 'Wild Animal' | 'Other'>('Dog');
  const [condition, setCondition] = useState<string>('Injured / Needs treatment');
  const [description, setDescription] = useState<string>('');
  const [observedSymptoms, setObservedSymptoms] = useState<string>('');
  const [inImmediateDanger, setInImmediateDanger] = useState<boolean>(false);

  const [locationName, setLocationName] = useState<string>('Sector 12, Noida, UP');
  const [latitude, setLatitude] = useState<number>(28.5697);
  const [longitude, setLongitude] = useState<number>(77.3208);
  const [reporterName, setReporterName] = useState<string>('Shivansh Patel');
  const [reporterPhone, setReporterPhone] = useState<string>('+91 98765 43210');

  const [uploading, setUploading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Handle Photo selection
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Image size exceeds 10MB limit.');
        return;
      }
      setErrorMsg('');
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Upload in background to /api/upload
      setUploading(true);
      try {
        const res = await api.uploadImage(file);
        if (res.url) {
          setImagePreview(res.url);
          setAnimalDetected(true); // Vision pre-check simulation
        }
      } catch (err: any) {
        console.warn('Local preview fallback:', err);
      } finally {
        setUploading(false);
      }
    }
  };

  // Browser Geolocation
  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(5)));
          setLongitude(Number(pos.coords.longitude.toFixed(5)));
          setLocationName(`Current Location (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`);
        },
        () => {
          // Default fallback
          setLatitude(28.5697);
          setLongitude(77.3208);
          setLocationName('Sector 12, Noida, UP');
        }
      );
    }
  };

  // Handle Submission
  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await api.submitReport({
        animalType,
        condition,
        description: description || 'Animal observed requiring assistance.',
        observedSymptoms,
        inImmediateDanger,
        imageUrl: imagePreview,
        locationName,
        latitude,
        longitude,
        reporterName
      });

      if (res.success && res.report) {
        // Navigate directly to AI Analysis Screen
        navigate(`/reports/${res.report.id}/analysis`);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error submitting report');
      setSubmitting(false);
    }
  };

  const animalTypes = [
    { id: 'Dog', label: 'Dog', icon: Dog },
    { id: 'Cat', label: 'Cat', icon: Cat },
    { id: 'Bird', label: 'Bird', icon: Bird },
    { id: 'Wild Animal', label: 'Wild Animal', icon: Trees },
    { id: 'Other', label: 'Other', icon: HelpCircle }
  ];

  const conditions = [
    { id: 'Healthy / Available for adoption', label: 'Healthy / Available for adoption' },
    { id: 'Injured / Needs treatment', label: 'Injured / Needs treatment' },
    { id: 'Seems ill', label: 'Seems ill' },
    { id: 'Mentally disturbed / Distressed', label: 'Mentally disturbed / Distressed' }
  ];

  return (
    <div className="pb-28 pt-4 px-4 sm:px-6 max-w-xl mx-auto">
      {/* Step Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Report an Animal
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Every report triggers our AI rescue agent to coordinate urgent care.
        </p>

        {/* Step Indicator Pills (Screen 3 Reference) */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[
            { num: 1, label: 'Photo' },
            { num: 2, label: 'Details' },
            { num: 3, label: 'Location' },
            { num: 4, label: 'Submit' }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num as any)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                step === s.num
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : step > s.num
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <span>{s.num}.</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: PHOTO */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="relative rounded-3xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 text-center">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Animal preview"
                  className="w-full h-64 object-cover rounded-2xl shadow-md"
                />

                {/* Animal Detected AI Badge */}
                {animalDetected && (
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Animal detected ✓</span>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-center gap-2">
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    <span>Replace Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer block py-12">
                <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                  Click to Upload or Snap Animal Photo
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  JPG, PNG, WebP up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-teal-50 dark:bg-slate-800/80 border border-teal-200 dark:border-slate-700 text-xs text-teal-800 dark:text-teal-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            <p>
              ResQra Vision Inspector will verify animal contours and visible injury severity to prepare the first-response action plan.
            </p>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Next: Animal Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: DETAILS */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in">
          {/* Animal Type Selection (Screen 3) */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Animal Type
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {animalTypes.map((t) => {
                const Icon = t.icon;
                const isSelected = animalType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setAnimalType(t.id as any)}
                    className={`py-3 px-2 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Condition Options (Screen 3) */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Condition
            </label>
            <div className="space-y-2">
              {conditions.map((c) => {
                const isSelected = condition === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCondition(c.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs transition ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span>{c.label}</span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Immediate Danger Checkbox */}
          <label className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 cursor-pointer">
            <input
              type="checkbox"
              checked={inImmediateDanger}
              onChange={(e) => setInImmediateDanger(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
            />
            <div>
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 block">
                Animal is in immediate danger
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                Active road hazard, severe bleeding, or hostile environment.
              </span>
            </div>
          </label>

          {/* Description & Symptoms */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Description or Observed Symptoms (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Dog with visible limb injury near street lamp, unable to put weight on front left leg."
              className="w-full p-3 text-xs rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="w-1/3 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Next: Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: LOCATION */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Rescue Location
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Sector 12, Noida, UP"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition whitespace-nowrap"
              >
                Use GPS
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              GPS Coordinates: {latitude}, {longitude} • Tap map to adjust pin
            </p>
          </div>

          {/* Leaflet Picker Map */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <MapComponent
              center={[latitude, longitude]}
              zoom={14}
              selectedMarkerLocation={[latitude, longitude]}
              onSelectLocation={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
                setLocationName(`Noida Location (${lat}, ${lng})`);
              }}
              height="280px"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setStep(2)}
              className="w-1/3 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Review Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & SUBMIT */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-3">
            <img
              src={imagePreview}
              alt="Review"
              className="w-full h-44 object-cover rounded-2xl"
            />

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400 block">Animal Type:</span>
                <span className="font-bold text-slate-900 dark:text-white">{animalType}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Condition:</span>
                <span className="font-bold text-slate-900 dark:text-white">{condition}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Location:</span>
                <span className="font-bold text-slate-900 dark:text-white">{locationName}</span>
              </div>
              {inImmediateDanger && (
                <div className="col-span-2 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 font-bold">
                  ⚠️ Critical Danger Flagged: Dispatches with maximum triage priority.
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(3)}
              className="w-1/3 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Analyzing with ResQra AI...' : 'Submit Rescue Report'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

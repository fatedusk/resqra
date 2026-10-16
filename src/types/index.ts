export type AppTheme = 'light' | 'dark' | 'liquid-glass';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'responder' | 'ngo_staff' | 'vet' | 'moderator' | 'admin';
  institution: string;
  avatarUrl?: string;
}

export interface Organisation {
  id: string;
  name: string;
  type: 'ngo' | 'hospital' | 'shelter' | 'clinic';
  isVerified: boolean;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  services: string[];
  rating: number;
  openHours: string;
}

export interface AIAssessment {
  id: string;
  reportId: string;
  animalDetected: boolean;
  detectedSpecies: string;
  confidence: number;
  imageQuality: 'good' | 'moderate' | 'blurry' | 'inconclusive';
  urgencyLevel: 'Critical' | 'High' | 'Moderate' | 'Low';
  urgencyReasoning: string;
  observedEvidence: string[];
  recommendedSteps: string[];
  safetyWarnings: string[];
  isDemo: boolean;
  createdAt: string;
}

export interface AnimalReport {
  id: string;
  caseNumber: string;
  animalType: 'Dog' | 'Cat' | 'Bird' | 'Wild Animal' | 'Other';
  condition: string;
  urgency: 'Critical' | 'High' | 'Moderate' | 'Low';
  status:
    | 'Reported'
    | 'Under Review'
    | 'Help Requested'
    | 'Rescue In Progress'
    | 'Treatment In Progress'
    | 'Available for Adoption'
    | 'Resolved'
    | 'Rejected as Invalid';
  inImmediateDanger: boolean;
  description: string;
  observedSymptoms?: string;
  imageUrl: string;
  locationName: string;
  latitude: number;
  longitude: number;
  reporterName: string;
  reporterPhone?: string;
  reporterId?: string;
  createdAt: string;
  updatedAt: string;
  aiAssessment?: AIAssessment;
  duplicateCandidate?: {
    candidateId: string;
    distanceKm: number;
    description: string;
    imageUrl: string;
    status: string;
  };
}

export interface PetRecord {
  id: string;
  ownerId: string;
  name: string;
  species: string;
  breed: string;
  ageYears: number;
  gender: string;
  photoUrl: string;
  petCode: string;
  vaccinations: Array<{
    id: string;
    name: string;
    dueDate: string;
    status: 'Completed' | 'Upcoming' | 'Overdue';
    administeredDate?: string;
  }>;
  healthRecords: Array<{
    id: string;
    title: string;
    date: string;
    vet: string;
    notes: string;
  }>;
  appointments: Array<{
    id: string;
    clinic: string;
    reason: string;
    dateTime: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
  }>;
}

export interface WildlifeSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  category: 'Mammals' | 'Birds' | 'Reptiles' | 'Amphibians' | 'Fish' | 'Insects';
  conservationStatus: string;
  habitat: string;
  diet: string;
  behavior: string;
  safetyGuidance: string;
  imageUrl: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'Top Stories' | 'Incidents' | 'Trends' | 'Wildlife' | 'Saved';
  sourceName: string;
  publishedAt: string;
  imageUrl: string;
  readTime: string;
}

export interface Fundraiser {
  id: string;
  title: string;
  animalName: string;
  story: string;
  targetAmount: number;
  raisedAmount: number;
  isVerified: boolean;
  vetReportAvailable: boolean;
  updatesRegularly: boolean;
  imageUrl: string;
  status: 'active' | 'completed';
  donations: Array<{
    id: string;
    donorName: string;
    amount: number;
    paymentMethod: string;
    date: string;
  }>;
}

export interface AreaAlert {
  id: string;
  title: string;
  severity: 'Red Alert' | 'Orange Warning' | 'Yellow Advisory';
  incidentCount: number;
  locationName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  status: 'active' | 'under_review' | 'resolved' | 'dismissed';
  details: string;
  guidance: string;
  createdAt: string;
}

export interface AreaIncident {
  id: string;
  incidentType: 'Dog Bite' | 'Injured Animal' | 'Suspected Rabies' | 'Cruelty Case';
  locationName: string;
  latitude: number;
  longitude: number;
  timeAgo: string;
  createdAt: string;
}

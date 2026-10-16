import fs from 'fs';
import path from 'path';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'responder' | 'ngo_staff' | 'vet' | 'moderator' | 'admin';
  institution?: string;
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

export interface AnimalReport {
  id: string;
  caseNumber: string;
  animalType: 'Dog' | 'Cat' | 'Bird' | 'Wild Animal' | 'Other';
  condition: string;
  urgency: 'Critical' | 'High' | 'Moderate' | 'Low';
  status: 'Reported' | 'Under Review' | 'Help Requested' | 'Rescue In Progress' | 'Treatment In Progress' | 'Available for Adoption' | 'Resolved' | 'Rejected as Invalid';
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

export interface PetRecord {
  id: string;
  ownerId: string;
  name: string;
  species: string;
  breed: string;
  ageYears: number;
  gender: string;
  photoUrl: string;
  petCode: string; // e.g. PET-001
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

// Initial Realistic Seed Data matching design reference
const INITIAL_REPORTS: AnimalReport[] = [
  {
    id: 'rep-001',
    caseNumber: 'Case AM-2026-0012',
    animalType: 'Dog',
    condition: 'Injured / Needs treatment',
    urgency: 'High',
    status: 'Rescue In Progress',
    inImmediateDanger: true,
    description: 'Found a stray dog near Sector 12 Noida with a visible deep front paw injury and limping. Animal seems distressed and in pain.',
    observedSymptoms: 'Severe limp on left front leg, minor bleeding, panting heavily.',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    locationName: 'Sector 12, Noida, UP',
    latitude: 28.5697,
    longitude: 77.3208,
    reporterName: 'Shivansh Patel',
    reporterPhone: '+91 98765 43210',
    reporterId: 'usr-001',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    aiAssessment: {
      id: 'ai-001',
      reportId: 'rep-001',
      animalDetected: true,
      detectedSpecies: 'Canine (Desi / Indian Pariah Dog)',
      confidence: 0.96,
      imageQuality: 'good',
      urgencyLevel: 'High',
      urgencyReasoning: 'The image shows a canine with visible limb trauma and possible infection. This appears to be an authentic incident requiring timely medical care.',
      observedEvidence: [
        'Visible laceration / swelling on front left extremity',
        'Guarded posture consistent with acute pain',
        'Animal is alert but immobilized'
      ],
      recommendedSteps: [
        'Contact the nearest veterinary hospital or NGO ambulance immediately.',
        'Keep the animal in a calm, quiet place with minimal crowd gathering.',
        'Avoid giving solid food or human analgesics which can be toxic.',
        'Keep a safe distance while awaiting trained rescue personnel.'
      ],
      safetyWarnings: [
        'Do not attempt forceful restraint; injured animals may bite out of fear.',
        'Never administer paracetamol, ibuprofen, or aspirin to dogs.'
      ],
      isDemo: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    duplicateCandidate: {
      candidateId: 'rep-dup-01',
      distanceKm: 2.1,
      description: 'Limping brown street dog seen resting near Sector 12 market entrance 1 hour ago.',
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
      status: 'pending'
    }
  },
  {
    id: 'rep-002',
    caseNumber: 'Case AM-2026-0013',
    animalType: 'Cat',
    condition: 'Seems ill',
    urgency: 'Moderate',
    status: 'Help Requested',
    inImmediateDanger: false,
    description: 'Young tabby cat curled up near apartment basement ramp, appears dehydrated and lethargic.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    locationName: 'Sector 18, Noida, UP',
    latitude: 28.5708,
    longitude: 77.3261,
    reporterName: 'Ananya Verma',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    aiAssessment: {
      id: 'ai-002',
      reportId: 'rep-002',
      animalDetected: true,
      detectedSpecies: 'Feline (Domestic Shorthair)',
      confidence: 0.94,
      imageQuality: 'good',
      urgencyLevel: 'Moderate',
      urgencyReasoning: 'Feline showing symptoms of lethargy and mild dehydration. No active catastrophic trauma detected.',
      observedEvidence: ['Lethargic demeanor', 'Dry nose and eyes', 'Sitting stationary'],
      recommendedSteps: [
        'Offer small sips of clean fresh water in a shallow bowl.',
        'Place in a warm cardboard box with ventilation.',
        'Contact local feline shelter or vet clinic for hydration therapy.'
      ],
      safetyWarnings: ['Handle gently with a towel to prevent defensive scratching.'],
      isDemo: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'rep-003',
    caseNumber: 'Case AM-2026-0008',
    animalType: 'Bird',
    condition: 'Injured / Needs treatment',
    urgency: 'High',
    status: 'Reported',
    inImmediateDanger: true,
    description: 'National bird (Peacock) found entangled in nylon thread near Botanical Garden boundary.',
    imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&q=80',
    locationName: 'Botanical Garden, Sector 38, Noida',
    latitude: 28.5644,
    longitude: 77.3344,
    reporterName: 'Rohit Mehra',
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    aiAssessment: {
      id: 'ai-003',
      reportId: 'rep-003',
      animalDetected: true,
      detectedSpecies: 'Avian (Indian Peafowl - Pavo cristatus)',
      confidence: 0.98,
      imageQuality: 'good',
      urgencyLevel: 'High',
      urgencyReasoning: 'Protected Schedule I wildlife entangled in synthetic thread. Risk of wing necrosis or predator attack.',
      observedEvidence: ['Wing restriction', 'Visible nylon thread entanglement'],
      recommendedSteps: [
        'Notify Forest Dept / Wildlife SOS immediately.',
        'Cover gently with a breathable cloth to keep calm and prevent further flapping damage.',
        'Do not yank or aggressively cut threads without stabilizing the wing.'
      ],
      safetyWarnings: ['Peafowl have sharp spurs and powerful beaks; protect your eyes.'],
      isDemo: true,
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'rep-004',
    caseNumber: 'Case AM-2026-0005',
    animalType: 'Dog',
    condition: 'Healthy / Available for adoption',
    urgency: 'Low',
    status: 'Available for Adoption',
    inImmediateDanger: false,
    description: 'Playful 3-month-old vaccinated Indie puppy looking for a permanent loving home. Dewormed and friendly with kids.',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    locationName: 'Sector 62, Noida',
    latitude: 28.6280,
    longitude: 77.3649,
    reporterName: 'Friendicoes Rescue',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_ORGANISATIONS: Organisation[] = [
  {
    id: 'org-001',
    name: 'People for Animals (PFA)',
    type: 'ngo',
    isVerified: true,
    phone: '+91 98100 12345',
    address: 'Sector 14, Noida, UP',
    latitude: 28.5802,
    longitude: 77.3175,
    distanceKm: 2.1,
    services: ['Rescue', 'Ambulance', 'Shelter', 'Emergency Care'],
    rating: 4.8,
    openHours: '24x7 Emergency Line'
  },
  {
    id: 'org-002',
    name: 'Blue Cross Society',
    type: 'ngo',
    isVerified: true,
    phone: '+91 98111 67890',
    address: 'Sector 29, Noida, UP',
    latitude: 28.5668,
    longitude: 77.3364,
    distanceKm: 3.4,
    services: ['Rescue', 'Medical Aid', 'Shelter', 'Sterilization'],
    rating: 4.7,
    openHours: '8:00 AM - 9:00 PM'
  },
  {
    id: 'org-003',
    name: 'City Animal Hospital',
    type: 'hospital',
    isVerified: true,
    phone: '+91 98765 43210',
    address: 'Sector 11, Noida, UP',
    latitude: 28.5790,
    longitude: 77.3250,
    distanceKm: 1.2,
    services: ['General Care', 'Open 24x7', 'Govt Approved', 'Surgeries'],
    rating: 4.9,
    openHours: 'Open 24x7'
  },
  {
    id: 'org-004',
    name: 'Pet Care Hospital',
    type: 'hospital',
    isVerified: true,
    phone: '+91 99100 99887',
    address: 'Sector 19, Noida, UP',
    latitude: 28.5740,
    longitude: 77.3190,
    distanceKm: 2.8,
    services: ['General', 'Surgery', 'Vaccination', 'Ultrasound'],
    rating: 4.6,
    openHours: '9:00 AM - 10:00 PM'
  },
  {
    id: 'org-005',
    name: 'Vets & Pets Clinic',
    type: 'hospital',
    isVerified: true,
    phone: '+91 98234 56789',
    address: 'Sector 22, Noida, UP',
    latitude: 28.5890,
    longitude: 77.3400,
    distanceKm: 3.6,
    services: ['General', 'Emergency', 'Dental', 'Lab Tests'],
    rating: 4.7,
    openHours: '10:00 AM - 8:00 PM'
  }
];

const INITIAL_PETS: PetRecord[] = [
  {
    id: 'pet-001',
    ownerId: 'usr-001',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    ageYears: 2,
    gender: 'Male',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    petCode: 'PET-001',
    vaccinations: [
      { id: 'vac-1', name: 'Rabies', dueDate: '12 Jan 2026', status: 'Completed', administeredDate: '2026-01-12' },
      { id: 'vac-2', name: 'DHPP', dueDate: '15 Jan 2025', status: 'Completed', administeredDate: '2025-01-15' },
      { id: 'vac-3', name: 'Leptospirosis', dueDate: '10 Aug 2026', status: 'Upcoming' }
    ],
    healthRecords: [
      { id: 'hr-1', title: 'Annual Health Checkup', date: '2026-01-12', vet: 'Dr. Sharma (City Animal Hospital)', notes: 'Vitals normal, weight 28kg, active and healthy.' },
      { id: 'hr-2', title: 'Ear Canal Cleaning', date: '2025-10-18', vet: 'Dr. Gupta', notes: 'Mild yeast buildup cleared with topical ear drops.' }
    ],
    appointments: [
      { id: 'apt-1', clinic: 'City Animal Hospital', reason: 'Routine Dental Scaling', dateTime: '2026-11-05T11:00:00', status: 'Scheduled' }
    ]
  }
];

const INITIAL_WILDLIFE: WildlifeSpecies[] = [
  {
    id: 'wild-1',
    commonName: 'Bengal Tiger',
    scientificName: 'Panthera tigris tigris',
    category: 'Mammals',
    conservationStatus: 'Endangered (IUCN)',
    habitat: 'Forests at India (Jim Corbett, Ranthambore, Sundarbans)',
    diet: 'Carnivorous (Deer, Wild Boar, Gaur)',
    behavior: 'Solitary, nocturnal apex predator with expansive territorial range.',
    safetyGuidance: 'Never approach on foot. Maintain safe vehicle distance during authorized safari. Do not honk or throw food.',
    imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'wild-2',
    commonName: 'Indian Elephant',
    scientificName: 'Elephas maximus indicus',
    category: 'Mammals',
    conservationStatus: 'Endangered',
    habitat: 'Grasslands & Forests (Western Ghats, Kaziranga)',
    diet: 'Herbivorous (Grasses, tree bark, bamboo, roots)',
    behavior: 'Highly intelligent and social; lives in matriarchal herds with deep familial bonds.',
    safetyGuidance: 'Yield right of way immediately on forest roads. Avoid flash photography. Maintain at least 50m distance.',
    imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'wild-3',
    commonName: 'Snow Leopard',
    scientificName: 'Panthera uncia',
    category: 'Mammals',
    conservationStatus: 'Vulnerable',
    habitat: 'Himalayas (Ladakh, Spiti Valley, Hemis National Park)',
    diet: 'Carnivorous (Blue Sheep, Ibex, Marmots)',
    behavior: 'Known as "Ghost of the Mountains", solitary master of camouflage across rugged cliffs.',
    safetyGuidance: 'Observe only through high-powered spotting scopes with registered wildlife guides. Never track alone in avalanche zones.',
    imageUrl: 'https://images.unsplash.com/photo-1615963244664-5b845b202fce?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'wild-4',
    commonName: 'Indian Peacock',
    scientificName: 'Pavo cristatus',
    category: 'Birds',
    conservationStatus: 'Least Concern (Protected Schedule I in India)',
    habitat: 'Forests & Plains across India',
    diet: 'Omnivorous (Seeds, berries, insects, small snakes)',
    behavior: 'National bird of India; renowned for spectacular courtship displays during monsoon.',
    safetyGuidance: 'Do not disturb nesting sites or collect shed feathers from sanctuary zones.',
    imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'wild-5',
    commonName: 'Olive Ridley Sea Turtle',
    scientificName: 'Lepidochelys olivacea',
    category: 'Reptiles',
    conservationStatus: 'Vulnerable',
    habitat: 'Coastal waters & nesting beaches (Gahirmatha, Odisha)',
    diet: 'Jellyfish, crustaceans, algae',
    behavior: 'Famous for mass synchronized mass nesting termed "Arribada".',
    safetyGuidance: 'Do not use white flashlights on nesting beaches. Avoid walking on turtle eggs.',
    imageUrl: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=800&q=80'
  }
];

const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: '2 stray dogs rescued after being hit by a car in Delhi',
    summary: 'Rapid response unit from local welfare trust stabilized two injured dogs within 30 minutes of community report.',
    category: 'Top Stories',
    sourceName: 'ResQra News',
    publishedAt: 'Delhi • 2h ago',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    readTime: '3 min read'
  },
  {
    id: 'news-2',
    title: 'India reports 12 new rabies cases in 3 districts this week',
    summary: 'Public health advisory urges municipal corporations to fast-track anti-rabies vaccination drives.',
    category: 'Incidents',
    sourceName: 'Ministry of Health',
    publishedAt: 'Health • 5h ago',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
    readTime: '4 min read'
  },
  {
    id: 'news-3',
    title: 'Wildlife department warns against illegal trade in exotic birds',
    summary: 'Strict penalties announced under Wildlife Protection Act for unauthorized holding and cross-border transport.',
    category: 'Wildlife',
    sourceName: 'ResQra Wildlife',
    publishedAt: 'Wildlife • 8h ago',
    imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80',
    readTime: '2 min read'
  },
  {
    id: 'news-4',
    title: 'Trending: Increase in dog bite cases in Noida this month',
    summary: 'Data analytics indicate seasonal aggression triggers; community sterilization programs scheduled.',
    category: 'Trends',
    sourceName: 'ResQra Insights',
    publishedAt: 'Incidents • 10h ago',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80',
    readTime: '5 min read'
  }
];

const INITIAL_FUNDRAISERS: Fundraiser[] = [
  {
    id: 'fund-1',
    title: 'Help Treat Luna',
    animalName: 'Luna',
    story: 'Luna, a 4-month-old stray pup, was found with a broken leg in Noida Sector 12. She needs orthopedic pin surgery and post-operative foster care.',
    targetAmount: 50000,
    raisedAmount: 24800,
    isVerified: true,
    vetReportAvailable: true,
    updatesRegularly: true,
    imageUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    donations: [
      { id: 'don-1', donorName: 'Shivansh Patel', amount: 5000, paymentMethod: 'UPI (Demo)', date: '2026-10-15' },
      { id: 'don-2', donorName: 'Shourya Sharma', amount: 2500, paymentMethod: 'Card (Demo)', date: '2026-10-15' },
      { id: 'don-3', donorName: 'Soham', amount: 3000, paymentMethod: 'UPI (Demo)', date: '2026-10-16' },
      { id: 'don-4', donorName: 'Kind Neighbor', amount: 14300, paymentMethod: 'NetBanking (Demo)', date: '2026-10-16' }
    ]
  },
  {
    id: 'fund-2',
    title: 'Help Max Walk Again',
    animalName: 'Max',
    story: 'Max survived a hit-and-run and is undergoing spinal rehabilitation therapy and physiotherapy wheels.',
    targetAmount: 35000,
    raisedAmount: 18500,
    isVerified: true,
    vetReportAvailable: true,
    updatesRegularly: true,
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    donations: [
      { id: 'don-5', donorName: 'Anonymous Donor', amount: 8500, paymentMethod: 'UPI (Demo)', date: '2026-10-14' },
      { id: 'don-6', donorName: 'Pooja Nair', amount: 10000, paymentMethod: 'UPI (Demo)', date: '2026-10-15' }
    ]
  }
];

const INITIAL_ALERTS: AreaAlert[] = [
  {
    id: 'alt-001',
    title: 'Red Alert',
    severity: 'Red Alert',
    incidentCount: 4,
    locationName: 'Sector 12, Noida (last 24 hrs)',
    latitude: 28.5697,
    longitude: 77.3208,
    radiusMeters: 2000,
    status: 'active',
    details: 'Cluster of 4 dog bite incidents reported in Sector 12, Noida within the last 24 hours. Local municipal catchers alerted for observation.',
    guidance: 'Exercise extra caution during night walks. Avoid cornering unfamiliar dogs. Keep pets on short leashes.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_INCIDENTS: AreaIncident[] = [
  {
    id: 'inc-1',
    incidentType: 'Dog Bite',
    locationName: 'Sector 12, Market Area',
    latitude: 28.5697,
    longitude: 77.3208,
    timeAgo: '2h ago',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inc-2',
    incidentType: 'Injured Animal',
    locationName: 'Sector 8, Main Road',
    latitude: 28.5750,
    longitude: 77.3150,
    timeAgo: '4h ago',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inc-3',
    incidentType: 'Dog Bite',
    locationName: 'Sector 12, Gate 2',
    latitude: 28.5680,
    longitude: 77.3220,
    timeAgo: '8h ago',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inc-4',
    incidentType: 'Suspected Rabies',
    locationName: 'Sector 11, Park Alley',
    latitude: 28.5780,
    longitude: 77.3240,
    timeAgo: '12h ago',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

// Persistent Store Implementation
class ResQraStore {
  private dataDir = path.join(process.cwd(), 'server', 'data');
  private storeFile = path.join(this.dataDir, 'store.json');

  public reports: AnimalReport[] = [];
  public organisations: Organisation[] = [];
  public pets: PetRecord[] = [];
  public wildlife: WildlifeSpecies[] = [];
  public news: NewsArticle[] = [];
  public fundraisers: Fundraiser[] = [];
  public alerts: AreaAlert[] = [];
  public incidents: AreaIncident[] = [];
  public duplicateVotes: Array<{ reportId: string; candidateId: string; vote: string; timestamp: string }> = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      if (fs.existsSync(this.storeFile)) {
        const raw = fs.readFileSync(this.storeFile, 'utf-8');
        const parsed = JSON.parse(raw);
        this.reports = parsed.reports || INITIAL_REPORTS;
        this.organisations = parsed.organisations || INITIAL_ORGANISATIONS;
        this.pets = parsed.pets || INITIAL_PETS;
        this.wildlife = parsed.wildlife || INITIAL_WILDLIFE;
        this.news = parsed.news || INITIAL_NEWS;
        this.fundraisers = parsed.fundraisers || INITIAL_FUNDRAISERS;
        this.alerts = parsed.alerts || INITIAL_ALERTS;
        this.incidents = parsed.incidents || INITIAL_INCIDENTS;
        this.duplicateVotes = parsed.duplicateVotes || [];
      } else {
        this.reports = INITIAL_REPORTS;
        this.organisations = INITIAL_ORGANISATIONS;
        this.pets = INITIAL_PETS;
        this.wildlife = INITIAL_WILDLIFE;
        this.news = INITIAL_NEWS;
        this.fundraisers = INITIAL_FUNDRAISERS;
        this.alerts = INITIAL_ALERTS;
        this.incidents = INITIAL_INCIDENTS;
        this.save();
      }
    } catch (e) {
      console.warn('Could not load persistent store, using default memory seed:', e);
      this.reports = INITIAL_REPORTS;
      this.organisations = INITIAL_ORGANISATIONS;
      this.pets = INITIAL_PETS;
      this.wildlife = INITIAL_WILDLIFE;
      this.news = INITIAL_NEWS;
      this.fundraisers = INITIAL_FUNDRAISERS;
      this.alerts = INITIAL_ALERTS;
      this.incidents = INITIAL_INCIDENTS;
    }
  }

  public save() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(
        this.storeFile,
        JSON.stringify(
          {
            reports: this.reports,
            organisations: this.organisations,
            pets: this.pets,
            wildlife: this.wildlife,
            news: this.news,
            fundraisers: this.fundraisers,
            alerts: this.alerts,
            incidents: this.incidents,
            duplicateVotes: this.duplicateVotes
          },
          null,
          2
        ),
        'utf-8'
      );
    } catch (e) {
      console.error('Error saving store to disk:', e);
    }
  }

  // Haversine distance calculator in KM
  public calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  }
}

export const db = new ResQraStore();

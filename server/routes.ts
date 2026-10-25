import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db, AnimalReport } from './db';
import { rescueAgent } from './ai-agent';

const router = Router();

// Setup Multer for safe photo uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF images are permitted.'));
    }
  }
});

// Image Upload Endpoint
router.post('/upload', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl, filename: req.file.filename });
});

// 1. HEALTH CHECK
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    platform: 'ResQra API',
    tagline: 'Every Life Deserves a Rescue.',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    mode: process.env.GEMINI_API_KEY ? 'Production AI Enabled' : 'Intelligent Demo Mode'
  });
});

// 2. DASHBOARD AGGREGATED STATS
router.get('/dashboard', (_req: Request, res: Response) => {
  const activeRescues = db.reports.filter((r) => r.status === 'Rescue In Progress' || r.status === 'Reported').length;
  const animalsHelped = db.reports.filter((r) => r.status === 'Resolved' || r.status === 'Available for Adoption').length + 142; // cumulative community baseline
  const activeAlerts = db.alerts.filter((a) => a.status === 'active');
  const urgentCases = db.reports.filter((r) => r.urgency === 'Critical' || r.urgency === 'High');
  const adoptionReady = db.reports.filter((r) => r.status === 'Available for Adoption');
  const totalRaised = db.fundraisers.reduce((acc, f) => acc + f.raisedAmount, 0);

  res.json({
    stats: {
      activeRescues,
      animalsHelped,
      ngosConnected: db.organisations.length + 18,
      responseRate: '94%',
      totalRaised
    },
    recentReports: db.reports.slice(0, 5),
    urgentCases: urgentCases.slice(0, 3),
    adoptionReady: adoptionReady.slice(0, 3),
    activeAlerts: activeAlerts.slice(0, 2)
  });
});

// 3. ANIMAL REPORTS (CRUD & Filters)
router.get('/reports', (req: Request, res: Response) => {
  const { status, urgency, animalType, search } = req.query;
  let results = [...db.reports];

  if (status && typeof status === 'string') {
    results = results.filter((r) => r.status.toLowerCase() === status.toLowerCase());
  }
  if (urgency && typeof urgency === 'string') {
    results = results.filter((r) => r.urgency.toLowerCase() === urgency.toLowerCase());
  }
  if (animalType && typeof animalType === 'string') {
    results = results.filter((r) => r.animalType.toLowerCase() === animalType.toLowerCase());
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (r) =>
        r.caseNumber.toLowerCase().includes(q) ||
        r.locationName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }

  res.json({ reports: results, total: results.length });
});

router.get('/reports/:id', (req: Request, res: Response) => {
  const report = db.reports.find((r) => r.id === req.params.id || r.caseNumber === req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  // Find similar cases dynamically
  const similar = rescueAgent.findSimilarCases(report);
  const nearby = rescueAgent.findNearbyHelp(report.latitude, report.longitude);

  res.json({
    report,
    similarCases: similar,
    nearbyHelp: nearby.organisations
  });
});

// SUBMIT NEW REPORT
router.post('/reports', async (req: Request, res: Response) => {
  try {
    const {
      animalType = 'Dog',
      condition = 'Injured / Needs treatment',
      description = '',
      observedSymptoms = '',
      inImmediateDanger = false,
      imageUrl,
      locationName = 'Sector 12, Noida, UP',
      latitude = 28.5697,
      longitude = 77.3208,
      reporterName = 'Community Hero',
      reporterPhone = ''
    } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'An animal photograph is required for verification.' });
    }

    // Auto-generate sequential case number: Case AM-2026-XXXX
    const count = db.reports.length + 14;
    const caseNumber = `Case AM-2026-${String(count).padStart(4, '0')}`;
    const id = `rep-${Date.now()}`;

    const newReport: AnimalReport = {
      id,
      caseNumber,
      animalType,
      condition,
      urgency: inImmediateDanger ? 'Critical' : 'Moderate',
      status: 'Reported',
      inImmediateDanger: Boolean(inImmediateDanger),
      description,
      observedSymptoms,
      imageUrl,
      locationName,
      latitude: Number(latitude),
      longitude: Number(longitude),
      reporterName,
      reporterPhone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Run AI Rescue Agent Orchestration
    const assessment = await rescueAgent.orchestrateReportAnalysis(newReport);
    newReport.aiAssessment = assessment;

    // Check if new report creates an area incident
    if (condition.includes('Injured') || inImmediateDanger) {
      db.incidents.unshift({
        id: `inc-${Date.now()}`,
        incidentType: 'Injured Animal',
        locationName,
        latitude: Number(latitude),
        longitude: Number(longitude),
        timeAgo: 'Just now',
        createdAt: new Date().toISOString()
      });
    }

    db.reports.unshift(newReport);
    db.save();

    res.status(201).json({
      success: true,
      caseNumber: newReport.caseNumber,
      report: newReport,
      message: 'Rescue report filed successfully and verified by ResQra AI Agent.'
    });
  } catch (err: any) {
    console.error('Error submitting report:', err);
    res.status(500).json({ error: err.message || 'Server error creating report' });
  }
});

// UPDATE CASE STATUS
router.patch('/reports/:id/status', (req: Request, res: Response) => {
  const { status, notes } = req.body;
  const report = db.reports.find((r) => r.id === req.params.id || r.caseNumber === req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const validStatuses = [
    'Reported',
    'Under Review',
    'Help Requested',
    'Rescue In Progress',
    'Treatment In Progress',
    'Available for Adoption',
    'Resolved',
    'Rejected as Invalid'
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  report.status = status;
  if (notes && typeof notes === 'string' && notes.trim()) {
    report.description = report.description + String.fromCharCode(10) + '[Update ' + new Date().toLocaleDateString() + ']: ' + notes.trim();
  }
  report.updatedAt = new Date().toISOString();
  db.save();

  res.json({
    success: true,
    report,
    message: `Status updated to "${status}" successfully.`
  });
});

// RUN AI ANALYSIS
router.post('/reports/:id/analyse', async (req: Request, res: Response) => {
  const report = db.reports.find((r) => r.id === req.params.id || r.caseNumber === req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  try {
    const assessment = await rescueAgent.orchestrateReportAnalysis(report);
    res.json({
      success: true,
      assessment,
      report
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Error executing AI Rescue Agent' });
  }
});

// NEARBY HELP (TOOL C)
router.get('/nearby-help', (req: Request, res: Response) => {
  const lat = Number(req.query.lat) || 28.5697;
  const lon = Number(req.query.lon) || 77.3208;
  const type = req.query.type as string; // 'ngo' | 'hospital' | 'all'
  const radius = Number(req.query.radius) || 15;

  let help = rescueAgent.findNearbyHelp(lat, lon, radius).organisations;
  if (type && type !== 'all') {
    help = help.filter((o) => o.type === type);
  }

  res.json({
    organisations: help,
    userLocation: { latitude: lat, longitude: lon },
    count: help.length
  });
});

// DUPLICATE VOTE (Section 11)
router.post('/reports/:id/duplicate-vote', (req: Request, res: Response) => {
  const { candidateId, vote } = req.body; // 'same_case' | 'different_case' | 'not_sure'
  if (!['same_case', 'different_case', 'not_sure'].includes(vote)) {
    return res.status(400).json({ error: 'Vote must be one of: same_case, different_case, not_sure' });
  }

  db.duplicateVotes.push({
    reportId: req.params.id,
    candidateId: candidateId || '',
    vote,
    timestamp: new Date().toISOString()
  });
  db.save();

  res.json({
    success: true,
    message: 'Thank you! Community verification vote recorded.',
    totalVotesForCandidate: db.duplicateVotes.filter((v) => v.candidateId === candidateId).length
  });
});

// 4. AREA ALERTS & INCIDENT ANALYTICS (Section 12)
router.get('/alerts', (_req: Request, res: Response) => {
  res.json({
    alerts: db.alerts,
    incidents: db.incidents
  });
});

router.post('/alerts/evaluate', (req: Request, res: Response) => {
  const lat = Number(req.body.lat) || 28.5697;
  const lon = Number(req.body.lon) || 77.3208;
  const radius = Number(req.body.radiusMeters) || 2500;

  const result = rescueAgent.evaluateAreaRisk(lat, lon, radius, 24);
  if (result.warrantsAlert && result.alertSeverity) {
    // Check if duplicate alert already exists
    const existing = db.alerts.find((a) => a.status === 'active' && a.severity === result.alertSeverity);
    if (!existing) {
      const newAlert: AreaAlert = {
        id: `alt-${Date.now()}`,
        title: result.alertSeverity,
        severity: result.alertSeverity,
        incidentCount: result.incidentCount,
        locationName: 'Sector 12, Noida Area',
        latitude: lat,
        longitude: lon,
        radiusMeters: radius,
        status: 'active',
        details: result.summary,
        guidance: result.recommendedGuidance,
        createdAt: new Date().toISOString()
      };
      db.alerts.unshift(newAlert);
      db.save();
    }
  }

  res.json({ success: true, evaluation: result, alerts: db.alerts });
});

router.patch('/alerts/:id/status', (req: Request, res: Response) => {
  const alert = db.alerts.find((a) => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }

  const { status } = req.body;
  if (!['active', 'under_review', 'resolved', 'dismissed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  alert.status = status;
  db.save();
  res.json({ success: true, alert });
});

// 5. PET OWNER PORTAL (Section 13)
router.get('/pets', (_req: Request, res: Response) => {
  res.json({ pets: db.pets });
});

router.post('/pets', (req: Request, res: Response) => {
  const { name, species = 'Dog', breed, ageYears, gender = 'Male', photoUrl } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Pet name is required' });
  }

  const newPet = {
    id: `pet-${Date.now()}`,
    ownerId: 'usr-001',
    name,
    species,
    breed: breed || 'Mixed Breed',
    ageYears: Number(ageYears) || 1,
    gender,
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    petCode: `PET-${String(db.pets.length + 1).padStart(3, '0')}`,
    vaccinations: [
      { id: `vac-${Date.now()}-1`, name: 'Rabies', dueDate: '2026-12-15', status: 'Completed' as const, administeredDate: '2026-01-10' }
    ],
    healthRecords: [],
    appointments: []
  };

  db.pets.push(newPet);
  db.save();

  res.status(201).json({ success: true, pet: newPet });
});

router.post('/pets/:id/vaccinations', (req: Request, res: Response) => {
  const pet = db.pets.find((p) => p.id === req.params.id);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });

  const { name, dueDate, status = 'Upcoming', administeredDate } = req.body;
  const newVac = {
    id: `vac-${Date.now()}`,
    name: name || 'Core Vaccine',
    dueDate: dueDate || new Date().toISOString().split('T')[0],
    status,
    administeredDate
  };

  pet.vaccinations.push(newVac);
  db.save();
  res.status(201).json({ success: true, pet });
});

router.post('/pets/:id/appointments', (req: Request, res: Response) => {
  const pet = db.pets.find((p) => p.id === req.params.id);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });

  const { clinic, reason, dateTime } = req.body;
  const newApt = {
    id: `apt-${Date.now()}`,
    clinic: clinic || 'City Animal Hospital',
    reason: reason || 'Wellness Check',
    dateTime: dateTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Scheduled' as const
  };

  pet.appointments.push(newApt);
  db.save();
  res.status(201).json({ success: true, pet });
});

// 6. WILDLIFE EXPLORER (Section 14)
router.get('/wildlife', (req: Request, res: Response) => {
  const category = req.query.category as string;
  let list = db.wildlife;
  if (category && category !== 'All') {
    list = list.filter((w) => w.category.toLowerCase() === category.toLowerCase());
  }
  res.json({ species: list });
});

// 7. ANIMAL NEWS & INSIGHTS (Section 15)
router.get('/news', (req: Request, res: Response) => {
  const category = req.query.category as string;
  let list = db.news;
  if (category && category !== 'All' && category !== 'Top Stories') {
    list = list.filter((n) => n.category.toLowerCase() === category.toLowerCase());
  }
  res.json({ articles: list });
});

// 8. FUNDRAISING & DEMO DONATIONS (Section 16)
router.get('/fundraisers', (_req: Request, res: Response) => {
  res.json({ fundraisers: db.fundraisers });
});

router.post('/fundraisers/:id/donate', (req: Request, res: Response) => {
  const fundraiser = db.fundraisers.find((f) => f.id === req.params.id);
  if (!fundraiser) {
    return res.status(404).json({ error: 'Fundraiser campaign not found' });
  }

  const { donorName = 'Kind Heart', amount = 1000, paymentMethod = 'UPI (Demo)' } = req.body;
  const numAmount = Number(amount);

  fundraiser.raisedAmount += numAmount;
  const donationEntry = {
    id: `don-${Date.now()}`,
    donorName,
    amount: numAmount,
    paymentMethod,
    date: new Date().toISOString().split('T')[0]
  };

  fundraiser.donations.unshift(donationEntry);
  if (fundraiser.raisedAmount >= fundraiser.targetAmount) {
    fundraiser.status = 'completed';
  }
  db.save();

  res.json({
    success: true,
    message: `Thank you, ${donorName}! Your demo donation of ₹${numAmount.toLocaleString('en-IN')} has been recorded.`,
    isDemo: true,
    receiptId: `RESQRA-DON-${Date.now().toString().slice(-6)}`,
    fundraiser
  });
});

export default router;

# ResQra — AI-Powered Animal Rescue & Welfare Platform

> **Tagline:** Every Life Deserves a Rescue.

ResQra is a complete, mobile-first full-stack web application designed to connect citizens, animal welfare organisations (NGOs), veterinary hospitals, and municipal responders through real-time AI triage, spatial mapping, community duplicate verification, area alert clustering, pet management, wildlife education, and crowdfunding.

---

## 🐾 Reference Image Screen Parity & Architecture

ResQra has been engineered to match all 14 design screens in the reference specification:

1. **Splash / Welcome Screen (`/`)**:
   - Original Paw + Heart SVG logo with brand gradient
   - Rescue hero photography
   - "A safer world for all animals"
   - "Get Started ->" and "Explore Demo Mode"

2. **Home Dashboard (`/home`)**:
   - Hero banner: *"They can't ask for help... But you can."* with instant "Report an Animal" CTA
   - 6 Quick Action icons: **Report Animal**, **Find Nearby NGOs**, **Vet Hospitals**, **Pet Owner Portal**, **Wildlife Info**, **Raise Funds**
   - Active area alert banner with direct triage access
   - Live community statistics: Active Rescues (2), Animals Helped (143+), NGOs Connected (23), Response Rate (94%)
   - Recent Reports Near You list (featuring *Injured Dog* in Sector 12, Noida with urgency badges)
   - Adoption-Ready spotlight card

3. **Report an Animal — Core Workflow (`/report`)**:
   - Multi-step wizard: **Photo -> Details -> Location -> Review & Submit**
   - Photo upload with drag-and-drop, camera access, 10MB limits, and pre-detection badge *"Animal detected ✓"*
   - Animal Type selection pills: *Dog, Cat, Bird, Wild Animal, Other*
   - Condition radio options: *Healthy/Adoption, Injured/Needs Treatment, Seems Ill, Mentally Disturbed/Distressed*
   - Immediate danger flag with automatic triage escalation
   - Interactive Leaflet pin picker and GPS geolocation lookup
   - Submits to backend `/api/reports`, persists to database, generates sequential Case ID (`Case AM-2026-XXXX`), and redirects directly to AI Analysis

4. **AI Analysis & Urgency Screen (`/reports/:id/analysis`)**:
   - High Emergency Level red banner with glowing alert icon
   - AI Image Verification card with confidence, species confirmation, and limitations
   - Urgency Assessment explanation and observed evidence
   - Numbered situation-specific Recommended Next Steps
   - Nearest matched NGOs with 1-click phone call buttons (People for Animals, Blue Cross Society)
   - Visible medical disclaimer: *"Preliminary assessment only — not a veterinary diagnosis"*

5. **Nearby Help & Rescue Map (`/map`)**:
   - Leaflet OpenStreetMap with custom SVG pin markers (Emerald paws for NGOs, Blue crosses for Hospitals, Red pins for Urgent Cases)
   - Filter tabs: *All, NGOs, Hospitals, Urgent Cases*
   - Nearest Veterinary Hospitals list (City Animal Hospital 1.2km, Pet Care Hospital 2.8km, Vets & Pets Clinic 3.6km) with *"Get Directions"* and *"Call"*
   - Location search and radius filtering

6. **Case Details & Tracking (`/cases/:id`)**:
   - Case ID header (`Case AM-2026-0012`) with status badge (*Rescue In Progress*)
   - High-res photo, GPS coordinates, distance, and timestamp
   - AI Suggested Actions interactive checklist
   - Related Cases / Duplicate Candidate detection with community voting buttons (*Yes, Same Case / No, Different / Not Sure*)
   - Status update modal allowing responders to update status and record treatment observations

7. **Pet Owner Portal (`/pets`)**:
   - Pet Profile card for **Buddy** (*Golden Retriever, 2 years, ID: PET-001*)
   - Tabs: *Health Records, Vaccinations, Appointments*
   - Vaccination schedule (Rabies: Completed, DHPP: Completed, Leptospirosis: Upcoming)
   - Modal to add new pet profiles, vaccination entries, and vet appointments
   - AI Health Summary highlighting upcoming booster dates and preventive advice

8. **Wildlife Guide / Explorer (`/wildlife`)**:
   - Searchable encyclopedia with category filters: *Mammals, Birds, Reptiles, Amphibians, Fish, Insects*
   - Native Indian species cards: *Bengal Tiger, Indian Elephant, Snow Leopard, Indian Peacock, Olive Ridley Sea Turtle, Indian Cobra*
   - Detailed modal with IUCN status, habitat, diet, and behavior
   - Ethical observation & anti-poaching advisory (obfuscating sensitive GPS coordinates)

9. **Animal News & Insights (`/news`)**:
   - Tabs: *Top Stories, Incidents, Trends, Saved*
   - Curated articles: Delhi stray dogs rescue, rabies public health advisory, exotic birds trade warnings, Noida dog bite trend
   - Interactive Recharts analytics displaying monthly incident vs rescue resolution trends
   - LocalStorage bookmarking functionality

10. **Raise Funds (`/fundraisers`)**:
    - Featured campaign: **Help Treat Luna** (*₹24,800 raised of ₹50,000 — 50% animated progress bar*)
    - Verification badges: *ResQra Verified Case, Vet Report Available, Updates Regularly*
    - Interactive **Donate Now** modal with amount chips (₹500, ₹1000, ₹2500), UPI/Card selectors, DEMO mode labeling, and celebratory confetti
    - Live campaign total and donor list updates

11. **Area Alerts & Incident Analytics (`/alerts`)**:
    - Red Alert banner: *High number of dog bite reports in Sector 12, Noida (last 24 hrs)*
    - Interactive Incident Cluster Map with 2000m danger circle
    - Incident list with timestamps
    - **Trigger AI Area Risk Evaluation** button running Tool G (`evaluate_area_risk`)
    - Moderator controls: *Confirm, Dismiss, Resolve Alert*

12. **Menu, Profile & Settings (`/profile`)**:
    - User avatar: **Shivansh** (`shivansh@example.com`, BPIT)
    - Role simulator: Citizen vs Verified Responder
    - Menu links: *My Reports, My Pets, Saved Articles, Donations, Help & Support, About Us, Logout*
    - Notification preferences and GPS privacy controls

13. **Theme Settings (Screen 13)**:
    - **Light Theme**: Fresh white background with teal-500 and emerald-600 accents
    - **Dark Theme**: Midnight slate/teal background with neon emerald borders
    - **Liquid Glass Theme**: Translucent glass surfaces (`backdrop-blur-xl`, ambient mesh glow, specular highlights)
    - **Use System Theme** toggle switch

14. **About Us — Founders (`/about`)**:
    - Tagline & ResQra mission statement
    - Three Founders with BPIT institution:
      1. **Shivansh Patel** — BPIT (Founder & Developer)
      2. **Shourya Sharma** — BPIT (Co-Founder & Developer)
      3. **Soham** — BPIT (Co-Founder & Designer)
    - Closing quote: *"Together for a kinder world."*

---

## 🤖 ResQra AI Rescue Agent (7 Tools)

The backend includes a dedicated orchestration layer (`server/ai-agent.ts`) implementing 7 structured tools:

- **Tool A (`verify_animal_image`)**: Inspects image pixels, verifies animal presence, detects species, checks image quality, and identifies optical limitations.
- **Tool B (`find_similar_cases`)**: Evaluates candidate reports within a 10 km radius using time delta, animal type, and distance to identify possible duplicates.
- **Tool C (`find_nearby_help`)**: Queries verified NGOs, shelters, and 24x7 vet hospitals with Haversine distance calculations and navigation routes.
- **Tool D (`assess_urgency`)**: Evaluates symptom text and condition flags using deterministic safety rules to prevent dismissing severe hemorrhages, vehicle strikes, or respiratory distress.
- **Tool E (`generate_action_plan`)**: Produces situational first-responder steps, warnings against human medication (e.g. Paracetamol toxicity), and rabies post-exposure prophylaxis advisories.
- **Tool F (`create_case_summary`)**: Generates structured summaries and persists triage results to the database audit log.
- **Tool G (`evaluate_area_risk`)**: Analyzes 24h rolling incident density against operational thresholds (e.g. 3+ bite incidents in 2.5km) to trigger municipal area alerts.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, React Router v7, Recharts, Leaflet & React Leaflet, Canvas Confetti.
- **Backend**: Node.js & Express 5, TypeScript (`tsx`), Multer (safe multipart uploads), CORS, persistent file store (`server/data/store.json`).
- **Database**: Complete Supabase PostgreSQL schema (`supabase/schema.sql`) with 22 relational tables, Row Level Security (RLS) policies, spatial indexes, and audit triggers.
- **AI Orchestration**: Multi-provider support (Google Gemini 1.5 Flash Vision / OpenAI) with an intelligent, deterministic fallback adapter when API keys are not supplied.

---

## 🚀 Quick Start Instructions

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **npm** v9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Application
To run the full stack (Frontend + Backend) concurrently:
```bash
npm run dev
```
- **Frontend App**: Open [http://localhost:5173](http://localhost:5173)
- **Backend API**: Running on [http://localhost:3001](http://localhost:3001)

Alternatively, to build and run the production single-port server:
```bash
npm run build
npm start
```
Open [http://localhost:3001](http://localhost:3001).

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root (see `.env.example`):

```env
PORT=3001

# Optional: Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Optional: Google Gemini API key for real Vision verification
GEMINI_API_KEY=your-gemini-key

# Optional: OpenAI API key
OPENAI_API_KEY=your-openai-key
```

> **Note:** If no external API keys are provided, ResQra automatically activates its built-in **Intelligent Demo Mode**. All 7 AI tools, photo uploads, database persistence, duplicate detection, and donation simulations work 100% reliably without requiring external keys.

---

## 🗄️ Database & Supabase Setup

The repository includes a production-ready PostgreSQL migration file in [supabase/schema.sql](supabase/schema.sql).

To deploy to Supabase:
1. Open your [Supabase Dashboard](https://supabase.com).
2. Navigate to the **SQL Editor**.
3. Paste the contents of `supabase/schema.sql` and run the script.
4. All 22 tables (`profiles`, `animal_reports`, `ai_assessments`, `organisations`, `pets`, `wildlife_species`, `news_articles`, `fundraisers`, `donations`, etc.) will be created with Row Level Security enabled.

---

## 🧪 Automated Testing

ResQra includes an automated test suite verifying all 7 AI tools and core rescue pipelines:
```bash
npx tsx server/test-flows.ts
```
Expected output:
```
🧪 Starting ResQra Comprehensive Verification Tests...
✓ Database initialized with reports and organisations.
✓ Tool A (verify_animal_image) passed.
✓ Tool D (assess_urgency deterministic safety rules) passed.
✓ Tool E (generate_action_plan) passed.
✓ Tool C (find_nearby_help) passed.
✓ Tool B (find_similar_cases) passed.
✓ Tool G (evaluate_area_risk) passed.
✓ Full AI Rescue Orchestration Submission passed.
✓ Donation simulation passed.
✓ Pet Portal records verified.
🎉 ALL 10 CORE RESQRA BACKEND TESTS PASSED SUCCESSFULLY!
```

---

## 👥 ResQra Founders

- **Shivansh Patel** — BPIT (Founder & Developer)
- **Shourya Sharma** — BPIT (Co-Founder & Developer)
- **Soham** — BPIT (Co-Founder & Designer)

*Together for a kinder world.*

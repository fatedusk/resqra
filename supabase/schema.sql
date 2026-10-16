-- ============================================================================
-- ResQra Supabase PostgreSQL Database Schema
-- Tagline: Every Life Deserves a Rescue
-- ============================================================================

-- Enable UUID and PostGIS extensions if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Authenticated Users & Responders)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'responder', 'ngo_staff', 'vet', 'moderator', 'admin')),
    institution TEXT DEFAULT 'BPIT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ORGANISATIONS (NGOs, Shelters, Vet Hospitals)
CREATE TABLE IF NOT EXISTS organisations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ngo', 'hospital', 'shelter', 'clinic', 'wildlife_centre')),
    is_verified BOOLEAN DEFAULT TRUE,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    opening_hours TEXT DEFAULT '24x7 / Emergency Services',
    services TEXT[] DEFAULT ARRAY['Rescue', 'First Aid', 'Shelter'],
    rating NUMERIC(2,1) DEFAULT 4.8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ANIMAL REPORTS (Core rescue incident reports)
CREATE TABLE IF NOT EXISTS animal_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number TEXT UNIQUE NOT NULL, -- e.g. AM-2026-0012
    reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reporter_name TEXT,
    reporter_phone TEXT,
    animal_type TEXT NOT NULL CHECK (animal_type IN ('Dog', 'Cat', 'Bird', 'Wild Animal', 'Cattle', 'Other')),
    condition TEXT NOT NULL CHECK (condition IN (
        'Healthy / Available for adoption',
        'Injured / Needs treatment',
        'Seems ill',
        'Mentally disturbed / Distressed',
        'In Immediate Danger'
    )),
    urgency TEXT NOT NULL DEFAULT 'Moderate' CHECK (urgency IN ('Critical', 'High', 'Moderate', 'Low')),
    status TEXT NOT NULL DEFAULT 'Reported' CHECK (status IN (
        'Reported',
        'Under Review',
        'Help Requested',
        'Rescue In Progress',
        'Treatment In Progress',
        'Available for Adoption',
        'Resolved',
        'Rejected as Invalid'
    )),
    in_immediate_danger BOOLEAN DEFAULT FALSE,
    description TEXT,
    observed_symptoms TEXT,
    image_url TEXT NOT NULL,
    location_name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    assigned_org_id UUID REFERENCES organisations(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. REPORT IMAGES
CREATE TABLE IF NOT EXISTS report_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES animal_reports(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AI ASSESSMENTS (Tool orchestration output)
CREATE TABLE IF NOT EXISTS ai_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES animal_reports(id) ON DELETE CASCADE,
    animal_detected BOOLEAN NOT NULL DEFAULT TRUE,
    detected_species TEXT,
    image_quality TEXT DEFAULT 'good',
    confidence NUMERIC(3,2) DEFAULT 0.95,
    urgency_level TEXT NOT NULL CHECK (urgency_level IN ('Critical', 'High', 'Moderate', 'Low')),
    reasoning TEXT NOT NULL,
    observed_evidence TEXT[] DEFAULT ARRAY[]::TEXT[],
    action_plan JSONB NOT NULL DEFAULT '[]'::JSONB,
    safety_warnings TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CASE STATUS HISTORY (Audit trail)
CREATE TABLE IF NOT EXISTS case_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES animal_reports(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    notes TEXT,
    changed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. DUPLICATE CANDIDATES & VOTES
CREATE TABLE IF NOT EXISTS duplicate_candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_report_id UUID REFERENCES animal_reports(id) ON DELETE CASCADE,
    candidate_report_id UUID REFERENCES animal_reports(id) ON DELETE CASCADE,
    distance_km NUMERIC(5,2),
    similarity_score NUMERIC(3,2),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed_duplicate', 'marked_distinct')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS duplicate_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    duplicate_candidate_id UUID REFERENCES duplicate_candidates(id) ON DELETE CASCADE,
    voter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    vote TEXT NOT NULL CHECK (vote IN ('same_case', 'different_case', 'not_sure')),
    ip_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. AREA INCIDENTS & ALERTS
CREATE TABLE IF NOT EXISTS area_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_type TEXT NOT NULL CHECK (incident_type IN ('Dog Bite', 'Injured Animal', 'Suspected Rabies', 'Cruelty Case', 'Wildlife Sighting', 'Other')),
    severity TEXT NOT NULL DEFAULT 'Moderate' CHECK (severity IN ('Critical', 'High', 'Moderate', 'Low')),
    location_name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    report_id UUID REFERENCES animal_reports(id),
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS area_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('Red Alert', 'Orange Warning', 'Yellow Advisory')),
    incident_count INT NOT NULL DEFAULT 1,
    location_name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    radius_meters INT DEFAULT 2000,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'under_review', 'resolved', 'dismissed')),
    details TEXT NOT NULL,
    guidance TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PET OWNER PORTAL (Pets, Vaccinations, Health Records, Appointments)
CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    species TEXT NOT NULL DEFAULT 'Dog',
    breed TEXT,
    age_years NUMERIC(3,1),
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Unknown')),
    photo_url TEXT,
    microchip_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pet_vaccinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
    vaccine_name TEXT NOT NULL,
    date_administered DATE,
    due_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Completed', 'Upcoming', 'Overdue')),
    administered_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pet_health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
    record_type TEXT NOT NULL,
    title TEXT NOT NULL,
    notes TEXT,
    veterinarian TEXT,
    record_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pet_appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
    clinic_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. WILDLIFE ENCYCLOPEDIA
CREATE TABLE IF NOT EXISTS wildlife_species (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    common_name TEXT NOT NULL,
    scientific_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Mammals', 'Birds', 'Reptiles', 'Amphibians', 'Fish', 'Insects')),
    conservation_status TEXT NOT NULL, -- Endangered, Vulnerable, etc.
    habitat TEXT NOT NULL,
    diet TEXT NOT NULL,
    behavior TEXT NOT NULL,
    safety_guidance TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. ANIMAL NEWS & INSIGHTS
CREATE TABLE IF NOT EXISTS news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Top Stories', 'Incidents', 'Trends', 'Wildlife', 'Public Health')),
    source_name TEXT NOT NULL,
    source_url TEXT,
    image_url TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    article_id UUID REFERENCES news_articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

-- 12. FUNDRAISERS & DONATIONS
CREATE TABLE IF NOT EXISTS fundraisers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    animal_name TEXT NOT NULL,
    story TEXT NOT NULL,
    report_id UUID REFERENCES animal_reports(id),
    target_amount NUMERIC(10,2) NOT NULL,
    raised_amount NUMERIC(10,2) DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT TRUE,
    vet_report_available BOOLEAN DEFAULT TRUE,
    image_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fundraiser_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fundraiser_id UUID REFERENCES fundraisers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fundraiser_id UUID REFERENCES fundraisers(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    donor_name TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT DEFAULT 'UPI (Demo)',
    is_demo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('alert', 'case_update', 'donation', 'pet_reminder')),
    is_read BOOLEAN DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE & DISTANCE LOOKUPS
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_animal_reports_urgency ON animal_reports(urgency);
CREATE INDEX IF NOT EXISTS idx_animal_reports_status ON animal_reports(status);
CREATE INDEX IF NOT EXISTS idx_animal_reports_location ON animal_reports(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_organisations_location ON organisations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_area_alerts_status ON area_alerts(status);
CREATE INDEX IF NOT EXISTS idx_area_incidents_time ON area_incidents(occurred_at);
CREATE INDEX IF NOT EXISTS idx_pet_vaccinations_due ON pet_vaccinations(due_date);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE animal_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_appointments ENABLE ROW LEVEL SECURITY;

-- Allow public read of non-sensitive report details
CREATE POLICY "Public can view animal reports" ON animal_reports FOR SELECT USING (true);
CREATE POLICY "Authenticated users can submit reports" ON animal_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can only modify their own pets" ON pets FOR ALL USING (auth.uid() = owner_id);

-- End of Supabase Schema

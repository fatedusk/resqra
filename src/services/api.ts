import {
  AnimalReport,
  Organisation,
  PetRecord,
  WildlifeSpecies,
  NewsArticle,
  Fundraiser,
  AreaAlert,
  AreaIncident,
  AIAssessment
} from '../types';

const API_BASE = '/api';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Dashboard Aggregates
  async getDashboard() {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json() as Promise<{
      stats: {
        activeRescues: number;
        animalsHelped: number;
        ngosConnected: number;
        responseRate: string;
        totalRaised: number;
      };
      recentReports: AnimalReport[];
      urgentCases: AnimalReport[];
      adoptionReady: AnimalReport[];
      activeAlerts: AreaAlert[];
    }>;
  },

  // Reports
  async getReports(params?: { status?: string; urgency?: string; animalType?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/reports?${query}`);
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json() as Promise<{ reports: AnimalReport[]; total: number }>;
  },

  async getReportById(id: string) {
    const res = await fetch(`${API_BASE}/reports/${id}`);
    if (!res.ok) throw new Error('Report not found');
    return res.json() as Promise<{
      report: AnimalReport;
      similarCases: any[];
      nearbyHelp: Organisation[];
    }>;
  },

  async submitReport(formData: {
    animalType: string;
    condition: string;
    description: string;
    observedSymptoms?: string;
    inImmediateDanger: boolean;
    imageUrl: string;
    locationName: string;
    latitude: number;
    longitude: number;
    reporterName?: string;
  }) {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit report');
    }
    return res.json() as Promise<{
      success: boolean;
      caseNumber: string;
      report: AnimalReport;
      message: string;
    }>;
  },

  async updateReportStatus(id: string, status: string, notes?: string) {
    const res = await fetch(`${API_BASE}/reports/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  async analyzeReport(id: string) {
    const res = await fetch(`${API_BASE}/reports/${id}/analyse`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to run AI analysis');
    return res.json() as Promise<{ success: boolean; assessment: AIAssessment; report: AnimalReport }>;
  },

  async voteDuplicate(reportId: string, candidateId: string, vote: 'same_case' | 'different_case' | 'not_sure') {
    const res = await fetch(`${API_BASE}/reports/${reportId}/duplicate-vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId, vote })
    });
    if (!res.ok) throw new Error('Failed to record duplicate vote');
    return res.json();
  },

  // Image Upload
  async uploadImage(file: File): Promise<{ success: boolean; url: string; filename: string }> {
    const form = new FormData();
    form.append('image', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: form
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to upload image');
    }
    return res.json();
  },

  // Nearby Help
  async getNearbyHelp(lat: number, lon: number, type?: string, radius?: number) {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      ...(type ? { type } : {}),
      ...(radius ? { radius: String(radius) } : {})
    });
    const res = await fetch(`${API_BASE}/nearby-help?${params}`);
    if (!res.ok) throw new Error('Failed to fetch nearby help');
    return res.json() as Promise<{
      organisations: Organisation[];
      userLocation: { latitude: number; longitude: number };
      count: number;
    }>;
  },

  // Alerts & Incidents
  async getAlerts() {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json() as Promise<{ alerts: AreaAlert[]; incidents: AreaIncident[] }>;
  },

  async evaluateAreaRisk(lat: number, lon: number, radiusMeters: number = 2500) {
    const res = await fetch(`${API_BASE}/alerts/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lon, radiusMeters })
    });
    if (!res.ok) throw new Error('Failed to evaluate area risk');
    return res.json();
  },

  async updateAlertStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/alerts/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update alert');
    return res.json();
  },

  // Pet Owner Portal
  async getPets() {
    const res = await fetch(`${API_BASE}/pets`);
    if (!res.ok) throw new Error('Failed to fetch pets');
    return res.json() as Promise<{ pets: PetRecord[] }>;
  },

  async addPet(data: Partial<PetRecord>) {
    const res = await fetch(`${API_BASE}/pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add pet');
    return res.json();
  },

  async addVaccination(petId: string, data: any) {
    const res = await fetch(`${API_BASE}/pets/${petId}/vaccinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add vaccination');
    return res.json();
  },

  async addAppointment(petId: string, data: any) {
    const res = await fetch(`${API_BASE}/pets/${petId}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to schedule appointment');
    return res.json();
  },

  // Wildlife Guide
  async getWildlife(category?: string) {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${API_BASE}/wildlife${query}`);
    if (!res.ok) throw new Error('Failed to fetch wildlife');
    return res.json() as Promise<{ species: WildlifeSpecies[] }>;
  },

  // News & Insights
  async getNews(category?: string) {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${API_BASE}/news${query}`);
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json() as Promise<{ articles: NewsArticle[] }>;
  },

  // Fundraisers & Demo Donations
  async getFundraisers() {
    const res = await fetch(`${API_BASE}/fundraisers`);
    if (!res.ok) throw new Error('Failed to fetch fundraisers');
    return res.json() as Promise<{ fundraisers: Fundraiser[] }>;
  },

  async donateToCampaign(id: string, donorName: string, amount: number, paymentMethod: string) {
    const res = await fetch(`${API_BASE}/fundraisers/${id}/donate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donorName, amount, paymentMethod })
    });
    if (!res.ok) throw new Error('Failed to process donation');
    return res.json() as Promise<{
      success: boolean;
      message: string;
      isDemo: boolean;
      receiptId: string;
      fundraiser: Fundraiser;
    }>;
  }
};

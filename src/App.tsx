import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';

// Pages
import { WelcomePage } from './pages/WelcomePage';
import { HomePage } from './pages/HomePage';
import { ReportPage } from './pages/ReportPage';
import { AIAnalysisPage } from './pages/AIAnalysisPage';
import { NearbyMapPage } from './pages/NearbyMapPage';
import { CaseDetailsPage } from './pages/CaseDetailsPage';
import { PetsPage } from './pages/PetsPage';
import { WildlifePage } from './pages/WildlifePage';
import { NewsPage } from './pages/NewsPage';
import { FundraisersPage } from './pages/FundraisersPage';
import { AlertsPage } from './pages/AlertsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutUsPage } from './pages/AboutUsPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const isSplash = location.pathname === '/';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        theme === 'liquid-glass' ? 'liquid-glass-bg text-white' : ''
      }`}
    >
      {!isSplash && <Navbar />}
      <main className="flex-1 w-full">{children}</main>
      {!isSplash && <BottomNav />}
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/reports/:id/analysis" element={<AIAnalysisPage />} />
              <Route path="/map" element={<NearbyMapPage />} />
              <Route path="/cases/:id" element={<CaseDetailsPage />} />
              <Route path="/pets" element={<PetsPage />} />
              <Route path="/wildlife" element={<WildlifePage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/fundraisers" element={<FundraisersPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

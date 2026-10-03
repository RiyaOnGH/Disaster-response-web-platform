import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { ToastContainer } from './components/layout/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { EmergencyPage } from './pages/EmergencyPage';
import { RescueMeshPage } from './pages/RescueMeshPage';
import { HelpPage } from './pages/HelpPage';
import { MapPage } from './pages/MapPage';
import { UpdatesPage } from './pages/UpdatesPage';
import { ReportPage } from './pages/ReportPage';
import { RecoveryPage } from './pages/RecoveryPage';
import { GuidancePage } from './pages/GuidancePage';
import { ResponseDashboardPage } from './pages/ResponseDashboardPage';
import { SosDashboardPage } from './pages/SosDashboardPage';
import { ReportsDashboardPage } from './pages/ReportsDashboardPage';
import { TasksDashboardPage } from './pages/TasksDashboardPage';
import { ImpactDashboardPage } from './pages/ImpactDashboardPage';
import { AnalyticsDashboardPage } from './pages/AnalyticsDashboardPage';

const AppContent: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Keep browser history and state in sync
  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/emergency':
        return <EmergencyPage onNavigate={navigate} />;
      case '/rescue-mesh':
        return <RescueMeshPage onNavigate={navigate} />;
      case '/help':
        return <HelpPage onNavigate={navigate} />;
      case '/map':
        return <MapPage onNavigate={navigate} />;
      case '/updates':
        return <UpdatesPage onNavigate={navigate} />;
      case '/report':
        return <ReportPage onNavigate={navigate} />;
      case '/recovery':
        return <RecoveryPage onNavigate={navigate} />;
      case '/guidance':
        return <GuidancePage onNavigate={navigate} />;
      case '/dashboard':
        return <ResponseDashboardPage onNavigate={navigate} />;
      case '/dashboard/sos':
        return <SosDashboardPage onNavigate={navigate} />;
      case '/dashboard/reports':
        return <ReportsDashboardPage onNavigate={navigate} />;
      case '/dashboard/tasks':
        return <TasksDashboardPage onNavigate={navigate} />;
      case '/dashboard/impact':
        return <ImpactDashboardPage />;
      case '/dashboard/analytics':
        return <AnalyticsDashboardPage />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-red-500 selection:text-white">
      
      {/* Global Header with Network simulator & notifications */}
      <Header currentRoute={currentRoute} onNavigate={navigate} />

      {/* Persistent Offline alert when network disconnected */}
      <OfflineBanner onNavigate={navigate} />

      {/* Main Workspace with Desktop Sidebar & Main Scrollable View */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar currentRoute={currentRoute} onNavigate={navigate} />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Mobile Touch-first Bottom Navigation */}
      <MobileBottomNav currentRoute={currentRoute} onNavigate={navigate} />

      {/* Floating live Toasts */}
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

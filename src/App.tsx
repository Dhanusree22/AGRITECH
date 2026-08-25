import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MarketplacePage } from './pages/MarketplacePage';
import { AIChatbotWidget } from './components/ai/AIChatbotWidget';
import { GlobalVoiceButton } from './components/voice/GlobalVoiceButton';
import { VoiceAssistantModal } from './components/voice/VoiceAssistantModal';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/';
  });
  const [voiceOpen, setVoiceOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash ? window.location.hash.replace('#', '') : '/';
      setCurrentPath(path || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route resolver
  const renderView = () => {
    if (currentPath === '/' || currentPath === '') {
      return <LandingPage navigate={navigate} />;
    }
    if (currentPath === '/login' || currentPath === '/auth') {
      return <AuthPage navigate={navigate} />;
    }
    if (currentPath === '/marketplace') {
      return <MarketplacePage navigate={navigate} />;
    }
    if (currentPath.startsWith('/farmer')) {
      return <FarmerDashboard navigate={navigate} />;
    }
    if (currentPath.startsWith('/buyer')) {
      return <BuyerDashboard navigate={navigate} />;
    }
    if (currentPath.startsWith('/admin')) {
      return <AdminDashboard navigate={navigate} />;
    }

    // Default fallback
    return <LandingPage navigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-[#f1f5f2] text-[#064e3b] font-sans flex flex-col justify-between selection:bg-emerald-200 selection:text-[#064e3b] relative overflow-x-hidden">
      {/* Immersive UI Ambient Background Glows */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#10b98125] to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[-100px] w-[600px] h-[600px] bg-gradient-to-tr from-[#34d39920] to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[450px] h-[450px] bg-gradient-to-br from-emerald-200/30 to-transparent rounded-full blur-[110px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <div>
          <Navbar currentPath={currentPath} navigate={navigate} onOpenVoice={() => setVoiceOpen(true)} />
          <main className="transition-all duration-300">
            {renderView()}
          </main>
        </div>

        <Footer navigate={navigate} />
      </div>

      {/* Global AI Chatbot Widget (Only shown for Farmer, Buyer, Guest; Excluded for Admin) */}
      <AIChatbotWidget />

      {/* Global Vernacular Voice Assistant Trigger */}
      <GlobalVoiceButton onClick={() => setVoiceOpen(true)} />

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SplashScreen } from './components/SplashScreen';
import { AITutorModal } from './components/AITutorModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReadingModePage } from './pages/ReadingModePage';
import { PracticeModePage } from './pages/PracticeModePage';
import { ExamModePage } from './pages/ExamModePage';
import { AITutorPage } from './pages/AITutorPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppContent: React.FC = () => {
  const { activeTab, showSplash, setShowSplash } = useApp();

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans transition-colors selection:bg-blue-600 selection:text-white">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* PUBLIC FLOWCHART ROUTES */}
          {activeTab === 'home' && <HomePage />}
          {activeTab === 'tutorials' && <ReadingModePage />}
          {activeTab === 'about' && <AboutPage />}
          {activeTab === 'contact' && <ContactPage />}
          {activeTab === 'login' && <LoginPage />}
          {activeTab === 'register' && <RegisterPage />}

          {/* STUDENT PORTAL FLOWCHART ROUTES */}
          {activeTab === 'student-dashboard' && <DashboardPage />}
          {activeTab === 'my-courses' && <ReadingModePage />}
          {activeTab === 'past-questions' && <PracticeModePage />}
          {activeTab === 'cbt' && <ExamModePage />}
          {activeTab === 'results' && <DashboardPage />}
          {activeTab === 'progress' && <DashboardPage />}
          {activeTab === 'ai-tutor' && <AITutorPage />}

          {/* ADMIN PORTAL FLOWCHART ROUTES */}
          {activeTab === 'admin-dashboard' && <AdminDashboardPage />}
        </main>

        <Footer />
        <AITutorModal
          isOpen={activeTab === 'ai-tutor'}
          onClose={() => { /* no-op or handled inside context/navigation */ }}
          context={{}}
        />
      </div>
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

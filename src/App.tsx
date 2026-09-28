/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TravelProvider, useTravel } from './context/TravelContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';

import { HomePage } from './pages/HomePage';
import { PlanTripPage } from './pages/PlanTripPage';
import { ExplorePage } from './pages/ExplorePage';
import { StaysPage } from './pages/StaysPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { UserProfileView } from './components/profile/UserProfileView';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, notification } = useTravel();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{notification}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar />

      {/* Active Tab Router */}
      <main className="flex-1">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'plan' && <PlanTripPage />}
        {activeTab === 'explore' && <ExplorePage />}
        {activeTab === 'stays' && <StaysPage />}
        {activeTab === 'trips' && <MyTripsPage />}
        {activeTab === 'reviews' && <ReviewsPage />}
        {activeTab === 'profile' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UserProfileView />
          </div>
        )}
      </main>

      {/* Site Footer */}
      <Footer />

      {/* Global Interactive Modals */}
      <AuthModal />
      <GlobalSearchModal />

    </div>
  );
};

export default function App() {
  return (
    <TravelProvider>
      <AppContent />
    </TravelProvider>
  );
}

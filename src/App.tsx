import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { UserProvider } from './contexts/UserContext';
import { SocketProvider } from './contexts/SocketContext';
import { WebRTCProvider } from './contexts/WebRTCContext';

import { LandingPage } from './pages/LandingPage';
import { SetupPage } from './pages/SetupPage';
import { RoomsPage } from './pages/RoomsPage';
import { RoomPage } from './pages/RoomPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { CommunityGuidelinesPage } from './pages/CommunityGuidelinesPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <UserProvider>
          <SocketProvider>
            <WebRTCProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/setup" element={<SetupPage />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/room/:roomId" element={<RoomPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Routes>
            </WebRTCProvider>
          </SocketProvider>
        </UserProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;

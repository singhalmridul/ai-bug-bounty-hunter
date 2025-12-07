import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ScansPage from './pages/scans/ScansPage';
import FindingsPage from './pages/findings/FindingsPage';
import SettingsPage from './pages/settings/SettingsPage';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <AuthProvider>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />

                        {/* Protected Dashboard Routes */}
                        <Route path="/" element={<DashboardLayout />}>
                            <Route path="dashboard" element={<DashboardPage />} />
                            <Route path="scans" element={<ScansPage />} />
                            <Route path="findings" element={<FindingsPage />} />
                            <Route path="settings" element={<SettingsPage />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default AppRouter;

import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import AuthPage from './components/pages/AuthPage';
import Layout from './components/Layout';
import DashboardPage from './components/pages/DashboardPage';
import HistoryPage from './components/pages/HistoryPage';
import ReportsPage from './components/pages/ReportsPage';
import TestsPage from './components/pages/TestsPage';
import DailyQuotePage from './components/pages/DailyQuotePage';
import TipsPage from './components/pages/TipsPage';
import ProfilePage from './components/pages/ProfilePage';
import { Brain } from './components/Icons';


const LoadingScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Brain className="h-16 w-16 text-primary animate-pulse" />
        <p className="mt-4 text-lg text-muted-foreground">Carregando Mente Viva...</p>
    </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { session, loading } = useData();
    let location = useLocation();

    if (loading) {
        return <LoadingScreen />;
    }

    if (!session) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
};

const AppRoutes: React.FC = () => {
    const { session, loading } = useData();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Routes>
            <Route path="/auth" element={session ? <Navigate to="/dashboard" /> : <AuthPage />} />
            
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="tests" element={<TestsPage />} />
                <Route path="daily-quote" element={<DailyQuotePage />} />
                <Route path="tips" element={<TipsPage />} />
                <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to={session ? "/dashboard" : "/auth"} />} />
        </Routes>
    );
};


function App() {
    return (
        <DataProvider>
            <HashRouter>
                <div className="min-h-screen bg-background text-foreground">
                    <AppRoutes />
                    {/* Placeholder for toast notifications */}
                    <div id="sonner-toaster" className="fixed bottom-4 right-4 z-[100] flex flex-col-reverse"></div>
                </div>
            </HashRouter>
        </DataProvider>
    );
}

export const toast = {
  success: (message: string) => {
    const toaster = document.getElementById('sonner-toaster');
    if (!toaster) return;
    const toastElement = document.createElement('div');
    toastElement.className = 'mt-2 animate-fade-in-up rounded-lg border bg-green-500 text-white p-4 shadow-lg';
    toastElement.textContent = message;
    toaster.appendChild(toastElement);
    setTimeout(() => {
      toastElement.remove();
    }, 3000);
  },
  error: (message: string) => {
    const toaster = document.getElementById('sonner-toaster');
    if (!toaster) return;
    const toastElement = document.createElement('div');
    toastElement.className = 'mt-2 animate-fade-in-up rounded-lg border bg-red-500 text-white p-4 shadow-lg';
    toastElement.textContent = message;
    toaster.appendChild(toastElement);
    setTimeout(() => {
      toastElement.remove();
    }, 3000);
  }
};


export default App;

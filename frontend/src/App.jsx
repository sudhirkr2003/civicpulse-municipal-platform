import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import DepartmentDashboard from './components/DepartmentDashboard';
import FieldExecutionPortal from './components/FieldExecutionPortal';
import CitizenDashboard from './components/CitizenDashboard';
import CitizenDocketTracker from './components/CitizenDocketTracker';
import CitizenReceipts from './components/CitizenReceipts';
import ServicesModule from './components/ServicesModule';
import GrievancesModule from './components/GrievancesModule';
import RevenueModule from './components/RevenueModule';
import BudgetModule from './components/BudgetModule';
import DepartmentScorecardModule from './components/DepartmentScorecardModule';
import CitizensModule from './components/CitizensModule';
import PermitsModule from './components/PermitsModule';
import ReportsModule from './components/ReportsModule';

const DashboardLayout = () => {
  const { toastMessage } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    return localStorage.getItem('civicpulse_sidebar_collapsed') === 'true';
  });

  const handleToggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('civicpulse_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div>
      <Header 
        mobileSidebarOpen={mobileSidebarOpen} 
        onToggleSidebar={() => setMobileSidebarOpen(prev => !prev)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <div className="app-layout">
        <Sidebar 
          mobileOpen={mobileSidebarOpen} 
          onClose={() => setMobileSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
        <main className={`main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Outlet />
        </main>
      </div>

      {toastMessage && (
        <div className="toast">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<ExecutiveDashboard />} />
              <Route path="/dept-dashboard" element={<DepartmentDashboard />} />
              <Route path="/field-tasks" element={<FieldExecutionPortal />} />
              
              <Route path="/citizen-portal" element={<CitizenDashboard />} />
              <Route path="/citizen-tracking" element={<CitizenDocketTracker />} />
              <Route path="/citizen-receipts" element={<CitizenReceipts />} />

              <Route path="/services" element={<ServicesModule />} />
              <Route path="/grievances" element={<GrievancesModule />} />
              <Route path="/revenue" element={<RevenueModule />} />
              <Route path="/budget" element={<BudgetModule />} />
              <Route path="/departments" element={<DepartmentScorecardModule />} />
              <Route path="/citizens" element={<CitizensModule />} />
              <Route path="/permits" element={<PermitsModule />} />
              <Route path="/reports" element={<ReportsModule />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

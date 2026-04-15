import { Icon } from '@iconify/react';
import nailPolish from '@iconify-icons/emojione-monotone/nail-polish';
import bustsInSilhouette from '@iconify-icons/emojione-monotone/busts-in-silhouette';
import calendar from '@iconify-icons/emojione-monotone/calendar';
import moneyBag from '@iconify-icons/emojione-monotone/money-bag';
import wavingHand from '@iconify-icons/emojione-monotone/waving-hand';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import ServicesPage from './pages/ServicesPage';
import CustomersPage from './pages/CustomersPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PromotionsPage from './pages/PromotionsPage';
import PaymentsPage from './pages/PaymentsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import ManicuristaDashboard from './pages/ManicuristaDashboard';
import ClienteDashboard from './pages/ClienteDashboard';
import ProfilePage from './pages/ProfilePage';
import RolesPage from './pages/RolesPage';
import { serviceApi, customerApi, appointmentApi, paymentApi, userApi } from './api/api';

const RoleBasedDashboard = () => {
  const { user } = useAuth();
  
  // Redirect based on user role
  if (!user) return <Navigate to="/login" replace />;
  
  const roles = user.roles || [];
  const roleNames = roles.map(role => role.rolName);
  
  // Admin has priority, then manicurista, then cliente
  if (roleNames.includes('Administrador')) {
    return <AdminDashboard />;
  } else if (roleNames.includes('Manicurista')) {
    return <ManicuristaDashboard />;
  } else {
    // Default to cliente dashboard for all others
    return <ClienteDashboard />;
  }
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<RoleBasedDashboard />} />
              <Route path="servicios" element={<ServicesPage />} />
              <Route path="clientes" element={<CustomersPage />} />
              <Route path="citas" element={<AppointmentsPage />} />
              <Route path="promociones" element={<PromotionsPage />} />
              <Route path="pagos" element={<PaymentsPage />} />
              <Route path="perfil" element={<ProfilePage />} />
              <Route path="roles" element={<RolesPage />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

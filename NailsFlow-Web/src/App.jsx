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
import { serviceApi, customerApi, appointmentApi, paymentApi } from './api/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ services: 0, customers: 0, appointments: 0, payments: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [servicesRes, customersRes, appointmentsRes, paymentsRes] = await Promise.all([
          serviceApi.getAll(),
          customerApi.getAll(),
          appointmentApi.getAll(),
          paymentApi.getAll()
        ]);
        
        const payments = paymentsRes.data;
        const revenue = payments.reduce((sum, p) => sum + (p.payAmount || 0), 0);
        
        setStats({
          services: servicesRes.data.length,
          customers: customersRes.data.length,
          appointments: appointmentsRes.data.length,
          payments: payments.length,
          revenue
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Servicios', value: stats.services, icon: nailPolish, color: 'from-pink-400 to-pink-500', bg: 'bg-pink-50' },
    { label: 'Clientes', value: stats.customers, icon: bustsInSilhouette, color: 'from-purple-400 to-purple-500', bg: 'bg-purple-50' },
    { label: 'Citas', value: stats.appointments, icon: calendar, color: 'from-blue-400 to-blue-500', bg: 'bg-blue-50' },
    { label: 'Ingresos', value: `$${stats.revenue.toLocaleString('es-CO')}`, icon: moneyBag, color: 'from-green-400 to-green-500', bg: 'bg-green-50' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Bienvenido{user ? `, ${user.username}` : ''} <Icon icon={wavingHand} className="inline w-8 h-8" /></h2>
        <p className="text-gray-500 mt-1">Aquí está el resumen de tu salón hoy.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <Icon icon={stat.icon} className="w-6 h-6 text-gray-600" />
              </div>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} opacity-10`}></div>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Próximas Citas</h3>
          <div className="text-center py-8 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Ver todas las citas en el módulo de Citas</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl p-6 shadow-lg text-white">
          <h3 className="text-lg font-bold mb-4">¡Bienvenida!</h3>
          <p className="mb-4 opacity-90">Gestiona tu salón de manicura de manera fácil y elegante.</p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-1"><Icon icon={nailPolish} className="w-4 h-4" /> Servicios</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-1"><Icon icon={calendar} className="w-4 h-4" /> Citas</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-1"><Icon icon={bustsInSilhouette} className="w-4 h-4" /> Clientes</span>
          </div>
        </div>
      </div>
    </div>
  );
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
              <Route index element={<Dashboard />} />
              <Route path="servicios" element={<ServicesPage />} />
              <Route path="clientes" element={<CustomersPage />} />
              <Route path="citas" element={<AppointmentsPage />} />
              <Route path="promociones" element={<PromotionsPage />} />
              <Route path="pagos" element={<PaymentsPage />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

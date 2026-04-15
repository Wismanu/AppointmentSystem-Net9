import { useEffect, useState } from 'react';
import { IconPeople, IconCalendar, IconNailPolish, IconGift, IconCreditCard, IconMoneyBag, IconWavingHand } from '../components/Icons';
import { userApi, appointmentApi, paymentApi, promotionApi, serviceApi } from '../api/api';
import AppointmentStatus from '../models/AppointmentStatus';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    appointments: 0,
    services: 0,
    promotions: 0,
    payments: 0,
    revenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStatusLabel = (statusValue) => {
    const statusLabels = {
      1: 'Solicitado',
      2: 'Pago Pendiente',
      3: 'Pago Confirmado',
      4: 'Asignado',
      5: 'Reprogramado',
      6: 'En Proceso',
      7: 'Completado - Pago Pendiente',
      8: 'Completado y Confirmado',
      9: 'Cancelado'
    };
    return statusLabels[statusValue] || `Estado ${statusValue}`;
  };

  const getStatusColors = (statusValue) => {
    if (statusValue === 8) return { bg: 'bg-green-100', text: 'text-green-700' };
    if (statusValue === 7) return { bg: 'bg-teal-100', text: 'text-teal-700' };
    if (statusValue === 6) return { bg: 'bg-purple-100', text: 'text-purple-700' };
    if (statusValue === 4) return { bg: 'bg-blue-100', text: 'text-blue-700' };
    if (statusValue === 3) return { bg: 'bg-amber-100', text: 'text-amber-700' };
    if (statusValue === 2) return { bg: 'bg-orange-100', text: 'text-orange-700' };
    if (statusValue === 1) return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
    return { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [usersRes, appointmentsRes, servicesRes, promotionsRes, paymentsRes] = await Promise.all([
          userApi.getAll(),
          appointmentApi.getAll(),
          serviceApi.getAll(),
          promotionApi.getAll(),
          paymentApi.getAll()
        ]);
        
        const users = usersRes.data;
        const appointments = appointmentsRes.data;
        const services = servicesRes.data;
        const promotions = promotionsRes.data;
        const payments = paymentsRes.data;
        
        const revenue = payments.reduce((total, payment) => total + (payment.payAmount || 0), 0);
        
        setStats({
          users: users.length,
          appointments: appointments.length,
          services: services.length,
          promotions: promotions.length,
          payments: payments.length,
          revenue: revenue
        });
        
        // Prepare recent activity (last 5 appointments)
        const recentAppointments = [...appointments]
          .sort((a, b) => new Date(b.appointDateTime) - new Date(a.appointDateTime))
          .slice(0, 5);
        
        setRecentActivity(
          recentAppointments.map(appt => ({
            id: appt.appointId,
            type: 'appointment',
            description: `Nueva cita para ${appt.person?.perFirstName} ${appt.person?.perLastName || ''} - ${appt.service?.serName || ''}`,
            time: new Date(appt.appointDateTime),
            status: appt.status,
            createdBy: appt.user?.name || appt.user?.usrName || `Usuario #${appt.usrId}`
          }))
        );
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6">
        {[1, 2, 3, 4].map(() => (
          <div key={Math.random()} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                <IconWavingHand />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Cargando...</h3>
            </div>
            <p className="text-gray-500 text-2xl font-bold">0</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Panel de Administrador</h2>
          <p className="text-gray-500 mt-1">Resumen general del salón</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <p className="font-semibold text-gray-800">Administrador</p>
            <p className="text-sm text-gray-400">Control Total</p>
          </div>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
              <IconPeople />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Usuarios Registrados</h3>
          </div>
          <p className="text-gray-500 text-2xl font-bold">{stats.users}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <IconCalendar />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Citas Programadas</h3>
          </div>
          <p className="text-gray-500 text-2xl font-bold">{stats.appointments}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center">
              <IconNailPolish />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Servicios Ofrecidos</h3>
          </div>
          <p className="text-gray-500 text-2xl font-bold">{stats.services}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <IconMoneyBag />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Ingresos Totales</h3>
          </div>
          <p className="text-gray-500 text-2xl font-bold">${stats.revenue.toLocaleString('es-CO')}</p>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Actividad Reciente</h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay actividad reciente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 bg-gray-50 rounded-xl border-l-4 border-pink-400">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{activity.description}</p>
                      <p className="text-sm text-gray-500">
                        Creado por: {activity.createdBy} • {new Date(activity.time).toLocaleString('es-CO', {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColors(activity.status).bg} ${getStatusColors(activity.status).text}`}>
                      {getStatusLabel(activity.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
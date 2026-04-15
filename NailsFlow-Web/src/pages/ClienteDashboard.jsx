import { useEffect, useState } from 'react';
import { IconPeople, IconCalendar, IconNailPolish, IconWavingHand } from '../components/Icons';
import { appointmentApi, promotionApi, userApi } from '../api/api';

const ClienteDashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    favoriteService: 'N/A'
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [activePromotions, setActivePromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [appointmentsRes, promotionsRes, userRes] = await Promise.all([
          appointmentApi.getAll(),
          promotionApi.getAll(),
          userApi.getCurrentUser()
        ]);
        
        const appointments = appointmentsRes.data;
        const promotions = promotionsRes.data;
        const user = userRes.data;
        
        // Filter appointments for this user
        const userAppointments = appointments.filter(apt => apt.usrId === user.usrId);
        
        // Count total appointments
        const totalAppointments = userAppointments.length;
        
        // Count upcoming appointments (future date and not cancelled)
        const now = new Date();
        const upcoming = userAppointments.filter(apt => {
          const aptDate = new Date(apt.appointDateTime);
          return aptDate > now && 
                 apt.status !== 'Cancelled' && 
                 apt.status !== 'CompletedAndConfirmed' && 
                 apt.status !== 'CompletedPendingPayment';
        });
        const upcomingAppointmentsCount = upcoming.length;
        
        // Count completed appointments
        const completedAppointments = userAppointments.filter(apt => 
          apt.status === 'CompletedAndConfirmed' || 
          apt.status === 'CompletedPendingPayment'
        ).length;
        
        // Find favorite service (most used)
        const serviceCounts = {};
        userAppointments.forEach(apt => {
          const serviceName = apt.service?.serName || 'Servicio desconocido';
          serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
        });
        
        let favoriteService = 'N/A';
        let maxCount = 0;
        for (const [service, count] of Object.entries(serviceCounts)) {
          if (count > maxCount) {
            maxCount = count;
            favoriteService = service;
          }
        }
        
        setStats({
          totalAppointments: totalAppointments,
          upcomingAppointments: upcomingAppointmentsCount,
          completedAppointments: completedAppointments,
          favoriteService: favoriteService
        });
        
        // Prepare upcoming appointments for display (next 5)
        const upcomingFormatted = upcoming
          .sort((a, b) => new Date(a.appointDateTime) - new Date(b.appointDateTime))
          .slice(0, 5)
          .map(apt => ({
            id: apt.appointId,
            date: new Date(apt.appointDateTime),
            service: apt.service?.serName || 'Servicio desconocido',
            status: apt.status
          }));
        
        setUpcomingAppointments(upcomingFormatted);
        
        // Filter active promotions
        const activePromos = promotions.filter(promo => 
          promo.status === true // Assuming status boolean indicates active
        );
        setActivePromotions(activePromos);
      } catch (error) {
        console.error('Error loading cliente dashboard:', error);
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
          <h2 className="text-3xl font-bold text-gray-800">Mi Panel Personal</h2>
          <p className="text-gray-500 mt-1">Tu espacio en NailsFlow</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold">
            C
          </div>
          <div>
            <p className="font-semibold text-gray-800">Cliente</p>
            <p className="text-sm text-gray-400">Autogestión</p>
          </div>
        </div>
      </div>

      {/* Estadísticas personales */}
      <div className="grid gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
              <IconCalendar />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Total de Citas</h3>
          </div>
          <p className="text-gray-500 text-2xl font-bold">{stats.totalAppointments}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <IconPeople />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Citas Próximas</h3>
          </div>
          <p className="text-gray-500 text-2xl font-bold">{stats.upcomingAppointments}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <IconWavingHand />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Citas Completadas</h3>
          </div>
          <p className="text-gray-500 text-2xl font-bold">{stats.completedAppointments}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <IconNailPolish />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Servicio Favorito</h3>
          </div>
          <p className="text-gray-500 text-2xl font-bold">{stats.favoriteService}</p>
        </div>
      </div>

      {/* Próximas citas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Próximas Citas</h3>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tienes citas próximas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-gray-50 rounded-xl border-l-4 border-pink-400">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{appointment.service}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleDateString('es-CO', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        appointment.status === 'CompletedAndConfirmed' 
                          ? 'bg-green-100 text-green-700'
                          : appointment.status === 'CompletedPendingPayment'
                          ? 'bg-teal-100 text-teal-700'
                          : appointment.status === 'InProgress'
                          ? 'bg-purple-100 text-purple-700'
                          : appointment.status === 'Assigned'
                          ? 'bg-blue-100 text-blue-700'
                          : appointment.status === 'AdvancePaymentConfirmed'
                          ? 'bg-amber-100 text-amber-700'
                          : appointment.status === 'PendingAdvancePayment'
                          ? 'bg-orange-100 text-orange-700'
                          : appointment.status === 'Requested'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {appointment.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(appointment.date).toLocaleTimeString('es-CO', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Promociones activas (carrusel simple) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Promociones Activas</h3>
          {activePromotions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay promociones activas actualmente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activePromotions.map((promo) => (
                <div key={promo.promoId} className="p-4 bg-gray-50 rounded-xl border-l-4 border-pink-400">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{promo.promoName}</p>
                      <p className="text-sm text-gray-500">{promo.promoDescription}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      <IconGift />
                    </div>
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

export default ClienteDashboard;
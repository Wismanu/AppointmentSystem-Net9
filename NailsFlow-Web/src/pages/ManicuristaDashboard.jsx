import { useEffect, useState } from 'react';
import { IconPeople, IconCalendar, IconNailPolish, IconWavingHand } from '../components/Icons';
import { appointmentApi, customerApi, userApi } from '../api/api';

const ManicuristaDashboard = () => {
  const [stats, setStats] = useState({
    appointmentsToday: 0,
    appointmentsMonth: 0,
    completedToday: 0,
    pending: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const [appointmentsRes, customersRes] = await Promise.all([
          appointmentApi.getAll(),
          customerApi.getAll()
        ]);
        
        const appointments = appointmentsRes.data;
        const customers = customersRes.data;
        
        // Filter appointments for today
        const todayAppointments = appointments.filter(appt => {
          const apptDate = new Date(appt.appointDateTime);
          apptDate.setHours(0, 0, 0, 0);
          return apptDate.getTime() === today.getTime();
        });
        
        // Filter appointments for current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const appointmentsMonth = appointments.filter(appt => {
          const apptDate = new Date(appt.appointDateTime);
          return apptDate >= startOfMonth;
        });
        
        // Count completed today
        const completedToday = todayAppointments.filter(appt => 
          appt.status === 'CompletedAndConfirmed' || 
          appt.status === 'CompletedPendingPayment'
        ).length;
        
        // Count pending appointments (requested, pending advance payment, advance payment confirmed)
        const pending = appointments.filter(appt => 
          appt.status === 'Requested' || 
          appt.status === 'PendingAdvancePayment' || 
          appt.status === 'AdvancePaymentConfirmed'
        ).length;
        
        setStats({
          appointmentsToday: todayAppointments.length,
          appointmentsMonth: appointmentsMonth.length,
          completedToday: completedToday,
          pending: pending
        });
        
        // Prepare today's appointments for display
        const formattedAppointments = todayAppointments
          .sort((a, b) => new Date(a.appointDateTime) - new Date(b.appointDateTime))
          .map(appt => ({
            id: appt.appointId,
            time: new Date(appt.appointDateTime),
            customer: `${appt.person?.perFirstName} ${appt.person?.perLastName || ''}`,
            service: appt.service?.serName || '',
            status: appt.status,
            duration: appt.service?.serDuration || 0
          }));
        
        setTodayAppointments(formattedAppointments);
      } catch (error) {
        console.error('Error loading manicurista dashboard:', error);
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
          <h2 className="text-3xl font-bold text-gray-800">Panel de Manicurista</h2>
          <p className="text-gray-500 mt-1">Tu vista operativa del día</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold">
            M
          </div>
          <div>
            <p className="font-semibold text-gray-800">Manicurista</p>
            <p className="text-sm text-gray-400">Operación</p>
          </div>
        </div>
      </div>

      {/* Estadísticas del día */}
      <div className="grid gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
              <IconCalendar />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Citas Hoy</h3>
          </div>
          <p className="text-gray-500 text-2xl font-bold">{stats.appointmentsToday}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <IconPeople />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Citas Mensuales</h3>
          </div>
          <p className="text-gray-500 text-2xl font-bold">{stats.appointmentsMonth}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <IconWavingHand />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Completadas Hoy</h3>
          </div>
          <p className="text-gray-500 text-2xl font-bold">{stats.completedToday}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <IconPeople />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Pendientes</h3>
          </div>
          <p className="text-gray-500 text-2xl font-bold">{stats.pending}</p>
        </div>
      </div>

      {/* Citas de hoy */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Citas de Hoy</h3>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tienes citas programadas para hoy</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-gray-50 rounded-xl border-l-4 border-pink-400">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{appointment.customer}</p>
                      <p className="text-sm text-gray-500">
                        {appointment.service} ({appointment.duration} min)
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
                        {new Date(appointment.time).toLocaleTimeString('es-CO', {
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
    </div>
  );
};

export default ManicuristaDashboard;
import { Icon } from '@iconify/react';
import calendar from '@iconify-icons/emojione-monotone/calendar';
import { useEffect, useState, useRef } from 'react';
import { appointmentApi, serviceApi, customerApi, statusApi } from '../api/api';

const statusColors = {
  Requested: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  PendingAdvancePayment: { bg: 'bg-orange-100', text: 'text-orange-700' },
  AdvancePaymentConfirmed: { bg: 'bg-amber-100', text: 'text-amber-700' },
  Assigned: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Rescheduled: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  InProgress: { bg: 'bg-purple-100', text: 'text-purple-700' },
  CompletedPendingPayment: { bg: 'bg-teal-100', text: 'text-teal-700' },
  CompletedAndConfirmed: { bg: 'bg-green-100', text: 'text-green-700' },
  Cancelled: { bg: 'bg-red-100', text: 'text-red-700' }
};

const AppointmentsPage = () => {
  const timeInputRef = useRef(null); // Aquí declaramos la referencia
  
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    appointDate: '',
    appointTime: '',
    perId: '',
    serId: '',
    usrId: 1,
    status: 'Requested'
  });

  const fetchData = async () => {
    try {
      const [appointmentsRes, servicesRes, customersRes, statusesRes] = await Promise.all([
        appointmentApi.getAll(),
        serviceApi.getAll(),
        customerApi.getAll(),
        statusApi.getAll()
      ]);
      setAppointments(appointmentsRes.data);
      setServices(servicesRes.data);
      setCustomers(customersRes.data);
      setStatuses(statusesRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointDateTime = `${formData.appointDate}T${formData.appointTime}:00`;
      const data = {
        appointDateTime,
        perId: parseInt(formData.perId),
        serId: parseInt(formData.serId),
        usrId: parseInt(formData.usrId),
        status: formData.status
      };
      
      if (editingAppointment) {
        await appointmentApi.update(editingAppointment.appointId, data);
      } else {
        await appointmentApi.create(data);
      }

      setShowModal(false);
      setEditingAppointment(null);
      setFormData({ appointDate: '', appointTime: '', perId: '', serId: '', usrId: 1, status: 'Requested' });
      fetchData();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    const dateTime = appointment.appointDateTime ? new Date(appointment.appointDateTime) : null;
    setFormData({
      appointDate: dateTime ? dateTime.toISOString().split('T')[0] : '',
      appointTime: dateTime ? dateTime.toTimeString().slice(0, 5) : '',
      perId: appointment.perId?.toString() || '',
      serId: appointment.serId?.toString() || '',
      usrId: appointment.usrId?.toString() || '1',
      status: appointment.status || 'Requested'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás segura de eliminar esta cita?')) {
      try {
        await appointmentApi.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = statusColors[status] || statusColors.Requested;
    const statusInfo = statuses.find(s => s.name === status);
    const label = statusInfo?.label || status;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
        {label}
      </span>
    );
  };

  const getCustomerName = (perId) => {
    const customer = customers.find(c => c.perId === perId);
    return customer ? `${customer.perFirstName} ${customer.perLastName}` : 'Cliente no encontrado';
  };

  const getServiceName = (serId) => {
    const service = services.find(s => s.serId === serId);
    return service ? service.serName : 'Servicio no encontrado';
  };

  const getServicePrice = (serId) => {
    const service = services.find(s => s.serId === serId);
    return service ? service.serPrice : 0;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Citas</h2>
          <p className="text-gray-500 mt-1">Gestiona las citas del salón.</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setEditingAppointment(null); setFormData({ appointDate: '', appointTime: '', perId: '', serId: '', usrId: 1, status: 'Requested' }); }}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-pink/20 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Cita
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-pink-100">
          <Icon icon={calendar} className="w-16 h-16 mx-auto mb-4 text-pink-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay citas todavía</h3>
          <p className="text-gray-500 mb-6">Programa tu primera cita</p>
          <button onClick={() => setShowModal(true)} className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors">
            Agendar Cita
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {appointments.map((appointment) => (
            <div key={appointment.appointId} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-pink-200 transition-all p-5">
              <div className="flex justify-between items-start mb-4">
                {getStatusBadge(appointment.status)}
                <span className="text-xs text-gray-400">
                  #{appointment.appointId}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-pink-50 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Fecha y Hora</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(appointment.appointDateTime).toLocaleString('es-CO', { 
                        dateStyle: 'medium', 
                        timeStyle: 'short' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Cliente</p>
                    <p className="font-semibold text-gray-800">{getCustomerName(appointment.perId)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Servicio</p>
                    <p className="font-semibold text-gray-800">{getServiceName(appointment.serId)}</p>
                    <p className="text-sm text-pink-600 font-bold">${getServicePrice(appointment.serId).toLocaleString('es-CO')}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleEdit(appointment)}
                  className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(appointment.appointId)}
                  className="px-3 py-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingAppointment ? 'Editar Cita' : 'Nueva Cita'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="appointDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    id="appointDate"
                    name="appointDate"
                    value={formData.appointDate}
                    onChange={(e) => setFormData({...formData, appointDate: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    required
                  />
                </div>
                
                {/* AQUI ESTA LA MAGIA DEL RELOJ CON SU REFERENCIA */}
                <div>
                  <label htmlFor="appointTime" className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <div className="relative">
                    <input
                      type="time"
                      id="appointTime"
                      name="appointTime"
                      ref={timeInputRef} /* AQUI USAMOS EL REF */
                      value={formData.appointTime}
                      onChange={(e) => setFormData({...formData, appointTime: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all [&::-webkit-calendar-picker-indicator]:hidden"
                      required
                    />
                    
                    <div 
                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-pink-500 transition-colors"
                      onClick={() => {
                        if (timeInputRef.current?.showPicker) {
                          timeInputRef.current.showPicker();
                        } else {
                          timeInputRef.current?.focus(); 
                        }
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="perId" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select
                  id="perId"
                  name="perId"
                  value={formData.perId}
                  onChange={(e) => setFormData({...formData, perId: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  {customers.map(customer => (
                    <option key={customer.perId} value={customer.perId}>
                      {customer.perFirstName} {customer.perLastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="serId" className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
                <select
                  id="serId"
                  name="serId"
                  value={formData.serId}
                  onChange={(e) => setFormData({...formData, serId: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                  required
                >
                  <option value="">Seleccionar servicio</option>
                  {services.map(service => (
                    <option key={service.serId} value={service.serId}>
                      {service.serName} - ${service.serPrice.toLocaleString('es-CO')} ({service.serDuration} min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                >
                  {statuses.map(status => (
                    <option key={status.name} value={status.name}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg shadow-pink/20"
                >
                  {editingAppointment ? 'Guardar Cambios' : 'Crear Cita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
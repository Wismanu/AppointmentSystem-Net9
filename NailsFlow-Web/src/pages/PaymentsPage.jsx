import { Icon } from '@iconify/react';
import creditCard from '@iconify-icons/emojione-monotone/credit-card';
import { useEffect, useState } from 'react';
import { paymentApi, appointmentApi } from '../api/api';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    payAmount: '',
    payDate: new Date().toISOString().slice(0, 16),
    appointId: ''
  });

  const fetchData = async () => {
    try {
      const [paymentsRes, appointmentsRes] = await Promise.all([
        paymentApi.getAll(),
        appointmentApi.getAll()
      ]);
      setPayments(paymentsRes.data);
      setAppointments(appointmentsRes.data);
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
      const data = {
        payAmount: parseFloat(formData.payAmount),
        payDate: formData.payDate,
        appointId: parseInt(formData.appointId)
      };
      
      if (editingPayment) {
        await paymentApi.update(editingPayment.payId, data);
      } else {
        await paymentApi.create(data);
      }
      
      setShowModal(false);
      setEditingPayment(null);
      setFormData({ payAmount: '', payDate: new Date().toISOString().slice(0, 16), appointId: '' });
      fetchData();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      payAmount: payment.payAmount?.toString() || '',
      payDate: payment.payDate ? payment.payDate.slice(0, 16) : new Date().toISOString().slice(0, 16),
      appointId: payment.appointId?.toString() || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás segura de eliminar este pago?')) {
      try {
        await paymentApi.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const getAppointmentInfo = (appointId) => {
    const appointment = appointments.find(a => a.appointId === appointId);
    if (!appointment) return { customer: 'No encontrado', service: 'No encontrado' };

    const customer = appointment.person ?
      `${appointment.person.perFirstName} ${appointment.person.perLastName}` :
      'Cliente no disponible';
    const service = appointment.service?.serName || 'Servicio no disponible';

    return { customer, service };
  };

  const totalPayments = payments.reduce((sum, p) => sum + (p.payAmount || 0), 0);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Pagos</h2>
          <p className="text-gray-500 mt-1">Controla los pagos del salón.</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setEditingPayment(null); setFormData({ payAmount: '', payDate: new Date().toISOString().slice(0, 16), appointId: '' }); }}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-pink/20 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Registrar Pago
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-xl">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Ingresos</p>
              <p className="text-2xl font-bold text-gray-800">${totalPayments.toLocaleString('es-CO')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-pink-50 p-3 rounded-xl">
              <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pagos</p>
              <p className="text-2xl font-bold text-gray-800">{payments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-purple-50 p-3 rounded-xl">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Promedio</p>
              <p className="text-2xl font-bold text-gray-800">
                ${payments.length > 0 ? Math.round(totalPayments / payments.length).toLocaleString('es-CO') : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-pink-100">
          <Icon icon={creditCard} className="w-16 h-16 mx-auto mb-4 text-pink-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay pagos registrados</h3>
          <p className="text-gray-500 mb-6">Comienza a registrar los pagos</p>
          <button onClick={() => setShowModal(true)} className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors">
            Registrar Pago
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden md:table-cell">Servicio</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Fecha</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((payment) => {
                  const info = getAppointmentInfo(payment.appointId);
                  return (
                    <tr key={payment.payId} className="hover:bg-pink-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">#{payment.payId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-800">{info.customer}</span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-gray-600">
                        {info.service}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-600 text-lg">
                          ${payment.payAmount?.toLocaleString('es-CO') || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell text-gray-500 text-sm">
                        {payment.payDate ? new Date(payment.payDate).toLocaleDateString('es-CO', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Sin fecha'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(payment)}
                            className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(payment.payId)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingPayment ? 'Editar Pago' : 'Registrar Pago'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cita</label>
                <select
                  value={formData.appointId}
                  onChange={(e) => setFormData({...formData, appointId: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                  required
                >
                  <option value="">Seleccionar cita</option>
                  {appointments.map(apt => (
                    <option key={apt.appointId} value={apt.appointId}>
                      #{apt.appointId} - {apt.person?.perFirstName} {apt.person?.perLastName} - {apt.service?.serName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.payAmount}
                  onChange={(e) => setFormData({...formData, payAmount: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                  placeholder="25000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Pago</label>
                <input
                  type="datetime-local"
                  value={formData.payDate}
                  onChange={(e) => setFormData({...formData, payDate: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                  required
                />
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
                  {editingPayment ? 'Guardar Cambios' : 'Registrar Pago'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;

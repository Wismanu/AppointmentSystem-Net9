import { Icon } from '@iconify/react';
import bustsInSilhouette from '@iconify-icons/emojione-monotone/busts-in-silhouette';
import telephone from '@iconify-icons/emojione-monotone/telephone';
import email from '@iconify-icons/emojione-monotone/e-mail';
import { useEffect, useState } from 'react';
import { customerApi } from '../api/api';

const roleColors = {
  'Administrador': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'Manicurista': { bg: 'bg-pink-100', text: 'text-pink-700' },
  'Cliente': { bg: 'bg-blue-100', text: 'text-blue-700' }
};

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ 
    perFirstName: '', 
    perLastName: '', 
    perPhone: '',
    perEmail: ''
  });

  const fetchCustomers = async () => {
    try {
      const response = await customerApi.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (editingCustomer) {
          await customerApi.update(editingCustomer.perId, {
            perId: editingCustomer.perId, // ¡ESTA ES LA LÍNEA MÁGICA QUE FALTABA!
            perFirstName: formData.perFirstName,
            perLastName: formData.perLastName,
            perPhone: formData.perPhone || null,
            perEmail: formData.perEmail || null
          });
        } else {
          await customerApi.create({
            perFirstName: formData.perFirstName,
            perLastName: formData.perLastName,
            perPhone: formData.perPhone || null,
            perEmail: formData.perEmail || null
          });
        }
        setShowModal(false);
        setEditingCustomer(null);
        setFormData({ perFirstName: '', perLastName: '', perPhone: '', perEmail: '' });
        fetchCustomers();
      } catch (error) {
        console.error('Error al guardar:', error);
      }
    };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      perFirstName: customer.perFirstName,
      perLastName: customer.perLastName,
      perPhone: customer.perPhone || '',
      perEmail: customer.perEmail || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás segura de eliminar esta persona?')) {
      try {
        await customerApi.delete(id);
        fetchCustomers();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const getRoleBadge = (role) => {
    const colors = roleColors[role] || roleColors['Cliente'];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Personas</h2>
          <p className="text-gray-500 mt-1">Gestiona los clientes y usuarios del sistema.</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setEditingCustomer(null); setFormData({ perFirstName: '', perLastName: '', perPhone: '', perEmail: '' }); }}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-pink/20 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Persona
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Personas</p>
              <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-purple-50 p-3 rounded-xl">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Con Usuario</p>
              <p className="text-2xl font-bold text-gray-800">{customers.filter(c => c.hasUserAccount).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-pink-50 p-3 rounded-xl">
              <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Solo Clientes</p>
              <p className="text-2xl font-bold text-gray-800">{customers.filter(c => c.role === 'Cliente').length}</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-pink-100">
          <Icon icon={bustsInSilhouette} className="w-16 h-16 mx-auto mb-4 text-pink-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay personas registradas</h3>
          <p className="text-gray-500 mb-6">Comienza agregando tu primera persona</p>
          <button onClick={() => setShowModal(true)} className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors">
            Agregar Persona
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-pink-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Persona</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden md:table-cell">Contacto</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((customer) => (
                  <tr key={customer.perId} className="hover:bg-pink-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold">
                          {customer.perFirstName?.charAt(0)}{customer.perLastName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{customer.perFirstName} {customer.perLastName}</p>
                          <p className="text-sm text-gray-400 md:hidden">{customer.perPhone || customer.perEmail}</p>
                          {customer.userName && (
                            <p className="text-xs text-purple-500">@{customer.userName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        {customer.perPhone && (
                          <p className="text-gray-600 text-sm flex items-center gap-1"><Icon icon={telephone} className="w-4 h-4" /> {customer.perPhone}</p>
                        )}
                        {customer.perEmail && (
                          <p className="text-gray-600 text-sm flex items-center gap-1"><Icon icon={email} className="w-4 h-4" /> {customer.perEmail}</p>
                        )}
                        {!customer.perPhone && !customer.perEmail && (
                          <span className="text-gray-400 text-sm">Sin contacto</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(customer.role)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {!customer.hasUserAccount && (
                          <button
                            onClick={() => handleDelete(customer.perId)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
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
                {editingCustomer ? 'Editar Persona' : 'Nueva Persona'}
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
                  <label htmlFor="perFirstName" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    id="perFirstName"
                    name="perFirstName"
                    value={formData.perFirstName}
                    onChange={(e) => setFormData({...formData, perFirstName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="perLastName" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    id="perLastName"
                    name="perLastName"
                    value={formData.perLastName}
                    onChange={(e) => setFormData({...formData, perLastName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="perPhone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  id="perPhone"
                  name="perPhone"
                  value={formData.perPhone}
                  onChange={(e) => setFormData({...formData, perPhone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                  placeholder="300 123 4567"
                />
              </div>

              <div>
                <label htmlFor="perEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="perEmail"
                  name="perEmail"
                  value={formData.perEmail}
                  onChange={(e) => setFormData({...formData, perEmail: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                  placeholder="correo@ejemplo.com"
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
                  {editingCustomer ? 'Guardar Cambios' : 'Crear Persona'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;

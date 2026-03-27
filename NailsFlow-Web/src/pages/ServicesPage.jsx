import { useEffect, useState } from 'react';
import { serviceApi } from '../api/api';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ serName: '', serPrice: '', serDuration: '' });

  const fetchServices = async () => {
    try {
      const response = await serviceApi.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        serName: formData.serName,
        serPrice: parseFloat(formData.serPrice),
        serDuration: parseInt(formData.serDuration)
      };
      
      if (editingService) {
        await serviceApi.update(editingService.serId, data);
      } else {
        await serviceApi.create(data);
      }
      
      setShowModal(false);
      setEditingService(null);
      setFormData({ serName: '', serPrice: '', serDuration: '' });
      fetchServices();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      serName: service.serName,
      serPrice: service.serPrice.toString(),
      serDuration: service.serDuration.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás segura de eliminar este servicio?')) {
      try {
        await serviceApi.delete(id);
        fetchServices();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Servicios</h2>
          <p className="text-gray-500 mt-1">Gestiona el catálogo de procedimientos.</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setEditingService(null); setFormData({ serName: '', serPrice: '', serDuration: '' }); }}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-pink/20 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Servicio
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-pink-100">
          <div className="text-6xl mb-4">💅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay servicios todavía</h3>
          <p className="text-gray-500 mb-6">Comienza agregando tu primer servicio</p>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
          >
            Agregar Servicio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {services.map((service) => (
            <div 
              key={service.serId} 
              className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-pink-200 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-3 rounded-xl text-2xl group-hover:scale-110 transition-transform">
                  💅
                </div>
                <span className="text-xs font-bold text-purple-500 bg-purple-50 px-2 py-1 rounded-full">
                  {service.serDuration} min
                </span>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2">{service.serName}</h3>
              <p className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                ${service.serPrice.toLocaleString('es-CO')}
              </p>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => handleEdit(service)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(service.serId)}
                  className="px-3 py-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Servicio</label>
                <input
                  type="text"
                  value={formData.serName}
                  onChange={(e) => setFormData({...formData, serName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                  placeholder="Ej: Manicure Profesional"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.serPrice}
                    onChange={(e) => setFormData({...formData, serPrice: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    placeholder="25000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duración (min)</label>
                  <input
                    type="number"
                    value={formData.serDuration}
                    onChange={(e) => setFormData({...formData, serDuration: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    placeholder="60"
                    required
                  />
                </div>
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
                  {editingService ? 'Guardar Cambios' : 'Crear Servicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;

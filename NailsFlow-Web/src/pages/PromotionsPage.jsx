import { useEffect, useState } from 'react';
import { promotionApi, serviceApi } from '../api/api';

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requiredVisits: '',
    discountPercentage: '',
    status: true,
    targetServiceId: ''
  });

  const fetchData = async () => {
    try {
      const [promotionsRes, servicesRes] = await Promise.all([
        promotionApi.getAll(),
        serviceApi.getAll()
      ]);
      setPromotions(promotionsRes.data);
      setServices(servicesRes.data);
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
        name: formData.name,
        description: formData.description,
        requiredVisits: parseInt(formData.requiredVisits),
        discountPercentage: parseInt(formData.discountPercentage),
        status: formData.status,
        targetServiceId: parseInt(formData.targetServiceId)
      };
      
      if (editingPromotion) {
        await promotionApi.update(editingPromotion.promoId, data);
      } else {
        await promotionApi.create(data);
      }
      
      setShowModal(false);
      setEditingPromotion(null);
      setFormData({ name: '', description: '', requiredVisits: '', discountPercentage: '', status: true, targetServiceId: '' });
      fetchData();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      name: promotion.name,
      description: promotion.description || '',
      requiredVisits: promotion.requiredVisits?.toString() || '',
      discountPercentage: promotion.discountPercentage?.toString() || '',
      status: promotion.status,
      targetServiceId: promotion.targetServiceId?.toString() || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás segura de eliminar esta promoción?')) {
      try {
        await promotionApi.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const getServiceName = (serviceId) => {
    const service = services.find(s => s.serId === serviceId);
    return service ? service.serName : 'Servicio no encontrado';
  };

  const toggleStatus = async (promotion) => {
    try {
      await promotionApi.update(promotion.promoId, {
        ...promotion,
        status: !promotion.status
      });
      fetchData();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Promociones</h2>
          <p className="text-gray-500 mt-1">Gestiona las promociones y descuentos.</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setEditingPromotion(null); setFormData({ name: '', description: '', requiredVisits: '', discountPercentage: '', status: true, targetServiceId: '' }); }}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-pink/20 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Promoción
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : promotions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-pink-100">
          <div className="text-6xl mb-4">🎁</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay promociones todavía</h3>
          <p className="text-gray-500 mb-6">Crea tu primera promoción</p>
          <button onClick={() => setShowModal(true)} className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors">
            Crear Promoción
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {promotions.map((promotion) => (
            <div key={promotion.promoId} className={`bg-white rounded-2xl shadow-sm border-2 transition-all p-5 ${promotion.status ? 'border-pink-200 hover:border-pink-400' : 'border-gray-200 opacity-75'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-gradient-to-br from-pink-400 to-purple-500 p-3 rounded-xl text-2xl">
                  🎁
                </div>
                <button
                  onClick={() => toggleStatus(promotion)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${promotion.status ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {promotion.status ? 'Activa' : 'Inactiva'}
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-1">{promotion.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{promotion.description || 'Sin descripción'}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Descuento</span>
                  <span className="font-bold text-pink-600 text-lg">{promotion.discountPercentage}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Visitas requeridas</span>
                  <span className="font-semibold text-gray-700">{promotion.requiredVisits}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Servicio</span>
                  <span className="font-semibold text-gray-700">{getServiceName(promotion.targetServiceId)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleEdit(promotion)}
                  className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(promotion.promoId)}
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingPromotion ? 'Editar Promoción' : 'Nueva Promoción'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                  placeholder="Ej: Promo 5x1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all resize-none"
                  rows={2}
                  placeholder="Detalles de la promoción..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visitas requeridas</label>
                  <input
                    type="number"
                    value={formData.requiredVisits}
                    onChange={(e) => setFormData({...formData, requiredVisits: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    placeholder="5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">% Descuento</label>
                  <input
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                    placeholder="20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
                <select
                  value={formData.targetServiceId}
                  onChange={(e) => setFormData({...formData, targetServiceId: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                  required
                >
                  <option value="">Seleccionar servicio</option>
                  {services.map(service => (
                    <option key={service.serId} value={service.serId}>
                      {service.serName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="status"
                  checked={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-pink-500 focus:ring-pink-400"
                />
                <label htmlFor="status" className="text-sm font-medium text-gray-700">Promoción activa</label>
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
                  {editingPromotion ? 'Guardar Cambios' : 'Crear Promoción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionsPage;

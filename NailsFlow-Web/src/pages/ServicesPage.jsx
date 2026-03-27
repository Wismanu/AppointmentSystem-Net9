import { useEffect, useState } from 'react';
import api from '../api/api'; // Verifica que la ruta a tu configuración de axios sea correcta

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/api/Service');
        setServices(response.data);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Nuestros Servicios</h2>
          <p className="text-gray-500 mt-1">Gestiona el catálogo de procedimientos de NailsFlow.</p>
        </div>
        <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md shadow-pink-100">
          + Nuevo Servicio
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service.serId} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-pink-50 p-3 rounded-lg text-2xl group-hover:scale-110 transition-transform">
                  💅
                </div>
                <span className="text-xs font-bold text-pink-500 bg-pink-50 px-2 py-1 rounded-full">
                  {service.serDuration} min
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{service.serName}</h3>
              <p className="text-2xl font-black text-pink-600">
                ${service.serPrice.toLocaleString('es-CO')}
              </p>
              <div className="mt-6 flex space-x-2">
                <button className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  Editar
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
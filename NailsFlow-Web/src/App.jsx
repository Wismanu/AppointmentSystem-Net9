import { useEffect, useState } from 'react'
import api from './api/api'

function App() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para traer los datos del API de .NET
    const fetchServicios = async () => {
      try {
        const response = await api.get('/Service'); // Asegurar que el endpoint sea /api/Service
        setServicios(response.data);
      } catch (error) {
        console.error("Error al conectar con el API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-pink-600 mb-8">💅 NailsFlow Services</h1>
      
      {loading ? (
        <p className="text-gray-500 animate-pulse">Cargando servicios desde Ocaña...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {servicios.map((s) => (
            <div key={s.serId} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-pink-400">
              <h3 className="font-bold text-gray-800 text-lg">{s.serName}</h3>
              <p className="text-pink-500 font-bold text-xl mt-2">
                ${s.serPrice.toLocaleString('es-CO')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
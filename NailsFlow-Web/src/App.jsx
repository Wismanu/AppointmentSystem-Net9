import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ServicesPage from './pages/ServicesPage'; // Asegúrate de haber movido tu código viejo aquí

const Dashboard = () => (
  <div className="animate-fade-in">
    <h2 className="text-3xl font-bold text-gray-800">Bienvenido, Wisman 👋</h2>
    <p className="text-gray-500 mt-2">Aquí verás el resumen de hoy en NailsFlow.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Todas las rutas dentro de AdminLayout compartirán el Sidebar */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="servicios" element={<ServicesPage />} />
          <Route path="citas" element={<div className="text-2xl font-bold">Módulo de Citas (Próximamente)</div>} />
          <Route path="clientes" element={<div className="text-2xl font-bold text-gray-800">Módulo de Clientes (Próximamente)</div>} />
          <Route path="promociones" element={<div className="text-2xl font-bold">Módulo de Promociones (Próximamente)</div>} />
          <Route path="*" element={<div className="p-10 text-center text-red-500 font-bold">Error 404: Página no encontrada</div>} />
          {/* Agregaremos más después */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
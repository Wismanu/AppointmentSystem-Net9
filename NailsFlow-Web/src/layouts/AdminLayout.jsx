import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Menu Lateral Fijo */}
      <Sidebar />

      {/* Contenido Principal Movible */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
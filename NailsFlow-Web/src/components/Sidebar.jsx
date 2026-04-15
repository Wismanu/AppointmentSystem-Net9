import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconPeople, IconCalendar, IconNailPolish, IconGift, IconCreditCard, IconWavingHand, IconEmail } from './Icons';

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper function to check if user has a specific role
  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => role.rolName === roleName);
  };

  // Get menu items based on user role
  const getMenuItems = () => {
    if (hasRole('Administrador')) {
      return [
        { name: 'Dashboard', path: '/', icon: <IconWavingHand /> },
        { name: 'Citas', path: '/citas', icon: <IconCalendar /> },
        { name: 'Servicios', path: '/servicios', icon: <IconNailPolish /> },
        { name: 'Clientes', path: '/clientes', icon: <IconPeople /> },
        { name: 'Promociones', path: '/promociones', icon: <IconGift /> },
        { name: 'Pagos', path: '/pagos', icon: <IconCreditCard /> },
        { name: 'Gestión de Roles', path: '/roles', icon: <IconPeople /> },
        { name: 'Mi Perfil', path: '/perfil', icon: <IconEmail /> },
      ];
    } else if (hasRole('Manicurista')) {
      return [
        { name: 'Dashboard', path: '/', icon: <IconWavingHand /> },
        { name: 'Citas', path: '/citas', icon: <IconCalendar /> },
        { name: 'Clientes', path: '/clientes', icon: <IconPeople /> },
        { name: 'Mi Perfil', path: '/perfil', icon: <IconEmail /> },
      ];
    } else {
      // Cliente
      return [
        { name: 'Dashboard', path: '/', icon: <IconWavingHand /> },
        { name: 'Mis Citas', path: '/citas', icon: <IconCalendar /> },
        { name: 'Promociones', path: '/promociones', icon: <IconGift /> },
        { name: 'Mi Perfil', path: '/perfil', icon: <IconEmail /> },
      ];
    }
  };

  const menuItems = getMenuItems();

  // Get role names for display
  const getRoleNames = () => {
    if (!user || !user.roles || user.roles.length === 0) return 'Usuario';
    return user.roles.map(role => role.rolName).join(', ');
  };

  return (
    <div className="w-64 bg-white h-screen shadow-xl border-r border-pink-100 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-pink-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              NailsFlow
            </h1>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Admin Panel</p>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-4 py-3 bg-pink-50 mx-4 mt-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{user.name || user.username}</p>
              <p className="text-xs text-gray-500 truncate">{getRoleNames()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
        {menuItems
          .map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-lg shadow-pink-200 font-semibold' 
                    : 'text-gray-500 hover:bg-pink-50 hover:text-pink-500'
                }`
              }
            >
              <span>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </NavLink>
          ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

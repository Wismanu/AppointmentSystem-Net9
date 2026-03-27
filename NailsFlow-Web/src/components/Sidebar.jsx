import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Citas', path: '/citas', icon: '📅' },
    { name: 'Servicios', path: '/servicios', icon: '💅' },
    { name: 'Clientes', path: '/clientes', icon: '👥' },
    { name: 'Promociones', path: '/promociones', icon: '🎁' },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg border-r border-pink-100 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-pink-600 tracking-tight">NailsFlow</h1>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 mt-4 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-pink-50 text-pink-600 border-r-4 border-pink-500 font-semibold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-pink-400'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center space-x-3 w-full p-3 text-gray-400 hover:text-red-500 transition-colors">
          <span>🚪</span>
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
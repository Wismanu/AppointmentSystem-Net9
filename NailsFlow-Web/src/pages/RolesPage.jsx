import { useEffect, useState } from 'react';
import { userApi, rolApi } from '../api/api';

const RolesPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    roleId: ''
  });

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        userApi.getAll(),
        rolApi.getAll()
      ]);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignRole = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    
    // Get current roles for this user
    userApi.getById(user.usrId)
      .then(res => {
        setUserRoles(res.data.roles || []);
      })
      .catch(err => {
        console.error('Error al cargar roles del usuario:', err);
        setUserRoles([]);
      });
  };

  const handleAssign = async () => {
    if (!formData.userId || !formData.roleId) {
      alert('Por favor seleccione usuario y rol');
      return;
    }

    try {
      await rolApi.assignToUser({
        usrId: parseInt(formData.userId),
        rolId: parseInt(formData.roleId)
      });
      
      // Update user roles in state
      const updatedUser = users.find(u => u.usrId === parseInt(formData.userId));
      if (updatedUser) {
        const updatedUserRoles = [...userRoles, 
          roles.find(r => r.rolId === parseInt(formData.roleId))
        ];
        setUserRoles(updatedUserRoles);
        
        // Update in users list
        setUsers(users.map(u => 
          u.usrId === parseInt(formData.userId) 
            ? {...u, roles: updatedUserRoles} 
            : u
        ));
      }
      
      setShowModal(false);
      setFormData({ userId: '', roleId: '' });
    } catch (error) {
      console.error('Error al asignar rol:', error);
      alert('Error al asignar rol');
    }
  };

  const handleRemoveRole = async (roleId) => {
    if (!selectedUser) return;

    try {
      await rolApi.removeFromUser({
        usrId: selectedUser.usrId,
        rolId: roleId
      });
      
      // Update state
      setUserRoles(userRoles.filter(r => r.rolId !== roleId));
      
      // Update in users list
      setUsers(users.map(u => 
        u.usrId === selectedUser.usrId 
          ? {...u, roles: userRoles.filter(r => r.rolId !== roleId)} 
          : u
      ));
    } catch (error) {
      console.error('Error al quitar rol:', error);
      alert('Error al quitar rol');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Roles</h2>
          <p className="text-gray-500 mt-1">Asigna y gestiona los roles de los usuarios</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-pink-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Roles Actuales</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.usrId} className="hover:bg-pink-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-400">{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {(user.roles || []).map((role) => (
                          <span key={role.rolId} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {role.rolName}
                          </span>
                        ))}
                        {(user.roles || []).length === 0 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                            Sin roles asignados
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleAssignRole(user)}
                          className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Asignar Rol
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for assigning roles */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Asignar Rol a {selectedUser.name}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleAssign(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roles Actuales</label>
                <div className="space-y-1">
                  {userRoles.map((role) => (
                    <span key={role.rolId} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {role.rolName}
                    </span>
                  ))}
                  {userRoles.length === 0 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                      Sin roles asignados
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asignar Nuevo Rol</label>
                <select
                  value={formData.roleId}
                  onChange={(e) => setFormData({...formData, roleId: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                  required
                >
                  <option value="">Seleccionar rol</option>
                  {roles.map(role => (
                    <option key={role.rolId} value={role.rolId}>
                      {role.rolName}
                    </option>
                  ))}
                </select>
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
                  Asignar Rol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPage;
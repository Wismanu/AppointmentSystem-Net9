import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/api';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    phone: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Get fresh user data from API
        const response = await userApi.getById(user.usrId);
        const userData = response.data;
        
        setProfileData({
          name: userData.name || '',
          username: userData.username || '',
          email: userData.email || '',
          phone: userData.phone || ''
        });
        
        // Update auth context with latest data
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to auth context data
        setProfileData({
          name: user.name || '',
          username: user.username || '',
          email: user.email || '',
          phone: user.phone || ''
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user.usrId]);

  const handleUpdateProfile = async () => {
    try {
      const updateData = {
        name: profileData.name,
        username: profileData.username,
        email: profileData.email,
        phone: profileData.phone
      };
      
      await userApi.update(user.usrId, updateData);
      
      // Update auth context
      const updatedUser = { ...user, ...updateData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccessMessage('Perfil actualizado exitosamente');
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Error al actualizar el perfil');
      setSuccessMessage('');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('Las contraseñas nuevas no coinciden');
      setSuccessMessage('');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres');
      setSuccessMessage('');
      return;
    }

    try {
      await userApi.update(user.usrId, {
        password: passwordData.newPassword
      });
      
      setShowPasswordModal(false);
      setSuccessMessage('Contraseña cambiada exitosamente');
      setErrorMessage('');
      
      // Reset password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage('Error al cambiar la contraseña');
      setSuccessMessage('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Mi Perfil</h2>
          <p className="text-gray-500 mt-1">Administra tu información personal</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold">
            {profileData.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{profileData.name}</p>
            <p className="text-sm text-gray-400">{profileData.username}</p>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 space-y-6">
          {/* Profile Info Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Información Personal</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    placeholder="Ej: María García"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                    placeholder="Ej: maria123"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder="Ej: maria@correo.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="Ej: 3001234567"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleUpdateProfile}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg shadow-pink/20"
            >
              Actualizar Perfil
            </button>
          </div>

          {/* Roles Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Mis Roles</h3>
            <div className="space-y-2">
              {user.roles && user.roles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <span key={role.rolId} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {role.rolName}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No tienes roles asignados</p>
              )}
            </div>
          </div>

          {/* Change Password Section */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Cambiar Contraseña</h3>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="text-sm font-medium text-pink-500 hover:text-pink-600"
            >
              Cambiar mi contraseña
            </button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Cambiar Contraseña</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none"
                  placeholder="Repite la contraseña"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg shadow-pink/20"
              >
                Cambiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
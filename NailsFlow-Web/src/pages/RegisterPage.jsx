import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    usrName: '',
    usrPass: '',
    usrPassConfirm: '',
    usrPhone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Nuevo estado
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.usrPass !== formData.usrPassConfirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.usrPass.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.usrName,
        password: formData.usrPass,
        phone: formData.usrPhone
      });

      setSuccess('¡Cuenta creada exitosamente! Redirigiendo...');

      setTimeout(() => {
        navigate('/login', { state: { message: 'Cuenta creada exitosamente. ¡Inicia sesión!' } });
      }, 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al registrar usuario';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-pink-100 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl mb-4 shadow-lg shadow-pink-200">
              <span className="text-3xl">💅</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              NailsFlow
            </h1>
            <p className="text-gray-500 mt-2">Crea tu cuenta</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm text-center font-medium">
            {success}
          </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="usrName" className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <input
                type="text"
                id="usrName"
                name="usrName"
                value={formData.usrName}
                onChange={handleChange}
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white/50"
                placeholder="Elige un usuario"
                required
              />
            </div>

            <div>
              <label htmlFor="usrPhone" className="block text-sm font-medium text-gray-700 mb-2">Teléfono (opcional)</label>
              <input
                type="tel"
                id="usrPhone"
                name="usrPhone"
                value={formData.usrPhone}
                onChange={handleChange}
                autoComplete="tel"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white/50"
                placeholder="300 123 4567"
              />
            </div>

            <div>
              <label htmlFor="usrPass" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                id="usrPass"
                name="usrPass"
                value={formData.usrPass}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white/50"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="usrPassConfirm" className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
              <input
                type="password"
                id="usrPassConfirm"
                name="usrPassConfirm"
                value={formData.usrPassConfirm}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all bg-white/50"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-pink-500 font-semibold hover:text-pink-600 transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

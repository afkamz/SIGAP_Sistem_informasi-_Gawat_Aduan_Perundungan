import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

/**
 * Route Guard Component
 * Menjaga rute terproteksi agar tidak dapat diakses tanpa autentikasi yang sah.
 * - requiredRole='admin': Memastikan pengguna memiliki token admin yang aktif.
 * - requiredRole='siswa': Memastikan siswa sudah login dengan akun terdaftar.
 */
export const ProtectedRoute = ({ children, requiredRole = 'siswa' }) => {
  const { currentUser, token, role } = useStore();
  const location = useLocation();

  if (requiredRole === 'admin') {
    const isAdmin = role === 'admin' || currentUser?.role === 'admin';
    const hasToken = !!token || !!localStorage.getItem('SIGAP_AUTH_TOKEN');
    if (!isAdmin || !hasToken) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
  }

  if (requiredRole === 'siswa') {
    const isSiswa = !!currentUser;
    if (!isSiswa) {
      return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;


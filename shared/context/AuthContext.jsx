import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, TOKEN_KEY } from '@shared/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // sahifa yangilanganda tokenni tekshirish
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return setReady(true);
    api.get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setReady(true));
  }, []);

  const handleAuth = (res) => {
    localStorage.setItem(TOKEN_KEY, res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const login = useCallback((payload) => api.post('/auth/login', payload).then(handleAuth), []);
  const register = useCallback((payload) => api.post('/auth/register', payload).then(handleAuth), []);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch { /* token allaqachon yaroqsiz bo'lishi mumkin */ }
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, isAdmin: user?.role === 'admin', login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth AuthProvider ichida ishlatilishi kerak');
  return ctx;
};

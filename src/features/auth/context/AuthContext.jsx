import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../../../lib/api';
import { TOKEN_KEY } from '../../../config/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const result = await authApi.me();
      const currentUser = result?.user || null;
      if (!currentUser) localStorage.removeItem(TOKEN_KEY);
      setUser(currentUser);
      return currentUser;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback((result) => {
    if (!result?.token || !result?.user) throw new Error('The login response did not include a token and user.');
    localStorage.setItem(TOKEN_KEY, result.token);
    setUser(result.user);
    setLoading(false);
    return result.user;
  }, []);

  useEffect(() => {
    refreshUser();
    const handleStorage = (event) => {
      if (event.key === TOKEN_KEY) refreshUser();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshUser]);

  const value = useMemo(() => ({
    user, loading, isAuthenticated: Boolean(user), signIn, signOut, refreshUser,
  }), [user, loading, signIn, signOut, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me/');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login/', { email, password });
    setUser(response.data);
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register/', userData);
    // Automatically login or require separate login
    // For now, let's require separate login or just auto login if backend supported it (backend doesn't auto login on register currently)
    return response.data;
  };

  const logout = async () => {
    await api.post('/auth/logout/');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

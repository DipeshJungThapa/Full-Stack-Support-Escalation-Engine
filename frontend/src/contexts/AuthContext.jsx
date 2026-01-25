import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      // Skip API call if no token exists
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      try {
        const response = await api.get('/auth/me/');
        setUser(response.data);
      } catch (error) {
        // Token invalid or expired, clear storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/token/', { email, password });
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    // Fetch user details
    const userResponse = await api.get('/auth/me/');
    setUser(userResponse.data);
    return userResponse.data;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  };

  const googleLogin = async (credential) => {
    try {
      const response = await api.post('/auth/google/', {
        access_token: credential,
        id_token: credential
      });

      console.log("Google Login Response:", response.data);
      const { access, refresh } = response.data;

      if (!access) {
        throw new Error("No access token returned from backend");
      }

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Fetch user details
      const userResponse = await api.get('/auth/me/');
      setUser(userResponse.data);
      return userResponse.data;
    } catch (error) {
      console.error("Google Login Error:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    // Session logout (optional since using JWT)
    try {
      await api.post('/auth/logout/');
    } catch (e) { }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

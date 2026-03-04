// src/context/AuthContext.jsx

import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  });

  const login = async (email, password, rememberMe = false) => {
    try {
      const res = await fetch('https://novel-fresh-spaniel.ngrok-free.app/api/accounts/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, 
          password: password
        }),
      });

      if (!res.ok) {
        console.log(email, password);
        const err = await res.json();
        throw new Error(err.detail || 'Login failed');
      }

      const data = await res.json();
      const storage = rememberMe ? localStorage : sessionStorage;
      
      // Store tokens
      storage.setItem('accessToken', data.access);
      storage.setItem('refreshToken', data.refresh);
      storage.setItem('rememberMe', JSON.stringify(rememberMe));

      // Set user - attempt to fetch full_name from stored data or use email as fallback
      const storedUser = storage.getItem('user');
      const fullName = storedUser ? JSON.parse(storedUser).full_name : '';
      const loggedInUser = { username: email, full_name: fullName || '' };
      setUser(loggedInUser);
      storage.setItem('user', JSON.stringify(loggedInUser));

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    const rememberMe = JSON.parse(localStorage.getItem('rememberMe') || sessionStorage.getItem('rememberMe') || 'false');
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.removeItem('accessToken');
    storage.removeItem('refreshToken');
    storage.removeItem('user');
    storage.removeItem('rememberMe');
  };



  const register = async (name, email, password) => {
    try {
      const res = await fetch('https://novel-fresh-spaniel.ngrok-free.app/api/accounts/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: name,  // 🔁 properly labeled
          email: email,
          password: password,
        }),
      });
  
      if (!res.ok) {
        const err = await res.json();
        console.log("🚨 Register error response:", err);
        throw new Error(err.detail || Object.values(err).join(', ') || 'Registration failed');
      }
  
      // auto-login after register
      console.log("✅ Registration successful, auto-logging in...");

      // Store full_name during registration
      const registeredUser = { username: email, full_name: name };
      localStorage.setItem('user', JSON.stringify(registeredUser));
      setUser(registeredUser);
      return await login(email, password, true);
  
    } catch (err) {
      return { success: false, message: err.message };
    }
  };
  



  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
    role: null,
  });

  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const savedUserJSON = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

    if (savedUserJSON && savedUserJSON !== 'undefined' && token) {
      try {
        const savedUser = JSON.parse(savedUserJSON);
        setAuth({ user: savedUser, token, role: savedRole || savedUser.role });
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        setAuth({ user: null, token: null, role: null });
      }
    } else {
      setAuth({ user: null, token: null, role: null });
    }

    setLoading(false); 
  }, []);

  const login = (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('role', user.role);
    setAuth({ user, token, role: user.role });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuth({ user: null, token: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState } from 'react';
import {
  saveUser,
  findUser,
  userExists,
  setLoggedInUser,
  getLoggedInUser,
  logoutUser,
} from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getLoggedInUser());

  const login = (email, password) => {
    const foundUser = findUser(email, password);
    if (foundUser) {
      setUser(foundUser);
      setLoggedInUser(foundUser);
      return { success: true, user: foundUser };
    }
    return { success: false, error: 'Usuario o contraseña incorrectos.' };
  };

  const register = (email, password, password2) => {
    if (password !== password2) {
      return { success: false, error: 'Las contraseñas no coinciden.' };
    }
    if (userExists(email)) {
      return { success: false, error: 'El correo ya está registrado.' };
    }
    saveUser(email, password);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    logoutUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

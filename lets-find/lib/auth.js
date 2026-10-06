import { jwtDecode } from 'jwt-decode';

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getUser = () => {
  const token = getToken();
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  const user = getUser();
  if (!user) return false;
  return user.exp * 1000 > Date.now();
};

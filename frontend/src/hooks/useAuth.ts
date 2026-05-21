import { create } from 'zustand';
import axios from 'axios';

const API_URL = '/api/auth';

interface AuthState {
  user: any | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  accessToken: localStorage.getItem('accessToken'),

  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { user, accessToken, refreshToken } = response.data.data;
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    set({ user, accessToken });
  },

  register: async (data) => {
    const response = await axios.post(`${API_URL}/register`, data);
    const { user, accessToken, refreshToken } = response.data.data;

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    set({ user, accessToken });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, accessToken: null });
  },

  init: () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (user && token) {
      set({ user: JSON.parse(user), accessToken: token });
    }
  }
}));

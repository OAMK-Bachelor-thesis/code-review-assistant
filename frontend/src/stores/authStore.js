import { create } from 'zustand';
import { authAPI } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
    //Call the API when build login component
        const response = await authAPI.login(email, password);
        
      // API call will be added in api.js
      // For now, just store in state
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Register
  register: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      //Call the API when build register component
        const response = await authAPI.register(email, password, username);
      // API call will be added in api.js
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Set Auth Data
  setAuth: (user, token) => set({ 
    user, 
    token, 
    isAuthenticated: true,
    error: null 
  }),

  // Logout
  logout: () => set({ 
    user: null, 
    token: null, 
    isAuthenticated: false 
  }),

  // Clear Error
  clearError: () => set({ error: null }),
}));

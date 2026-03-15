// AUTH handled by frontier_consult API Gateway
// POST /api/auth/register
// POST /api/auth/login

import apiClient from '../api/apiClient';
import type { AuthCredentials, AuthResponse } from '../types';

export const authService = {
  /**
   * Register a new user
   * TODO: Connect to POST /api/auth/register on frontier_consult
   */
  async register(credentials: AuthCredentials): Promise<AuthResponse> {
    // TODO: Replace mock with actual API call
    // const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
    // return response.data;

    // Mock implementation for UI development
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      user: { id: 1, email: credentials.email },
    };
    localStorage.setItem('token', mockResponse.token);
    return mockResponse;
  },

  /**
   * Login existing user
   * TODO: Connect to POST /api/auth/login on frontier_consult
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    // TODO: Replace mock with actual API call
    // const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    // return response.data;

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      user: { id: 1, email: credentials.email },
    };
    localStorage.setItem('token', mockResponse.token);
    return mockResponse;
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};

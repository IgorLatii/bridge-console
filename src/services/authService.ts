import type { AuthCredentials, AuthResponse } from '../types';

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8081';

export const authService = {
  async register(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Registration failed');
    }

    const data = await response.json();

    return {
      token: '',
      user: {
        id: data.id ?? '',
        email: data.email,
        role: data.role ?? 'USER',
      },
    };
  },

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Invalid credentials');
    }

    const data = await response.json();

    localStorage.setItem('token', data.token);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userRole', data.role);

    return {
      token: data.token,
      user: {
        id: data.id,
        email: data.email,
        role: data.role,
      },
    };
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};
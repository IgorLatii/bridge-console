export interface UserDto {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8081';

function getAuthHeaders() {
    const token = localStorage.getItem('token');

    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
}

export const userService = {
    async getUsers(): Promise<UserDto[]> {
        const response = await fetch(`${API_URL}/user`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to load users');
        }

        return response.json();
    },

    async createUser(data: { email: string; password: string }): Promise<UserDto> {
        const response = await fetch(`${API_URL}/user`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to create user');
        }

        return response.json();
    },

    async deleteUser(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/user/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to delete user');
        }
    },

    async toggleUserRole(id: string): Promise<UserDto> {
        const response = await fetch(`${API_URL}/user/${id}/toggle-role`, {
            method: 'PUT',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to update role');
        }

        return response.json();
    },
};
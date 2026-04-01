export interface AIAnswerResponse {
  id?: string;
  userId?: string;
  question: string;
  answer: string;
  timestamp?: number;
}

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8081';

function getAuthHeaders() {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export const aiService = {
  async askQuestion(question: string): Promise<AIAnswerResponse> {
    const response = await fetch(`${API_URL}/questions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to get answer');
    }

    return response.json();
  },

  async getHistory(): Promise<AIAnswerResponse[]> {
    const response = await fetch(`${API_URL}/questions/history`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to load history');
    }

    return response.json();
  },
};
import { authService } from './authService';

const API_BASE_URL = `http://${window.location.hostname}:5090/api`;

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const token = await authService.getValidAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const expenseService = {
  // Get all expenses
  async getAllExpenses() {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      headers: await getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    return response.json();
  },

  // Get single expense by ID
  async getExpenseById(id) {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      headers: await getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch expense');
    }
    return response.json();
  },

  // Create new expense
  async createExpense(expenseData) {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(expenseData),
    });

    if (!response.ok) {
      throw new Error('Failed to create expense');
    }
    return response.json();
  },

  // Delete expense
  async deleteExpense(id) {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }
    return response.status === 204;
  },

  // Get all categories
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: await getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },

  // Create new category
  async createCategory(categoryData) {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    return response.json();
  },
};

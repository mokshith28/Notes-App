import { authenticatedFetch, API_BASE_URL } from './apiClient';

/**
 * Makes an authenticated API request and handles the response
 */
async function makeRequest(url, options = {}) {
  const response = await authenticatedFetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || `Request failed with status ${response.status}`);
  }

  return response.status === 204 ? true : response.json();
}

export const expenseService = {
  /**
   * Get all expenses for the authenticated user
   */
  async getAllExpenses() {
    return makeRequest(`${API_BASE_URL}/expenses`);
  },

  /**
   * Get a single expense by ID
   */
  async getExpenseById(id) {
    return makeRequest(`${API_BASE_URL}/expenses/${id}`);
  },

  /**
   * Create a new expense
   */
  async createExpense(expenseData) {
    return makeRequest(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  },

  /**
   * Delete an expense
   */
  async deleteExpense(id) {
    return makeRequest(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get all categories for the authenticated user
   */
  async getCategories() {
    return makeRequest(`${API_BASE_URL}/categories`);
  },

  /**
   * Create a new category
   */
  async createCategory(categoryData) {
    return makeRequest(`${API_BASE_URL}/categories`, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },
};

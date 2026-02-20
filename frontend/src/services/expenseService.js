const API_BASE_URL = 'https://localhost:7211/api';

export const expenseService = {
  // Get all expenses
  async getAllExpenses() {
    const response = await fetch(`${API_BASE_URL}/expenses`);
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    return response.json();
  },

  // Get single expense by ID
  async getExpenseById(id) {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch expense');
    }
    return response.json();
  },

  // Create new expense
  async createExpense(expenseData) {
    debugger
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    });
    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }
    return response.status === 204;
  },
};

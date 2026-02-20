import { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import { expenseService } from './services/expenseService';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = () => {
    // Refresh the list after adding a new expense
    fetchExpenses();
  };

  const handleDeleteExpense = (id) => {
    // Remove the expense from state
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Expense Tracker</h1>
        <p className="app-subtitle">Track your expenses and manage your budget</p>
      </header>

      <main className="app-content">
        <ExpenseForm onExpenseAdded={handleExpenseAdded} />
        <ExpenseList
          expenses={expenses}
          loading={loading}
          error={error}
          onDeleteExpense={handleDeleteExpense}
        />
      </main>
    </div>
  );
}

export default App;

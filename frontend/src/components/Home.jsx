import { useState, useEffect } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import Badge from './ui/Badge';
import { expenseService } from '../services/expenseService';
import './Home.css';

function Home() {
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

  // Calculate totals
  const totalIncome = expenses
    .filter(expense => expense.categoryType === 'Income')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalExpense = expenses
    .filter(expense => expense.categoryType === 'Expense')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <main className="app-content">
      <div className="summary-cards">
        <Badge variant="success" className="summary-card income-card">
          <span className="summary-emoji">💰</span>
          <div className="summary-details">
            <span className="summary-label">INCOME</span>
            <span className="summary-value">${totalIncome.toFixed(2)}</span>
          </div>
        </Badge>
        <Badge variant="danger" className="summary-card expense-card">
          <span className="summary-emoji">💸</span>
          <div className="summary-details">
            <span className="summary-label">EXPENSES</span>
            <span className="summary-value">${totalExpense.toFixed(2)}</span>
          </div>
        </Badge>
        <Badge variant="primary" className="summary-card balance-card">
          <span className="summary-emoji">💵</span>
          <div className="summary-details">
            <span className="summary-label">BALANCE</span>
            <span className="summary-value" style={{color: balance >= 0 ? '#22c55e' : '#ef4444'}}>
              ${Math.abs(balance).toFixed(2)}
            </span>
          </div>
        </Badge>
      </div>
      <ExpenseForm onExpenseAdded={handleExpenseAdded} />
      <ExpenseList
        expenses={expenses}
        loading={loading}
        error={error}
        onDeleteExpense={handleDeleteExpense}
      />
    </main>
  );
}

export default Home;

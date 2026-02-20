import ExpenseItem from './ExpenseItem';
import './ExpenseList.css';

function ExpenseList({ expenses, loading, error, onDeleteExpense }) {
  if (loading) {
    return (
      <div className="expense-list-container">
        <div className="loading-message">Loading expenses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="expense-list-container">
        <div className="error-message-list">
          <p>❌ {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="expense-list-container">
        <div className="empty-message">
          <p>📝 No expenses yet</p>
          <p className="empty-subtext">Add your first expense to get started!</p>
        </div>
      </div>
    );
  }

  // Calculate total
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="expense-list-container">
      <div className="expense-list-header">
        <h2>Your Expenses</h2>
        <div className="total-amount">
          <span className="total-label">Total:</span>
          <span className="total-value">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(total)}
          </span>
        </div>
      </div>
      
      <div className="expense-list">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onDelete={onDeleteExpense}
          />
        ))}
      </div>

      <div className="expense-count">
        {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} found
      </div>
    </div>
  );
}

export default ExpenseList;

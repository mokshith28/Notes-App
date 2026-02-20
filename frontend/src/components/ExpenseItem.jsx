import { useState } from 'react';
import { expenseService } from '../services/expenseService';
import './ExpenseItem.css';

function ExpenseItem({ expense, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    setDeleting(true);
    try {
      await expenseService.deleteExpense(expense.id);
      if (onDelete) {
        onDelete(expense.id);
      }
    } catch (error) {
      alert('Failed to delete expense: ' + error.message);
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="expense-item">
      <div className="expense-icon" style={{ backgroundColor: expense.categoryColor || '#646cff' }}>
        {expense.categoryIcon || '💰'}
      </div>
      
      <div className="expense-details">
        <div className="expense-header">
          <h3 className="expense-title">{expense.title}</h3>
          <span className="expense-amount">{formatAmount(expense.amount)}</span>
        </div>
        
        <div className="expense-meta">
          <span className="expense-category">{expense.categoryName}</span>
          <span className="expense-date">{formatDate(expense.transactionDate)}</span>
          {expense.username && (
            <span className="expense-user">👤 {expense.username}</span>
          )}
        </div>
        
        {expense.description && (
          <p className="expense-description">{expense.description}</p>
        )}
      </div>

      <button
        className="delete-btn"
        onClick={handleDelete}
        disabled={deleting}
        title="Delete expense"
      >
        {deleting ? '⏳' : '🗑️'}
      </button>
    </div>
  );
}

export default ExpenseItem;

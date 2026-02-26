import { useState } from 'react';
import { expenseService } from '../services/expenseService';
import Badge from './ui/Badge';
import Button from './ui/Button';
import './ExpenseItem.css';

function ExpenseItem({ expense, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
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

  const isIncome = expense.categoryType === 'Income';
  debugger
  return (
    <div className={`expense-item ${isIncome ? 'income-item' : 'expense-item-type'}`}>
      <div className="expense-main">
        <div className="expense-icon-wrapper">
          <Badge variant="primary" className="expense-icon" style={{ transform: `rotate(${Math.random() * 10 - 5}deg)` }}>
            {expense.categoryIcon || '💰'}
          </Badge>
        </div>
        
        <div className="expense-details">
          <div className="expense-top">
            <h3 className="expense-title">{expense.title}</h3>
            <span className={`expense-amount ${isIncome ? 'income-amount' : 'expense-amount-type'}`}>
              {isIncome ? '+' : '-'}{formatAmount(expense.amount)}
            </span>
          </div>
          
          <div className="expense-meta">
            <Badge variant="accent" size="small" className="expense-category-badge">
              {expense.categoryName}
            </Badge>
            <Badge variant={isIncome ? 'success' : 'danger'} size="small">
              {isIncome ? '💰 Income' : '💸 Expense'}
            </Badge>
            <span className="expense-date">{formatDate(expense.transactionDate)}</span>
          </div>
          
          {expense.description && (
            <p className="expense-description">{expense.description}</p>
          )}
        </div>
      </div>

      <Button
        variant="accent"
        size="small"
        onClick={handleDelete}
        disabled={deleting}
        className="expense-delete-btn"
        title="Delete expense"
      >
        {deleting ? '⏳' : '🗑️'}
      </Button>
    </div>
  );
}

export default ExpenseItem;

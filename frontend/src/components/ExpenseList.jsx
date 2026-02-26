import ExpenseItem from './ExpenseItem';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import './ExpenseList.css';

function ExpenseList({ expenses, loading, error, onDeleteExpense }) {
  if (loading) {
    return (
      <Card className="expense-list-status">
        <div className="expense-loading">
          <Badge variant="primary">⏳</Badge>
          <p className="status-text">LOADING EXPENSES...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="expense-list-status expense-error">
        <Badge variant="accent">❌</Badge>
        <p className="status-text">{error}</p>
        <Button onClick={() => window.location.reload()} size="small">
          RETRY
        </Button>
      </Card>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <Card className="expense-list-status expense-empty">
        <Badge variant="secondary" className="empty-badge">📝</Badge>
        <p className="status-text">NO EXPENSES YET</p>
        <p className="status-subtext">Add your first expense above!</p>
      </Card>
    );
  }

  // Calculate total
  const total = expenses.reduce((sum, expense) => {
    if(expense.categoryType === 'Income') {
        return sum + expense.amount;
    } else {
        return sum - expense.amount;
    }
  }, 0);

  return (
    <Card className="expense-list-container">
      <div className="expense-list-header">
        <div className="header-content">
          <h2 className="list-title">YOUR EXPENSES</h2>
          <p className="list-count">
            {expenses.length} {expenses.length === 1 ? 'EXPENSE' : 'EXPENSES'}
          </p>
        </div>
        <div className="total-badge">
          <Badge variant="secondary" className="total-amount">
            <span className="total-label">TOTAL</span>
            <span className="total-value">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(total)}
            </span>
          </Badge>
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
    </Card>
  );
}

export default ExpenseList;

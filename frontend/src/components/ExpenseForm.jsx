import { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import CategoryModal from './CategoryModal';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import Badge from './ui/Badge';
import './ExpenseForm.css';

function ExpenseForm({ onExpenseAdded }) {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    amount: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await expenseService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryAdded = async (newCategory) => {
    try {
      const data = await expenseService.getCategories();
      setCategories(data);
      setFormData((prev) => ({
        ...prev,
        categoryId: newCategory.id,
      }));
    } catch (err) {
      console.error('Failed to refresh categories:', err);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const expenseData = {
        CategoryId: Number(formData.categoryId),
        Title: formData.title,
        Amount: Number(formData.amount),
        Description: formData.description,
        TransactionDate: formData.transactionDate,
      };
      
      await expenseService.createExpense(expenseData);
      
      // Reset form
      setFormData({
        categoryId: '',
        title: '',
        amount: '',
        description: '',
        transactionDate: new Date().toISOString().split('T')[0],
      });
      
      setSuccess('✓ EXPENSE ADDED SUCCESSFULLY!');
      
      // Notify parent
      if (onExpenseAdded) {
        onExpenseAdded();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message || 'FAILED TO ADD EXPENSE');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="expense-form-card">
      <Card.Header>
        <div className="expense-form-header">
          <div>
            <h2 className="expense-form-title uppercase">→ ADD EXPENSE</h2>
            <p className="expense-form-subtitle">TRACK YOUR SPENDING</p>
          </div>
          <Badge variant="accent" rotate>
            💸 NEW
          </Badge>
        </div>
      </Card.Header>

      <Card.Body>
        {error && (
          <div className="expense-message expense-message--error">
            {error}
          </div>
        )}
        
        {success && (
          <div className="expense-message expense-message--success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="expense-form">
          <Input
            label="Expense Title"
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., COFFEE, LUNCH, GAS"
            fullWidth
          />

          <div className="expense-form-row">
            <Input
              label="Amount ($)"  
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />

            <Input
              label="Date"
              type="date" 
              id="transactionDate"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="neo-input-wrapper">
            <label className="neo-input__label uppercase">Category *</label>
            <div className="expense-category-wrapper">
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="neo-input neo-select"
              >
                <option value="">SELECT CATEGORY</option>
                {categories.map((category) => (
                  <option 
                    key={category.id} 
                    value={category.id}
                  >
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="secondary"
                onClick={handleOpenModal}
                className="expense-add-category-btn"
              >
                + NEW
              </Button>
            </div>
          </div>

          <Input.TextArea
            label="Description (Optional)"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="ADD NOTES ABOUT THIS EXPENSE..."
            rows={3}
          />

          <Button 
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? '⏳ ADDING...' : '→ ADD EXPENSE NOW'}
          </Button>
        </form>
      </Card.Body>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCategoryAdded={handleCategoryAdded}
      />
    </Card>
  );
}

export default ExpenseForm;

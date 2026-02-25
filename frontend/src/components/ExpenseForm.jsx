import { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import CategoryModal from './CategoryModal';
import './ExpenseForm.css';

function ExpenseForm({ onExpenseAdded }) {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: 1, // Default user ID - you can make this dynamic later
    categoryId: '', // Default category ID
    title: '',
    amount: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0], // Today's date
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories on component mount
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
    // Refresh categories list
    try {
      const data = await expenseService.getCategories();
      setCategories(data);
      // Auto-select the newly created category
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
      [name]: value, // Remove the Number conversion here
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('');
    setLoading(true);

    try {
      const expenseData = {
        UserId: Number(formData.userId),
        CategoryId: Number(formData.categoryId),
        Title: formData.title,
        Amount: Number(formData.amount),
        Description: formData.description,
        TransactionDate: formData.transactionDate,
      };
      
      const newExpense = await expenseService.createExpense(expenseData);
      // Reset form
      setFormData({
        userId: 1,
        categoryId: '',
        title: '',
        amount: '',
        description: '',
        transactionDate: new Date().toISOString().split('T')[0],
      });
      // Notify parent component
      if (onExpenseAdded) {
        onExpenseAdded(newExpense);
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-form-container">
      <h2>Add New Expense</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter expense title"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount *</label>
            <input
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
          </div>

          <div className="form-group">
            <label htmlFor="transactionDate">Date *</label>
            <input
              type="date"
              id="transactionDate"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="categoryId">Category *</label>
            <div className="category-input-wrapper">
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option 
                    key={category.id} 
                    value={category.id}
                  >
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              <button 
                type="button" 
                className="add-category-btn" 
                onClick={handleOpenModal}
                title="Add new category"
              >
                +
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              type="number"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter expense description (optional)"
            rows="3"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  );
}

export default ExpenseForm;

import { useState } from 'react';
import { expenseService } from '../services/expenseService';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';
import './CategoryModal.css';

function CategoryModal({ isOpen, onClose, onCategoryAdded }) {
  const [formData, setFormData] = useState({
    userId: 1, // TODO: Replace with actual user ID when authentication is ready
    name: '',
    type: 'Expense',
    color: '#667eea',
    icon: '💰'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Common expense icons
  const commonIcons = [
    '💰', '🍔', '🚗', '🏠', '🎬', '🛒', '💊', '📚', 
    '✈️', '🎮', '👕', '⚡', '🎵', '🏋️', '☕', '🎨'
  ];

  // Predefined colors
  const commonColors = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#43e97b', '#fa709a', '#feca57', '#ff6b6b',
    '#48dbfb', '#ff9ff3', '#54a0ff', '#00d2d3'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIconSelect = (icon) => {
    setFormData((prev) => ({
      ...prev,
      icon: icon,
    }));
  };

  const handleColorSelect = (color) => {
    setFormData((prev) => ({
      ...prev,
      color: color,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const categoryData = {
        UserId: Number(formData.userId),
        Name: formData.name,
        Type: formData.type,
        Color: formData.color,
        Icon: formData.icon
      };

      const newCategory = await expenseService.createCategory(categoryData);
      
      // Reset form
      setFormData({
        userId: 1,
        name: '',
        type: 'Expense',
        color: '#667eea',
        icon: '💰'
      });

      // Notify parent and close modal
      if (onCategoryAdded) {
        onCategoryAdded(newCategory);
      }
      onClose();
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 className="modal-title">NEW CATEGORY</h3>
            <Badge variant="primary">🆕</Badge>
          </div>
          <Button
            variant="outline"
            size="small"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close"
          >
            ✕
          </Button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label className="form-label">CATEGORY NAME</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Groceries"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">TYPE</label>
            <Input.Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </Input.Select>
          </div>

          <div className="form-group">
            <label className="form-label">ICON</label>
            <div className="icon-grid">
              {commonIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-btn ${formData.icon === icon ? 'icon-btn--selected' : ''}`}
                  onClick={() => handleIconSelect(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
            <Input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="Or enter custom emoji"
              className="custom-icon-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">COLOR</label>
            <div className="color-grid">
              {commonColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-btn ${formData.color === color ? 'color-btn--selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="custom-color-input"
            />
          </div>

          <div className="category-preview">
            <span className="preview-label">PREVIEW</span>
            <Badge 
              style={{ backgroundColor: formData.color, color: '#fff' }}
              className="preview-badge"
            >
              {formData.icon} {formData.name || 'Category'}
            </Badge>
          </div>

          <div className="modal-actions">
            <Button type="button" variant="outline" onClick={onClose}>
              CANCEL
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'CREATING...' : '✔️ CREATE'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;

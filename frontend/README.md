# Expense Tracker Frontend

A modern React frontend for the Expense Tracker application built with Vite.

## Features

✨ **Add New Expenses** - Create expenses with title, amount, category, description, and date
📊 **View All Expenses** - See all your expenses in a beautiful list with category icons and colors
🗑️ **Delete Expenses** - Remove expenses you no longer need
💰 **Total Calculation** - Automatic calculation of total expenses
📱 **Responsive Design** - Works great on desktop and mobile devices

## Project Structure

```
src/
├── components/
│   ├── ExpenseForm.jsx       # Form to add new expenses
│   ├── ExpenseForm.css
│   ├── ExpenseItem.jsx        # Individual expense display
│   ├── ExpenseItem.css
│   ├── ExpenseList.jsx        # List of all expenses
│   └── ExpenseList.css
├── services/
│   └── expenseService.js      # API service for backend communication
├── App.jsx                    # Main application component
├── App.css
├── index.css                  # Global styles
└── main.jsx
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (default: http://localhost:5000)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Configuration

### API Endpoint

The API base URL is configured in `src/services/expenseService.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Change this if your backend runs on a different port.

### Categories

The form includes 6 default categories:
- Food
- Transport
- Entertainment
- Shopping
- Bills
- Other

These can be modified in the `ExpenseForm.jsx` component.

## Backend Integration

This frontend expects the following API endpoints:

- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/{id}` - Get single expense
- `POST /api/expenses` - Create new expense
- `DELETE /api/expenses/{id}` - Delete expense

### Expected Response Format

**GET /api/expenses:**
```json
[
  {
    "id": 1,
    "title": "Grocery Shopping",
    "amount": 45.50,
    "description": "Weekly groceries",
    "transactionDate": "2026-02-20",
    "categoryName": "Food",
    "categoryColor": "#FF6B6B",
    "categoryIcon": "🍔",
    "username": "John"
  }
]
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 19.2** - UI framework
- **Vite 7.3** - Build tool and dev server
- **CSS3** - Styling with modern features
- **Fetch API** - HTTP requests

## Features Explained

### Expense Form
- Validates all required fields
- Date picker with default today's date
- Category dropdown selector
- Amount input with decimal support
- Optional description field
- Loading state during submission

### Expense List
- Displays expenses in reverse chronological order
- Shows total amount in formatted currency
- Empty state when no expenses exist
- Loading and error states
- Expense count at the bottom

### Expense Item
- Category icon with custom color
- Formatted date and currency
- Username display
- Delete confirmation dialog
- Hover effects for better UX

## Customization

### Colors

Main colors are defined in CSS variables:
- Primary: `#646cff`
- Success: `#4ade80`
- Background: `#242424`
- Card: `#1e1e1e`

### Category Icons

Categories can display emoji icons. Modify the `categoryIcon` field in your backend data to change icons.

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure your backend is configured to allow requests from `http://localhost:5173`.

Add this to your ASP.NET Core backend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:5173")
                       .AllowAnyMethod()
                       .AllowAnyHeader());
});

app.UseCors("AllowFrontend");
```

### API Connection Failed

1. Verify backend is running on port 5000
2. Check the API_BASE_URL in `expenseService.js`
3. Open browser console for detailed error messages

## Future Enhancements

- [ ] User authentication
- [ ] Edit existing expenses
- [ ] Filter by category and date range
- [ ] Charts and analytics
- [ ] Export to CSV/PDF
- [ ] Dark/Light theme toggle
- [ ] Pagination for large datasets

## License

MIT

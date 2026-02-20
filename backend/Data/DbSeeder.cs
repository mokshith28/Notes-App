using backend.Models;

namespace backend.Data
{
    public static class DbSeeder
    {
        public static void SeedData(ExpenseDbContext context)
        {
            // 1. Check if any Users exist. If not, create a default test user.
            if (!context.Users.Any())
            {
                var testUser = new User
                {
                    Username = "Mokshith",
                    Email = "test@example.com",
                    PasswordHash = "fake_hashed_password" // In production, never store plain text!
                };

                context.Users.Add(testUser);
                context.SaveChanges(); // Save so we generate an ID for the user
            }

            // 2. Check if any Categories exist. If not, add the defaults.
            if (!context.Categories.Any())
            {
                var defaultCategories = new List<Category>
                {
                    // Incomes
                    new Category { Name = "Salary", Type = "income", Color = "#28a745", Icon = "money-bill" },
                    new Category { Name = "Freelance", Type = "income", Color = "#20c997", Icon = "laptop" },
                    
                    // Expenses
                    new Category { Name = "Food & Dining", Type = "expense", Color = "#ffc107", Icon = "utensils" },
                    new Category { Name = "Rent", Type = "expense", Color = "#dc3545", Icon = "home" },
                    new Category { Name = "Utilities", Type = "expense", Color = "#17a2b8", Icon = "bolt" },
                    new Category { Name = "Entertainment", Type = "expense", Color = "#6f42c1", Icon = "film" }
                };

                context.Categories.AddRange(defaultCategories);
                context.SaveChanges();
            }

            // 3. Check if any Expenses exist. If not, add some sample transactions.
            if (!context.Expenses.Any())
            {
                // Fetch the user and a few categories we just created to get their Database IDs
                var user = context.Users.FirstOrDefault(u => u.Username == "Mokshith");
                var salaryCategory = context.Categories.FirstOrDefault(c => c.Name == "Salary");
                var foodCategory = context.Categories.FirstOrDefault(c => c.Name == "Food & Dining");
                var rentCategory = context.Categories.FirstOrDefault(c => c.Name == "Rent");

                // Ensure we successfully found them before adding expenses
                if (user != null && salaryCategory != null && foodCategory != null && rentCategory != null)
                {
                    var defaultExpenses = new List<Expense>
                    {
                        new Expense
                        {
                            UserId = user.Id,
                            CategoryId = salaryCategory.Id,
                            Title = "Internship Stipend",
                            Amount = 25000.00m,
                            Description = "Monthly stipend from AYKAN",
                            TransactionDate = DateTime.UtcNow.AddDays(-5)
                        },
                        new Expense
                        {
                            UserId = user.Id,
                            CategoryId = rentCategory.Id,
                            Title = "Room Rent",
                            Amount = 5500.00m,
                            Description = "Monthly rent paid",
                            TransactionDate = DateTime.UtcNow.AddDays(-2)
                        },
                        new Expense
                        {
                            UserId = user.Id,
                            CategoryId = foodCategory.Id,
                            Title = "Lunch with team",
                            Amount = 450.50m,
                            Description = "Pizza and sodas",
                            TransactionDate = DateTime.UtcNow
                        }
                    };

                    context.Expenses.AddRange(defaultExpenses);
                    context.SaveChanges();
                }
            }
        }
    }
}
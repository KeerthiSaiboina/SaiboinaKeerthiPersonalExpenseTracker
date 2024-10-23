# Personal Expense Tracker

## Setup

1. Clone the repository:
2. Install dependencies:
3. Run the server:

## API Documentation

### 1. POST /transactions

- **Description**: Adds a new transaction (income or expense).
- **Request Body**:

```json
{
  "type": "income/expense",
  "category": "string",
  "amount": "number",
  "date": "YYYY-MM-DD",
  "description": "string"
}
```

2. GET /transactions
   ###Description: Retrieves all transactions.
3. GET /transactions/
   ###Description: Retrieves a specific transaction by ID.
4. PUT /transactions/
   ###Description: Updates a transaction by ID.
5. DELETE /transactions/
   ###Description: Deletes a transaction by ID.
6. GET /summary
   ###Description: Retrieves a summary of transactions (total income, total expenses, and balance).

### 7. **Bonus (Optional Enhancements)**

- **Pagination**: Add pagination to `GET /transactions` for large data.
- **User Authentication**: Add user registration/login using JWT and associate transactions with specific users.
- **Reports**: Add an endpoint to generate monthly or weekly spending reports by category.

---

This should give you a solid foundation for your **Personal Expense Tracker** project!

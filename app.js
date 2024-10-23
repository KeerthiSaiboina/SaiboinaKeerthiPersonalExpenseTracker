const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT CHECK(type IN ('income', 'expense'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT CHECK(type IN ('income', 'expense')),
    category TEXT,
    amount REAL,
    date TEXT,
    description TEXT
  )`);
});

// API: Add a new transaction (income or expense)
app.post("/transactions", (req, res) => {
  const { type, category, amount, date, description } = req.body;
  const query = `INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [type, category, amount, date, description], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// API: Get all transactions
app.get("/transactions", (req, res) => {
  const query = "SELECT * FROM transactions";
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ transactions: rows });
  });
});

// API: Get a transaction by ID
app.get("/transactions/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM transactions WHERE id = ?";
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ transaction: row });
  });
});

// API: Update a transaction by ID
app.put("/transactions/:id", (req, res) => {
  const { id } = req.params;
  const { type, category, amount, date, description } = req.body;
  const query = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`;
  db.run(
    query,
    [type, category, amount, date, description, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json({ message: "Transaction updated" });
    }
  );
});

// API: Delete a transaction by ID
app.delete("/transactions/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM transactions WHERE id = ?";
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted" });
  });
});

// API: Get summary of transactions (total income, expenses, balance)
app.get("/summary", (req, res) => {
  const summaryQuery = `
    SELECT
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses,
      SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance
    FROM transactions
  `;
  db.get(summaryQuery, [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;

// src/electron/db/schema.js

/**
 * Initializes all tables in the SQLite database.
 * @param {Database} db - An instance of better-sqlite3 database
 */
export const initializeTables = (db) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      houseNumber TEXT,
      phoneNumber TEXT,
      quantity INTEGER,
      rate REAL,
      total_amount REAL,
      orderType TEXT CHECK(orderType IN ('delivery', 'walk-in', 'bulk')),
      remarks TEXT,
      status TEXT DEFAULT 'pending',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      amount_paid REAL,
      payment_method TEXT,
      paidAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );

    CREATE TABLE IF NOT EXISTS dues_ledger (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      houseNumber TEXT,
      order_id INTEGER,
      due_amount REAL,
      paid_amount REAL DEFAULT 0,
      isSettled BOOLEAN DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );

    CREATE TABLE IF NOT EXISTS delivery_boys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phoneNumber TEXT,
      salary TEXT,
      iDCard TEXT,
      remarks TEXT,
      isDeleted INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS order_delivery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      delivery_boy_id INTEGER,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (delivery_boy_id) REFERENCES delivery_boys(id)
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      amount REAL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

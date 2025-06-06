db.prepare(
  `
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    houseNumber TEXT,
    phoneNumber TEXT,
    quantity INTEGER,
    rate TEXT,
    remarks TEXT,
    status TEXT DEFAULT 'pending',
    createdAt TEXT
  )
`
).run();

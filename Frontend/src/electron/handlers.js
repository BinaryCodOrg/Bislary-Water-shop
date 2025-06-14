// src/electron/handlers.js
import { ipcMain } from "electron";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database(path.join(__dirname, "../../waterData.db"));

// --- TABLE CREATION --- //
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
  remarks TEXT
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
  )
`);

// --- CRUD FOR ORDERS --- //
ipcMain.handle("order:add", async (event, order) => {
  const stmt = db.prepare(`
    INSERT INTO orders (houseNumber, phoneNumber, quantity, rate, total_amount, orderType, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    order.houseNumber || "",
    order.phoneNumber || "",
    parseFloat(order.quantity) || 0,
    parseFloat(order.rate.replace(/[^0-9.-]+/g, "")) || 0,
    (parseFloat(order.quantity) || 0) *
      (parseFloat(order.rate.replace(/[^0-9.-]+/g, "")) || 0),
    order.orderType || "delivery",
    order.remarks || ""
  );
  return { success: true, id: info.lastInsertRowid };
});

ipcMain.handle("order:getAll", () => {
  return db.prepare(`SELECT * FROM orders ORDER BY createdAt DESC`).all();
});

ipcMain.handle("order:delete", (event, orderId) => {
  const result = db.prepare("DELETE FROM orders WHERE id = ?").run(orderId);
  return { success: result.changes > 0 };
});

ipcMain.handle("order:updateStatus", (event, { orderId, newStatus }) => {
  const result = db
    .prepare("UPDATE orders SET status = ? WHERE id = ?")
    .run(newStatus, orderId);
  return { success: result.changes > 0 };
});

ipcMain.handle("order:getAllHouseNumbers", () => {
  const result = db.prepare("SELECT DISTINCT houseNumber FROM orders").all();
  return result.map((r) => r.houseNumber);
});

// --- CRUD FOR PAYMENTS --- //
ipcMain.handle("payment:add", (event, payment) => {
  const stmt = db.prepare(`
    INSERT INTO payments (order_id, amount_paid, payment_method)
    VALUES (?, ?, ?)
  `);
  const info = stmt.run(
    payment.order_id,
    payment.amount_paid,
    payment.payment_method
  );
  return { success: true, id: info.lastInsertRowid };
});

ipcMain.handle("payment:getByOrder", (event, order_id) => {
  return db.prepare("SELECT * FROM payments WHERE order_id = ?").all(order_id);
});

// --- CRUD FOR DUES LEDGER --- //
ipcMain.handle("due:add", (event, due) => {
  const stmt = db.prepare(`
    INSERT INTO dues_ledger (houseNumber, order_id, due_amount, paid_amount)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(
    due.houseNumber,
    due.order_id,
    due.due_amount,
    due.paid_amount || 0
  );
  return { success: true, id: info.lastInsertRowid };
});

ipcMain.handle("due:getAll", () => {
  return db.prepare("SELECT * FROM dues_ledger ORDER BY createdAt DESC").all();
});

ipcMain.handle("due:updatePayment", (event, { id, paid_amount }) => {
  const result = db
    .prepare(
      `
    UPDATE dues_ledger SET paid_amount = ?, isSettled = CASE WHEN ? >= due_amount THEN 1 ELSE 0 END
    WHERE id = ?
  `
    )
    .run(paid_amount, paid_amount, id);
  return { success: result.changes > 0 };
});

// --- CRUD FOR DELIVERY BOYS --- //
ipcMain.handle("deliveryBoy:add", (event, boy) => {
  const stmt = db.prepare(
    "INSERT INTO delivery_boys (name, phoneNumber, salary, iDCard, remarks) VALUES (?, ?, ?, ?, ?)"
  );
  const info = stmt.run(
    boy.name,
    boy.phoneNumber,
    boy.salary,
    boy.iDCard,
    boy.remarks
  );
  return { success: true, id: info.lastInsertRowid };
});

ipcMain.handle("deliveryBoy:getAll", () => {
  return db.prepare("SELECT * FROM delivery_boys").all();
});

// --- CRUD FOR ORDER DELIVERY ASSIGNMENT --- //
ipcMain.handle(
  "orderDelivery:assign",
  (event, { order_id, delivery_boy_id }) => {
    const stmt = db.prepare(
      "INSERT INTO order_delivery (order_id, delivery_boy_id) VALUES (?, ?)"
    );
    const info = stmt.run(order_id, delivery_boy_id);
    return { success: true, id: info.lastInsertRowid };
  }
);

//Automation Storage Method
ipcMain.handle("order:add:smart", async (event, order) => {
  const {
    houseNumber,
    phoneNumber,
    quantity,
    rate,
    remarks,
    orderType,
    status,
  } = order;

  // Calculate total due (simple quantity × rate)
  const totalDue =
    (parseFloat(quantity) || 0) *
    (parseFloat(rate.replace(/[^0-9.-]+/g, "")) || 0);

  const insertOrder = db.prepare(`
    INSERT INTO orders (houseNumber, phoneNumber, quantity, rate, total_amount, remarks, orderType, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = insertOrder.run(
    houseNumber,
    phoneNumber,
    quantity,
    rate,
    totalDue,
    remarks,
    orderType,
    status
  );
  const orderId = result.lastInsertRowid;

  if (status !== "complete") {
    const insertDue = db.prepare(`
      INSERT INTO dues_ledger (order_id, due_amount, houseNumber)
      VALUES (?, ?, ?)
      `);
    insertDue.run(orderId, totalDue, houseNumber);
  }

  return { success: true, id: orderId };
});

ipcMain.handle(
  "order:markComplete",
  async (event, { orderId, amount_paid, payment_method, deliveryBoy }) => {
    try {
      const getOrder = db.prepare(
        `SELECT total_amount FROM orders WHERE id = ?`
      );
      const order = getOrder.get(orderId);

      if (!order) {
        return { success: false, error: "Order not found." };
      }

      const totalAmount = order.total_amount;
      // const totalAmount = amount_paid;
      let status = "complete";

      // Determine payment status
      if (amount_paid < totalAmount) {
        status = "debit";
      } else if (amount_paid > totalAmount) {
        status = "credit";
      }

      // Update order status
      const updateOrder = db.prepare(
        `UPDATE orders SET status = ? WHERE id = ?`
      );
      updateOrder.run(status, orderId);

      // Insert payment record
      const insertPayment = db.prepare(`
        INSERT INTO payments (order_id, amount_paid, payment_method)
        VALUES (?, ?, ?)
      `);
      insertPayment.run(orderId, amount_paid, payment_method);
      const removeDue = db.prepare(
        `DELETE FROM dues_ledger WHERE order_id = ?`
      );
      // Check if dues_ledger record already exists
      const getDue = db
        .prepare(`SELECT * FROM dues_ledger WHERE order_id = ?`)
        .get(orderId);

      if (status === "debit") {
        const dueAmount = totalAmount - amount_paid;
        console.log(dueAmount, totalAmount, amount_paid, "if status is debit");
        if (getDue) {
          const updateDue = db.prepare(
            `UPDATE dues_ledger SET isSettled = ?, paid_amount = ? WHERE order_id = ?`
          );
          updateDue.run(dueAmount, amount_paid, orderId);
        }
      } else if (status === "credit") {
        const overpaidAmount = amount_paid - totalAmount;
        if (getDue) {
          const updateDue = db.prepare(
            `UPDATE dues_ledger SET isSettled = ?, paid_amount = ? WHERE order_id = ?`
          );
          updateDue.run(-overpaidAmount, amount_paid, orderId);
        }
      } else {
        // Fully paid
        if (getDue) removeDue.run(orderId);
      }

      // ✅ Insert into order_delivery
      const insertDelivery = db.prepare(`
        INSERT INTO order_delivery (order_id, delivery_boy_id)
        VALUES (?, ?)
      `);
      insertDelivery.run(orderId, deliveryBoy);

      return { success: true, status };
    } catch (error) {
      console.error("Error in order:markComplete:", error);
      return { success: false, error: error.message };
    }
  }
);

// --- Dues Ledger Summary --- //
ipcMain.handle("dues:isSettledSum", async (event, houseNumber) => {
  try {
    const stmt = db.prepare(`
      SELECT isSettled FROM dues_ledger WHERE houseNumber = ?
    `);
    const rows = stmt.all(houseNumber);

    const isSettledSum = rows.reduce(
      (sum, row) => sum + Number(row.isSettled || 0),
      0
    );

    return { success: true, isSettledSum };
  } catch (error) {
    console.error("Error in dues:isSettledSum:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("order:getDeliveryBoyName", async (event, orderId) => {
  try {
    // console.log(orderId, "order Id");
    // 1. Get order status
    const orderStmt = db.prepare(`SELECT status FROM orders WHERE id = ?`);
    const order = orderStmt.get(orderId);

    // console.log(order, "order");

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    const status = order.status.toLowerCase();
    if (status === "pending" || status === "cancelled") {
      return {
        success: false,
        message: "Order is not completed or delivered yet",
      };
    }

    // 2. Get delivery_boy_id from order_delivery
    const deliveryStmt = db.prepare(
      `SELECT delivery_boy_id FROM order_delivery WHERE order_id = ?`
    );
    const delivery = deliveryStmt.get(orderId);
    // console.log(delivery, "delivery");
    if (!delivery) {
      return { success: false, error: "Delivery record not found" };
    }

    // 3. Get delivery boy name from delivery_boys table
    const boyStmt = db.prepare(`SELECT name FROM delivery_boys WHERE id = ?`);
    const boy = boyStmt.get(delivery.delivery_boy_id);

    if (!boy) {
      return { success: false, error: "Delivery boy not found" };
    }

    return { success: true, name: boy.name };
  } catch (error) {
    console.error("Error in order:getDeliveryBoyName:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("orderDelivery:getAll", () => {
  return db
    .prepare(
      `
    SELECT od.*, o.houseNumber, d.name as deliveryBoyName FROM order_delivery od
    JOIN orders o ON od.order_id = o.id
    JOIN delivery_boys d ON od.delivery_boy_id = d.id
    ORDER BY od.id DESC
  `
    )
    .all();
});

// Walk-In / Ikram / Islam / Order adding
ipcMain.handle("order:add:walkIn", async (event, order) => {
  try {
    const { houseNumber, quantity, rate, remarks, payment_method } = order;

    // Calculate total amount
    const totalAmount =
      (parseFloat(quantity) || 0) *
      (parseFloat(rate.replace(/[^0-9.-]+/g, "")) || 0);

    // Insert order
    const insertOrder = db.prepare(`
      INSERT INTO orders (houseNumber, phoneNumber, quantity, rate, total_amount, remarks, status)
      VALUES (?, NULL, ?, ?, ?, ?, 'complete')
    `);

    const result = insertOrder.run(
      houseNumber,
      quantity,
      rate,
      totalAmount,
      remarks
    );

    const orderId = result.lastInsertRowid;

    // Insert into payments
    const insertPayment = db.prepare(`
      INSERT INTO payments (order_id, amount_paid, payment_method)
      VALUES (?, ?, ?)
    `);
    insertPayment.run(orderId, totalAmount, payment_method || "cash");

    return { success: true, id: orderId };
  } catch (err) {
    console.error("Error in order:add:walkIn:", err);
    return { success: false, error: err.message };
  }
});

// todays Sales Data
ipcMain.handle("stats:todaySummary", async () => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    // console.log(today);
    // Total Orders
    const totalSalesToday = db
      .prepare(
        `
      SELECT COUNT(*) as count
      FROM orders
      WHERE DATE(createdAt) = DATE(?)
    `
      )
      .get(today).count;

    // Total Revenue
    const totalRevenueToday = db
      .prepare(
        `
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM orders
      WHERE DATE(createdAt) = DATE(?)
    `
      )
      .get(today).total;

    // Delivery Revenue (orders that have delivery entry)
    const deliveryRevenueToday = db
      .prepare(
        `
      SELECT COALESCE(SUM(o.amount_paid), 0) as total
      FROM payments o
      JOIN orders d ON o.order_id = d.id
      WHERE DATE(createdAt) = DATE(?)
    `
      )
      .get(today).total;

    // Expenses
    const totalExpensesToday = db
      .prepare(
        `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM expenses
      WHERE DATE(createdAt) = DATE(?)
    `
      )
      .get(today).total;

    return {
      success: true,
      data: {
        totalSalesToday,
        totalRevenueToday,
        deliveryRevenueToday,
        totalExpensesToday,
      },
    };
  } catch (err) {
    console.error("Error in stats:todaySummary:", err);
    return { success: false, error: err.message };
  }
});

//Expances
ipcMain.handle("expense:add", async (event, { name, amount }) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO expenses (name, amount)
      VALUES (?, ?)
    `);
    const result = stmt.run(name, amount);
    return { success: true, id: result.lastInsertRowid };
  } catch (err) {
    console.error("Failed to add expense:", err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle("expense:getAll", async () => {
  try {
    const stmt = db.prepare("SELECT * FROM expenses ORDER BY createdAt DESC");
    const data = stmt.all();
    return { success: true, data };
  } catch (err) {
    console.error("Failed to fetch expenses:", err);
    return { success: false, error: err.message };
  }
});

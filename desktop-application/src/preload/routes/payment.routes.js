// src/electron/routes/expense.routes.js
import { ipcMain } from 'electron'

export function registerPaymentsRoutes(db) {
  ipcMain.handle('payment:add', (event, payment) => {
    const stmt = db.prepare(`
        INSERT INTO payments (order_id, amount_paid, payment_method)
        VALUES (?, ?, ?)
      `)
    const info = stmt.run(payment.order_id, payment.amount_paid, payment.payment_method)
    return { success: true, id: info.lastInsertRowid }
  })

  ipcMain.handle('payment:getByOrder', (event, order_id) => {
    return db.prepare('SELECT * FROM payments WHERE order_id = ?').all(order_id)
  })
}

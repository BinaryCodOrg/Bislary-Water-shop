// src/electron/routes/expense.routes.js
import { ipcMain } from 'electron'

export function registerOrderDeliveryRoutes(db) {
  ipcMain.handle('orderDelivery:assign', (event, { order_id, delivery_boy_id }) => {
    const stmt = db.prepare('INSERT INTO order_delivery (order_id, delivery_boy_id) VALUES (?, ?)')
    const info = stmt.run(order_id, delivery_boy_id)
    return { success: true, id: info.lastInsertRowid }
  })
  ipcMain.handle('orderDelivery:getAll', () => {
    return db
      .prepare(
        `
    SELECT od.*, o.houseNumber, d.name as deliveryBoyName FROM order_delivery od
    JOIN orders o ON od.order_id = o.id
    JOIN delivery_boys d ON od.delivery_boy_id = d.id
    ORDER BY od.id DESC
  `
      )
      .all()
  })
}

// src/electron/routes/expense.routes.js
import { ipcMain } from 'electron'

export function registerDeliveryBoyRoutes(db) {
  ipcMain.handle('deliveryBoy:add', (event, boy) => {
    const stmt = db.prepare(
      'INSERT INTO delivery_boys (name, phoneNumber, salary, iDCard, remarks) VALUES (?, ?, ?, ?, ?)'
    )
    const info = stmt.run(boy.name, boy.phoneNumber, boy.salary, boy.iDCard, boy.remarks)
    return { success: true, id: info.lastInsertRowid }
  })

  ipcMain.handle('deliveryBoy:getAll', () => {
    return db.prepare('SELECT * FROM delivery_boys').all()
  })

  ipcMain.handle('deliveryBoy:update', (event, boy) => {
    try {
      const stmt = db.prepare(
        `
       UPDATE delivery_boys
       SET name = ?, phoneNumber = ?, salary = ?, iDCard = ?, remarks = ?
       WHERE id = ?
       `
      )

      const result = stmt.run(
        boy.name,
        boy.phoneNumber,
        boy.salary,
        boy.iDCard,
        boy.remarks,
        boy.id
      )

      return { success: true, changes: result.changes }
    } catch (error) {
      console.error('Error updating delivery boy:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('deliveryBoy:delete', (event, id) => {
    const stmt = db.prepare(`
     UPDATE delivery_boys
     SET isDeleted = 1
     WHERE id = ?
   `)
    const info = stmt.run(id)
    return { success: info.changes > 0 }
  })
}

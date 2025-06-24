// src/electron/routes/expense.routes.js
import { ipcMain } from 'electron'

export function registerDuesRoutes(db) {
  ipcMain.handle('due:add', (event, due) => {
    const stmt = db.prepare(`
    INSERT INTO dues_ledger (houseNumber, order_id, due_amount, paid_amount)
    VALUES (?, ?, ?, ?)
  `)
    const info = stmt.run(due.houseNumber, due.order_id, due.due_amount, due.paid_amount || 0)
    return { success: true, id: info.lastInsertRowid }
  })

  // ipcMain.handle("due:getAll", () => {
  //   return db.prepare("SELECT * FROM dues_ledger ORDER BY createdAt DESC").all();
  // });

  ipcMain.handle('due:getAll', () => {
    const query = `
    SELECT 
      d.*, 
      o.quantity AS Quantity
    FROM 
      dues_ledger d
    LEFT JOIN 
      orders o ON d.order_id = o.id
    ORDER BY 
      d.createdAt DESC
  `

    return db.prepare(query).all()
  })

  ipcMain.handle('due:updatePayment', (event, { id, paid_amount }) => {
    const result = db
      .prepare(
        `
    UPDATE dues_ledger SET paid_amount = ?, isSettled = CASE WHEN ? >= due_amount THEN 1 ELSE 0 END
    WHERE id = ?
  `
      )
      .run(paid_amount, paid_amount, id)
    return { success: result.changes > 0 }
  })

  ipcMain.handle('dues:isSettledSum', async (event, houseNumber) => {
    try {
      const stmt = db.prepare(`
      SELECT isSettled FROM dues_ledger WHERE houseNumber = ?
    `)
      const rows = stmt.all(houseNumber)

      const isSettledSum = rows.reduce((sum, row) => sum + Number(row.isSettled || 0), 0)

      return { success: true, isSettledSum }
    } catch (error) {
      console.error('Error in dues:isSettledSum:', error)
      return { success: false, error: error.message }
    }
  })
}

// src/electron/routes/expense.routes.js
import { ipcMain } from 'electron'

export function registerExpanseRoutes(db) {
  //Expances
  ipcMain.handle('expense:add', async (event, { name, amount }) => {
    try {
      const stmt = db.prepare(`
      INSERT INTO expenses (name, amount)
      VALUES (?, ?)
    `)
      const result = stmt.run(name, amount)
      return { success: true, id: result.lastInsertRowid }
    } catch (err) {
      console.error('Failed to add expense:', err)
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('expense:update', async (event, { id, name, amount }) => {
    try {
      const stmt = db.prepare(`
      UPDATE expenses
      SET name = ?, amount = ?
      WHERE id = ?
    `)
      const result = stmt.run(name, amount, id)

      if (result.changes === 0) {
        return { success: false, error: 'No expense found with the given ID.' }
      }

      return { success: true, message: 'Expense updated successfully.' }
    } catch (err) {
      console.error('Failed to update expense:', err)
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('expense:getAll', async () => {
    try {
      const stmt = db.prepare('SELECT * FROM expenses ORDER BY createdAt DESC')
      const data = stmt.all()
      return { success: true, data }
    } catch (err) {
      console.error('Failed to fetch expenses:', err)
      return { success: false, error: err.message }
    }
  })
}

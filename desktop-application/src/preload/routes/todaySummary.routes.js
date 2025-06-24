// src/electron/routes/expense.routes.js
import { ipcMain } from 'electron'
import isBetween from 'dayjs/plugin/isBetween'
import dayjs from 'dayjs'

export function registerSummaryRoutes(db) {
  ipcMain.handle('stats:todaySummary', async () => {
    try {
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
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
        .get(today).count

      // Total Revenue
      const totalRevenueToday = db
        .prepare(
          `
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM orders
      WHERE DATE(createdAt) = DATE(?)
    `
        )
        .get(today).total

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
        .get(today).total

      // Expenses
      const totalExpensesToday = db
        .prepare(
          `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM expenses
      WHERE DATE(createdAt) = DATE(?)
    `
        )
        .get(today).total

      return {
        success: true,
        data: {
          totalSalesToday,
          totalRevenueToday,
          deliveryRevenueToday,
          totalExpensesToday
        }
      }
    } catch (err) {
      console.error('Error in stats:todaySummary:', err)
      return { success: false, error: err.message }
    }
  })

  dayjs.extend(isBetween)

  ipcMain.handle('chart:getWeeklySummary', () => {
    const startOfWeek = dayjs().startOf('week').add(1, 'day') // Monday
    const endOfWeek = startOfWeek.add(6, 'day') // Sunday

    const orderQuery = `
    SELECT 
      strftime('%w', createdAt) as day, 
      SUM(total_amount) as total 
    FROM orders 
    WHERE date(createdAt) BETWEEN ? AND ?
    GROUP BY day
  `

    const expenseQuery = `
    SELECT 
      strftime('%w', createdAt) as day, 
      SUM(amount) as total 
    FROM expenses 
    WHERE date(createdAt) BETWEEN ? AND ?
    GROUP BY day
  `

    const orders = db
      .prepare(orderQuery)
      .all(startOfWeek.format('YYYY-MM-DD'), endOfWeek.format('YYYY-MM-DD'))
    const expenses = db
      .prepare(expenseQuery)
      .all(startOfWeek.format('YYYY-MM-DD'), endOfWeek.format('YYYY-MM-DD'))

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const totals = Array(7).fill(0)
    const exp = Array(7).fill(0)

    for (const row of orders) {
      const index = row.day === '0' ? 6 : row.day - 1
      totals[index] = Math.round(row.total)
    }

    for (const row of expenses) {
      const index = row.day === '0' ? 6 : row.day - 1
      exp[index] = Math.round(row.total)
    }

    return {
      labels: days,
      dataSeries: [
        { name: 'Total', data: totals },
        { name: 'Expanse', data: exp }
      ]
    }
  })
}

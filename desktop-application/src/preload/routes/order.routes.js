// src/electron/routes/order.routes.js
import { ipcMain } from 'electron'

export function registerOrderRoutes(db) {
  ipcMain.handle('order:add', async (event, order) => {
    const stmt = db.prepare(`
    INSERT INTO orders (houseNumber, phoneNumber, quantity, rate, total_amount, orderType, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
    const info = stmt.run(
      order.houseNumber || '',
      order.phoneNumber || '',
      parseFloat(order.quantity) || 0,
      parseFloat(order.rate.replace(/[^0-9.-]+/g, '')) || 0,
      (parseFloat(order.quantity) || 0) * (parseFloat(order.rate.replace(/[^0-9.-]+/g, '')) || 0),
      order.orderType || 'delivery',
      order.remarks || ''
    )
    return { success: true, id: info.lastInsertRowid }
  })

  ipcMain.handle('order:getAll', () => {
    return db.prepare(`SELECT * FROM orders ORDER BY createdAt DESC`).all()
  })

  ipcMain.handle('order:delete', (event, orderId) => {
    const result = db.prepare('DELETE FROM orders WHERE id = ?').run(orderId)
    return { success: result.changes > 0 }
  })

  ipcMain.handle('order:updateStatus', (event, { orderId, newStatus }) => {
    const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(newStatus, orderId)
    return { success: result.changes > 0 }
  })

  ipcMain.handle('order:getAllHouseNumbers', () => {
    const result = db.prepare('SELECT DISTINCT houseNumber FROM orders').all()
    return result.map((r) => r.houseNumber)
  })

  //Automation Storage Method
  ipcMain.handle('order:add:smart', async (event, order) => {
    const { houseNumber, phoneNumber, quantity, rate, remarks, orderType, status } = order

    // Calculate total due (simple quantity × rate)
    const totalDue = (parseFloat(quantity) || 0) * (parseFloat(rate.replace(/[^0-9.-]+/g, '')) || 0)

    const insertOrder = db.prepare(`
      INSERT INTO orders (houseNumber, phoneNumber, quantity, rate, total_amount, remarks, orderType, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const result = insertOrder.run(
      houseNumber,
      phoneNumber,
      quantity,
      rate,
      totalDue,
      remarks,
      orderType,
      status
    )
    const orderId = result.lastInsertRowid

    if (status !== 'complete') {
      const insertDue = db.prepare(`
        INSERT INTO dues_ledger (order_id, due_amount, houseNumber)
        VALUES (?, ?, ?)
        `)
      insertDue.run(orderId, totalDue, houseNumber)
    }

    return { success: true, id: orderId }
  })

  ipcMain.handle(
    'order:markComplete',
    async (event, { orderId, amount_paid, payment_method, deliveryBoy }) => {
      try {
        const getOrder = db.prepare(`SELECT total_amount FROM orders WHERE id = ?`)
        const order = getOrder.get(orderId)

        if (!order) {
          return { success: false, error: 'Order not found.' }
        }

        const totalAmount = order.total_amount
        // const totalAmount = amount_paid;
        let status = 'complete'

        // Determine payment status
        if (amount_paid < totalAmount) {
          status = 'debit'
        } else if (amount_paid > totalAmount) {
          status = 'credit'
        }

        // Update order status
        const updateOrder = db.prepare(`UPDATE orders SET status = ? WHERE id = ?`)
        updateOrder.run(status, orderId)

        // Insert payment record
        const insertPayment = db.prepare(`
          INSERT INTO payments (order_id, amount_paid, payment_method)
          VALUES (?, ?, ?)
        `)
        insertPayment.run(orderId, amount_paid, payment_method)
        const removeDue = db.prepare(`DELETE FROM dues_ledger WHERE order_id = ?`)
        // Check if dues_ledger record already exists
        const getDue = db.prepare(`SELECT * FROM dues_ledger WHERE order_id = ?`).get(orderId)

        if (status === 'debit') {
          const dueAmount = totalAmount - amount_paid
          console.log(dueAmount, totalAmount, amount_paid, 'if status is debit')
          if (getDue) {
            const updateDue = db.prepare(
              `UPDATE dues_ledger SET isSettled = ?, paid_amount = ? WHERE order_id = ?`
            )
            updateDue.run(dueAmount, amount_paid, orderId)
          }
        } else if (status === 'credit') {
          const overpaidAmount = amount_paid - totalAmount
          if (getDue) {
            const updateDue = db.prepare(
              `UPDATE dues_ledger SET isSettled = ?, paid_amount = ? WHERE order_id = ?`
            )
            updateDue.run(-overpaidAmount, amount_paid, orderId)
          }
        } else {
          // Fully paid
          if (getDue) removeDue.run(orderId)
        }

        // ✅ Insert into order_delivery
        const insertDelivery = db.prepare(`
          INSERT INTO order_delivery (order_id, delivery_boy_id)
          VALUES (?, ?)
        `)
        insertDelivery.run(orderId, deliveryBoy)

        return { success: true, status }
      } catch (error) {
        console.error('Error in order:markComplete:', error)
        return { success: false, error: error.message }
      }
    }
  )

  ipcMain.handle('order:getDeliveryBoyName', async (event, orderId) => {
    try {
      // console.log(orderId, "order Id");
      // 1. Get order status
      const orderStmt = db.prepare(`SELECT status FROM orders WHERE id = ?`)
      const order = orderStmt.get(orderId)

      // console.log(order, "order");

      if (!order) {
        return { success: false, error: 'Order not found' }
      }

      const status = order.status.toLowerCase()
      if (status === 'pending' || status === 'cancelled') {
        return {
          success: false,
          message: 'Order is not completed or delivered yet'
        }
      }

      // 2. Get delivery_boy_id from order_delivery
      const deliveryStmt = db.prepare(
        `SELECT delivery_boy_id FROM order_delivery WHERE order_id = ?`
      )
      const delivery = deliveryStmt.get(orderId)
      // console.log(delivery, "delivery");
      if (!delivery) {
        return { success: false, error: 'Delivery record not found' }
      }

      // 3. Get delivery boy name from delivery_boys table
      const boyStmt = db.prepare(`SELECT name FROM delivery_boys WHERE id = ?`)
      const boy = boyStmt.get(delivery.delivery_boy_id)

      if (!boy) {
        return { success: false, error: 'Delivery boy not found' }
      }

      return { success: true, name: boy.name }
    } catch (error) {
      console.error('Error in order:getDeliveryBoyName:', error)
      return { success: false, error: error.message }
    }
  })

  // Walk-In / Ikram / Islam / Order adding
  ipcMain.handle('order:add:walkIn', async (event, order) => {
    try {
      const { houseNumber, quantity, rate, remarks, payment_method } = order

      // Calculate total amount
      const totalAmount =
        (parseFloat(quantity) || 0) * (parseFloat(rate.replace(/[^0-9.-]+/g, '')) || 0)

      // Insert order
      const insertOrder = db.prepare(`
        INSERT INTO orders (houseNumber, phoneNumber, quantity, rate, total_amount, remarks, status)
        VALUES (?, NULL, ?, ?, ?, ?, 'complete')
      `)

      const result = insertOrder.run(houseNumber, quantity, rate, totalAmount, remarks)

      const orderId = result.lastInsertRowid

      // Insert into payments
      const insertPayment = db.prepare(`
        INSERT INTO payments (order_id, amount_paid, payment_method)
        VALUES (?, ?, ?)
      `)
      insertPayment.run(orderId, totalAmount, payment_method || 'cash')

      return { success: true, id: orderId }
    } catch (err) {
      console.error('Error in order:add:walkIn:', err)
      return { success: false, error: err.message }
    }
  })
}

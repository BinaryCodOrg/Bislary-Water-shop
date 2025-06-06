// ✅ preload.js (CommonJS)
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // Orders
  addOrder: (orderData) => ipcRenderer.invoke("order:add", orderData),
  getOrders: () => ipcRenderer.invoke("order:getAll"),
  deleteOrder: (orderId) => ipcRenderer.invoke("order:delete", orderId),
  updateOrderStatus: (orderId, newStatus) =>
    ipcRenderer.invoke("order:updateStatus", { orderId, newStatus }),
  getAllHouseNumbers: () => ipcRenderer.invoke("order:getAllHouseNumbers"),

  // Payments
  addPayment: (paymentData) => ipcRenderer.invoke("payment:add", paymentData),
  getPaymentsByOrder: (orderId) =>
    ipcRenderer.invoke("payment:getByOrder", orderId),

  // Dues Ledger
  addDue: (dueData) => ipcRenderer.invoke("due:add", dueData),
  getAllDues: () => ipcRenderer.invoke("due:getAll"),
  updateDuePayment: (id, paid_amount) =>
    ipcRenderer.invoke("due:updatePayment", { id, paid_amount }),

  // Delivery Boys
  addDeliveryBoy: (data) => ipcRenderer.invoke("deliveryBoy:add", data),
  getDeliveryBoys: () => ipcRenderer.invoke("deliveryBoy:getAll"),

  // Order Delivery Assignments
  assignOrderDelivery: (order_id, delivery_boy_id) =>
    ipcRenderer.invoke("orderDelivery:assign", { order_id, delivery_boy_id }),
  getOrderDeliveries: () => ipcRenderer.invoke("orderDelivery:getAll"),

  //Smart Automation Setup
  addSmartOrder: (order) => ipcRenderer.invoke("order:add:smart", order),

  markOrderComplete: ({ orderId, amount_paid, payment_method, deliveryBoy }) =>
    ipcRenderer.invoke("order:markComplete", {
      orderId,
      amount_paid,
      payment_method,
      deliveryBoy,
    }),

  getIsSettledSum: (houseNumber) =>
    ipcRenderer.invoke("dues:isSettledSum", houseNumber),
  // Delivery Info
  getDeliveryBoyName: (orderId) =>
    ipcRenderer.invoke("order:getDeliveryBoyName", orderId),

  getTodayStats: () => ipcRenderer.invoke("stats:todaySummary"),

  addExpense: (expense) => ipcRenderer.invoke("expense:add", expense),
  getExpenses: () => ipcRenderer.invoke("expense:getAll"),
});

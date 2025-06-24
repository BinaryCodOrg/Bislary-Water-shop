// src/electron/handlers.js
import { ipcMain, app } from 'electron'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import { initializeTables } from './db/schema.js'
import { registerOrderRoutes } from './routes/order.routes.js'
import { registerExpanseRoutes } from './routes/expense.routes.js'
import { registerPaymentsRoutes } from './routes/payment.routes.js'
import { registerDuesRoutes } from './routes/due.routes.js'
import { registerSummaryRoutes } from './routes/todaySummary.routes.js'
import { registerDeliveryBoyRoutes } from './routes/deliveryBoy.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isPackaged = app.isPackaged

const dbPath = isPackaged
  ? path.join(app.getPath('userData'), 'waterData.db')
  : path.join(__dirname, '../../waterData.db')

const db = new Database(dbPath)

initializeTables(db) // this have all tables creation logic

registerOrderRoutes(db) // Register order routes

registerExpanseRoutes(db) // Register expense routes

registerPaymentsRoutes(db) // Register payment routes

registerDuesRoutes(db) // Register payment routes

registerSummaryRoutes(db) // Register summary routes

registerDeliveryBoyRoutes(db) // Register Delivery Boy Routes routes

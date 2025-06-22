# Bislary Water Shop Desktop Application

![Bislary Logo](./desktop-application/resources/icon.png)

A modern desktop application for managing water bottle delivery, order tracking, payments, and delivery staff using Electron, React, Vite, Ant Design, and Better-SQLite3.

---

## 📄 Project Overview

This is a cross-platform desktop application built with [Electron](https://www.electronjs.org/), powered by the [Vite](https://vitejs.dev/) build system and [React](https://react.dev/) for the UI. It enables water delivery shops to manage daily operations such as orders, payments, expenses, and delivery management.

---

## 💡 Features

### ✅ Orders Management

* Create, update, delete delivery, walk-in, and bulk orders
* Auto-calculate totals based on quantity and rate
* Attach remarks, payment info, and assign delivery boys

### ✉️ Delivery Assignment

* Assign orders to delivery boys
* Track delivery status

### 💳 Payments & Dues

* Record payments
* Track dues ledger
* Auto-settle dues

### 💼 Delivery Boys

* Add/edit/delete delivery personnel
* Assign deliveries

### 📈 Dashboard Statistics

* View today's revenue, expenses, and total orders

### 💸 Expenses

* Add/update daily expenses
* Get visual charts and breakdowns

---

## ✨ UI Framework

Built with **Ant Design v5** and **React Bootstrap**, for a smooth, responsive UI experience.

---

## 📊 Charts

Uses **Chart.js** for data visualizations and summaries.

---

## ⌨️ Keyboard Shortcuts

Common keyboard hotkeys included via `react-hotkeys-hook` for productivity:

* `Ctrl + N` → New Order
* `Ctrl + D` → Dashboard
* `Ctrl + E` → Add Expense

---

## 🗋 Database

* Local SQLite DB using **Better-SQLite3**
* Offline-first architecture
* Data stored in `userData` folder during runtime

To migrate DB to another PC, copy `waterData.db` from:

```
C:\Users\<user>\AppData\Roaming\Bislary\waterData.db
```

---

## 🌐 Fonts

This app uses custom fonts like `Poppins`, `DM Sans`, `Paprika`, `Lilita One`, and `Inria Serif`, locally imported to support CSP restrictions.

---

## 🚀 Build & Packaging

Electron-Vite handles fast development with hot module reloading. The app is packaged using **electron-builder**.

```bash
npm run build:win   # Windows build
npm run build:mac   # macOS build
npm run build:linux # Linux build
```

---

## ⚙️ Technologies Used

| Category   | Libraries                                    |
| ---------- | -------------------------------------------- |
| UI         | React, Ant Design, React Bootstrap           |
| State      | Recoil                                       |
| Charts     | Chart.js                                     |
| Forms      | Formik, Yup                                  |
| DB         | Better-SQLite3                               |
| PDF Export | jsPDF, autoTable                             |
| Others     | axios, react-hotkeys-hook, react-select, aos |

---

## 📖 Documentation

This application is structured following modern best practices:

* **Preload API**: Exposes custom secure APIs via `contextBridge`
* **IPC Communication**: All database interactions use `ipcMain.handle`
* **Main Process**: Loads renderer conditionally, supports packaging
* **Renderer Process**: React-based UI with routing and hooks

---

## © License & Ownership

This application is **owned and maintained by [BinaryCod](https://binarycod.com)**. All rights reserved. Unauthorized duplication or distribution is prohibited.

---

## 👨‍💼 Developers

* **Usama Faheem Ahmed**
  [Portfolio](https://usamafaheemahmed.com) | [GitHub](https://github.com/usamafaheemAhmed)

---

## 🔗 Useful Links

* [BinaryCod](https://binarycod.com)
* [React](https://react.dev)
* [Vite](https://vitejs.dev)
* [Electron](https://www.electronjs.org/)

---

## 🎉 Screenshots

![img1](./images/just%20opened.png)
![img2](./images/Tables%20view.png)

---

## 🚀 Contributing

Not open for external contributions at the moment.

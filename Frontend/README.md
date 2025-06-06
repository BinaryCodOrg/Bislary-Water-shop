# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Electron.js

Electron is used to make this app for desktop to check development command is
npm run electron-dev

to Start app
npm run electron-start

Build the Windows Executable
Use Electron Packager or Electron Builder for production builds:

bash
npx electron-packager . YourAppName --platform=win32 --arch=x64 --out=build --overwrite
or

bash
npx electron-builder
The output will include a .exe file that users can run on Windows.

Package Your Application: Use Electron Packager or Electron Forge to build the app:

Install Electron Packager:
bash
npm install electron-packager --save-dev
Build your app for Windows:
bash
npx electron-packager . YourAppName --platform=win32 --arch=x64 --out=build --overwrite

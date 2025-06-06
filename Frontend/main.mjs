import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

let mainWindow;

// Derive the __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });


  const indexPath = `file://${path.join(__dirname, 'dist', 'index.html').replace(/ /g, '%20')}`;
  console.log(`Loading file: ${indexPath}`);

  mainWindow.loadURL(indexPath)
    .catch(err => console.error(`Failed to load index.html: ${err.message}`));


  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`Failed to load: ${errorDescription}`);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


import { app, BrowserWindow, screen, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { IPC_CHANNELS, DEFAULT_CONFIG, type AppConfig } from '../shared/types'
import { WINDOW } from '../shared/constants'

const __dirname = dirname(fileURLToPath(import.meta.url))

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err)
})
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason)
})

let petWindow: BrowserWindow | null = null
let chatWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isDragging = false
let dragOffset = { x: 0, y: 0 }

// Simple config store (no electron-store dep needed for MVP)
let config: AppConfig = { ...DEFAULT_CONFIG }

function createPetWindow(): BrowserWindow {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { height } = primaryDisplay.workAreaSize
  const x = 0
  const y = height - WINDOW.PET.HEIGHT - 50

  const win = new BrowserWindow({
    width: WINDOW.PET.WIDTH,
    height: WINDOW.PET.HEIGHT,
    x,
    y,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  const rendererUrl = process.env['ELECTRON_RENDERER_URL']
  if (rendererUrl) {
    win.loadURL(rendererUrl + '/pet.html')
  } else {
    win.loadFile(join(__dirname, '../renderer/pet.html'))
  }

  // win.webContents.openDevTools({ mode: 'detach' })
  win.webContents.on('console-message', (_e, level, msg) => {
    console.log(`[pet] ${msg}`)
  })
  win.webContents.on('render-process-gone', (_e, details) => {
    console.error(`[pet] renderer crashed:`, details)
  })
  win.webContents.on('did-finish-load', () => {
    console.log('[pet] loaded OK')
  })
  win.webContents.on('did-fail-load', (_e, errorCode, errorDesc) => {
    console.error(`[pet] load failed: ${errorCode} ${errorDesc}`)
  })

  return win
}

function createChatWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: WINDOW.CHAT.WIDTH,
    height: WINDOW.CHAT.HEIGHT,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  const rendererUrl = process.env['ELECTRON_RENDERER_URL']
  if (rendererUrl) {
    win.loadURL(rendererUrl + '/chat.html')
  } else {
    win.loadFile(join(__dirname, '../renderer/chat.html'))
  }

  return win
}

function createTray(): Tray {
  // Create a simple tray icon (16x16 red square as placeholder)
  const icon = nativeImage.createEmpty()
  const trayItem = new Tray(icon)
  trayItem.setToolTip('Lobster Pet 🦞')

  const contextMenu = Menu.buildFromTemplate([
    { label: '🦞 Show Pet', click: () => petWindow?.show() },
    { label: '💬 Open Chat', click: () => openChat() },
    { type: 'separator' },
    { label: '⚙ Settings', click: () => openChat() },
    { label: '❌ Quit', click: () => { app.quit() } }
  ])

  trayItem.setContextMenu(contextMenu)
  return trayItem
}

function openChat() {
  if (!chatWindow) {
    chatWindow = createChatWindow()
  }
  chatWindow.show()

  // Position chat window near pet
  if (petWindow) {
    const petBounds = petWindow.getBounds()
    chatWindow.setBounds({
      x: petBounds.x + WINDOW.PET.WIDTH + 10,
      y: petBounds.y - 100
    })
  }
}

function closeChat() {
  chatWindow?.hide()
}

// IPC handlers
function setupIPC() {
  ipcMain.on(IPC_CHANNELS.OPEN_CHAT, () => openChat())
  ipcMain.on(IPC_CHANNELS.CLOSE_CHAT, () => closeChat())
  ipcMain.on(IPC_CHANNELS.QUIT_APP, () => app.quit())
  ipcMain.on(IPC_CHANNELS.TOGGLE_PET, () => {
    if (petWindow?.isVisible()) petWindow.hide()
    else petWindow?.show()
  })

  // Drag handling
  ipcMain.on(IPC_CHANNELS.DRAG_START, (_event, offsetX: number, offsetY: number) => {
    isDragging = true
    dragOffset = { x: offsetX, y: offsetY }
  })

  ipcMain.on(IPC_CHANNELS.DRAG_MOVE, (_event, screenX: number, screenY: number) => {
    if (isDragging && petWindow) {
      petWindow.setBounds({
        x: Math.round(screenX - dragOffset.x),
        y: Math.round(screenY - dragOffset.y),
        width: WINDOW.PET.WIDTH,
        height: WINDOW.PET.HEIGHT
      })
      // Move chat window with pet if open
      if (chatWindow?.isVisible()) {
        chatWindow.setBounds({
          x: Math.round(screenX - dragOffset.x) + WINDOW.PET.WIDTH + 10,
          y: Math.round(screenY - dragOffset.y) - 100,
          width: WINDOW.CHAT.WIDTH,
          height: WINDOW.CHAT.HEIGHT
        })
      }
    }
  })

  ipcMain.on(IPC_CHANNELS.DRAG_END, () => {
    isDragging = false
  })

  // Config
  ipcMain.handle(IPC_CHANNELS.GET_CONFIG, () => config)
  ipcMain.handle(IPC_CHANNELS.SET_CONFIG, (_event, newConfig: AppConfig) => {
    config = { ...config, ...newConfig }
  })
}

// App lifecycle
app.whenReady().then(() => {
  petWindow = createPetWindow()
  tray = createTray()
  setupIPC()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      petWindow = createPetWindow()
    }
  })
})

app.on('window-all-closed', () => {
  // Don't quit - keep running in tray
})

app.on('before-quit', () => {
  tray?.destroy()
})

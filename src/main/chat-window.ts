import { BrowserWindow } from 'electron'
import { WINDOW } from '../shared/constants'
import { join } from 'path'

export function createChatWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: WINDOW.CHAT_WIDTH,
    height: WINDOW.CHAT_HEIGHT,
    transparent: false,
    frame: false,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // 关闭时隐藏而不是销毁
  win.on('close', (e) => {
    if (!win.isDestroyed()) {
      e.preventDefault()
      win.hide()
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL + '/chat.html')
  } else {
    win.loadFile(join(__dirname, '../renderer/chat.html'))
  }

  return win
}

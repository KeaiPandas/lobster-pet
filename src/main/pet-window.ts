import { BrowserWindow } from 'electron'
import { WINDOW } from '../shared/constants'
import { join } from 'path'

export function createPetWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: WINDOW.PET_WIDTH,
    height: WINDOW.PET_HEIGHT,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // 开发环境加载 dev server，生产环境加载打包文件
  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL + '/pet.html')
  } else {
    win.loadFile(join(__dirname, '../renderer/pet.html'))
  }

  return win
}

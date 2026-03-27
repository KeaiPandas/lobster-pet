import { ipcMain, BrowserWindow } from 'electron'

export function registerIpcHandlers(
  petWindow: BrowserWindow | null,
  chatWindow: BrowserWindow | null
) {
  ipcMain.handle('open-chat', () => {
    chatWindow?.show()
    chatWindow?.focus()
  })

  ipcMain.handle('close-chat', () => {
    chatWindow?.hide()
  })

  ipcMain.handle('set-pet-state', (_e, state: string) => {
    petWindow?.webContents.send('pet-state-changed', state)
  })
}

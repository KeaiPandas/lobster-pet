const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  dragStart: (offsetX: number, offsetY: number) => ipcRenderer.send('drag-start', offsetX, offsetY),
  dragMove: (screenX: number, screenY: number) => ipcRenderer.send('drag-move', screenX, screenY),
  dragEnd: () => ipcRenderer.send('drag-end'),
  openChat: () => ipcRenderer.send('open-chat'),
  closeChat: () => ipcRenderer.send('close-chat'),
  getConfig: () => ipcRenderer.invoke('get-config'),
  setConfig: (config: any) => ipcRenderer.invoke('set-config', config),
})

interface ElectronAPI {
  openChat: () => void
  closeChat: () => void
  togglePet: () => void
  quitApp: () => void
  dragStart: () => void
  dragMove: (dx: number, dy: number) => void
  dragEnd: () => void
  getConfig: () => Promise<unknown>
  setConfig: (config: unknown) => Promise<void>
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}

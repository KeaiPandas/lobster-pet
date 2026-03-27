export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export type PetState = 'idle' | 'attention' | 'thinking' | 'chatting'

export interface AppConfig {
  gatewayUrl: string
  gatewayToken: string
  model: string
}

export const DEFAULT_CONFIG: AppConfig = {
  gatewayUrl: 'http://127.0.0.1:18789',
  gatewayToken: '',
  model: 'openclaw:main'
}

// IPC channels
export const IPC_CHANNELS = {
  OPEN_CHAT: 'open-chat',
  CLOSE_CHAT: 'close-chat',
  DRAG_START: 'drag-start',
  DRAG_MOVE: 'drag-move',
  DRAG_END: 'drag-end',
  GET_CONFIG: 'get-config',
  SET_CONFIG: 'set-config',
  TOGGLE_PET: 'toggle-pet',
  QUIT_APP: 'quit-app'
} as const

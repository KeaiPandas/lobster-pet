import { create } from 'zustand'
import type { Message, PetState } from '../shared/types'

interface ChatStore {
  messages: Message[]
  isStreaming: boolean
  petState: PetState
  addMessage: (msg: Message) => void
  updateLastAssistantMessage: (content: string) => void
  setStreaming: (v: boolean) => void
  setPetState: (s: PetState) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isStreaming: false,
  petState: 'idle',

  addMessage: (msg) =>
    set((s) => ({ messages: [...s.messages, msg] })),

  updateLastAssistantMessage: (content) =>
    set((s) => {
      const msgs = [...s.messages]
      const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant') {
        msgs[msgs.length - 1] = { ...last, content }
      }
      return { messages: msgs }
    }),

  setStreaming: (v) => set({ isStreaming: v }),

  setPetState: (s) => set({ petState: s }),

  clearMessages: () => set({ messages: [] }),
}))

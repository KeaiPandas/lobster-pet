import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useChatStore } from '../../services/store'
import { sendMessage } from '../../services/openclaw'
import type { Message } from '../../shared/types'
import './index.css'

export default function ChatWindow() {
  const messages = useChatStore((s) => s.messages)
  const isStreaming = useChatStore((s) => s.isStreaming)
  const addMessage = useChatStore((s) => s.addMessage)
  const updateLastAssistantMessage = useChatStore((s) => s.updateLastAssistantMessage)
  const setStreaming = useChatStore((s) => s.setStreaming)
  const setPetState = useChatStore((s) => s.setPetState)

  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isStreaming) return

    const userMsg: Message = { role: 'user', content: text }
    const assistantMsg: Message = { role: 'assistant', content: '' }
    addMessage(userMsg)
    addMessage(assistantMsg)
    setInput('')
    setStreaming(true)
    setPetState('thinking')

    await sendMessage(messages.concat(userMsg), {
      onChunk: (chunk) => {
        // 追加 chunk
        const current = useChatStore.getState().messages
        const last = current[current.length - 1]
        if (last?.role === 'assistant') {
          useChatStore.setState({
            messages: current.map((m, i) =>
              i === current.length - 1 ? { ...m, content: m.content + chunk } : m
            ),
          })
        }
      },
      onDone: () => {
        setStreaming(false)
        setPetState('chatting')
        inputRef.current?.focus()
      },
      onError: (err) => {
        setStreaming(false)
        setPetState('idle')
        const current = useChatStore.getState().messages
        const last = current[current.length - 1]
        if (last?.role === 'assistant') {
          useChatStore.setState({
            messages: current.map((m, i) =>
              i === current.length - 1 ? { ...m, content: `⚠️ ${err.message}` } : m
            ),
          })
        }
      },
    })
  }, [input, isStreaming, messages, addMessage, updateLastAssistantMessage, setStreaming, setPetState])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-window">
      {/* 自定义标题栏 */}
      <div className="chat-titlebar">
        <div className="titlebar-text">🦞 Lobster Chat</div>
        <button
          className="titlebar-close"
          onClick={() => (window as any).api?.closeChat()}
        >
          ✕
        </button>
      </div>

      {/* 消息列表 */}
      <div className="chat-messages" ref={listRef}>
        {messages.length === 0 && (
          <div className="chat-empty">点击下方输入消息开始对话 🦞</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
            <div className="msg-avatar">{msg.role === 'user' ? '🧑' : '🦞'}</div>
            <div className="msg-content">{msg.content || (isStreaming && msg.role === 'assistant' ? '▊' : '')}</div>
          </div>
        ))}
        {isStreaming && messages[messages.length - 1]?.content && (
          <span className="cursor-blink">▊</span>
        )}
      </div>

      {/* 输入栏 */}
      <div className="chat-input-bar">
        <input
          ref={inputRef}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          disabled={isStreaming}
          autoFocus
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={isStreaming || !input.trim()}
        >
          发送
        </button>
      </div>

      <style>{chatCss}</style>
    </div>
  )
}

const chatCss = `
.chat-window {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1a1a2e;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  border-radius: 12px;
  overflow: hidden;
}

/* 标题栏 */
.chat-titlebar {
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  height: 40px;
  background: #16213e;
  border-bottom: 1px solid #0f3460;
}
.titlebar-text {
  font-weight: 600;
  font-size: 13px;
  color: #e94560;
}
.titlebar-close {
  -webkit-app-region: no-drag;
  background: none;
  border: none;
  color: #888;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}
.titlebar-close:hover {
  background: #e94560;
  color: #fff;
}

/* 消息列表 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chat-empty {
  text-align: center;
  color: #555;
  margin-top: 40px;
}
.chat-msg {
  display: flex;
  gap: 8px;
  max-width: 90%;
}
.chat-msg-user {
  align-self: flex-end;
  flex-direction: row-reverse;
}
.msg-avatar {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.msg-content {
  padding: 8px 12px;
  border-radius: 12px;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
}
.chat-msg-user .msg-content {
  background: #0f3460;
  border-bottom-right-radius: 4px;
}
.chat-msg-assistant .msg-content {
  background: #16213e;
  border-bottom-left-radius: 4px;
}
.cursor-blink {
  animation: blink 0.8s step-end infinite;
  color: #e94560;
  font-weight: 300;
}
@keyframes blink {
  50% { opacity: 0; }
}

/* 输入栏 */
.chat-input-bar {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #16213e;
  border-top: 1px solid #0f3460;
}
.chat-input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #0f3460;
  background: #1a1a2e;
  color: #e0e0e0;
  outline: none;
  font-size: 14px;
}
.chat-input:focus {
  border-color: #e94560;
}
.chat-input::placeholder {
  color: #555;
}
.chat-send-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: #e94560;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.chat-send-btn:hover:not(:disabled) {
  background: #c0392b;
}
.chat-send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
`
